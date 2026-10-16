import { collection, doc, getDocs, getDoc, setDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus } from '../types';
import { getProductById, updateProduct } from './productService';
import { getStoreSettings } from './settingsService';
import { validateCoupon } from './couponService';

const LOCAL_STORAGE_KEY = 'fnp_orders_v1';

const getLocalOrders = (): Order[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveLocalOrders = (orders: Order[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
};

export interface OrderPlacementPayload {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}

export const verifyAndCreateOrder = async (payload: OrderPlacementPayload): Promise<Order> => {
  // 1. Fetch live store settings for authoritative shipping rules
  const settings = await getStoreSettings();

  if (!payload.items || payload.items.length === 0) {
    throw new Error('Your cart is empty. Please add items before checking out.');
  }

  // 2. Authoritative price & inventory re-verification
  const verifiedItems: OrderItem[] = [];
  let verifiedSubtotal = 0;

  for (const item of payload.items) {
    if (item.quantity <= 0) {
      throw new Error('Invalid item quantity.');
    }

    const liveProduct = await getProductById(item.productId);
    if (!liveProduct || !liveProduct.published) {
      throw new Error(`Product not found or is no longer available.`);
    }

    if (liveProduct.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for "${liveProduct.name}". Only ${liveProduct.stock} unit(s) left in stock.`
      );
    }

    const unitPrice = liveProduct.salePrice !== undefined && liveProduct.salePrice > 0
      ? liveProduct.salePrice
      : liveProduct.price;

    const itemTotal = unitPrice * item.quantity;
    verifiedSubtotal += itemTotal;

    verifiedItems.push({
      productId: liveProduct.id,
      name: liveProduct.name,
      price: unitPrice,
      quantity: item.quantity,
      image: liveProduct.images[0] || '',
      total: itemTotal
    });
  }

  // 3. Authoritative shipping calculation
  const shippingFee = verifiedSubtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;

  // 4. Authoritative discount verification
  let discount = 0;
  let validCouponCode: string | undefined = undefined;

  if (payload.couponCode) {
    const couponResult = validateCoupon(payload.couponCode, verifiedSubtotal);
    if (couponResult.valid) {
      discount = couponResult.discountAmount;
      validCouponCode = couponResult.coupon?.code;
    }
  }

  // 5. Authoritative total calculation
  const verifiedTotal = Math.max(0, verifiedSubtotal + shippingFee - discount);

  // 6. Generate order identifiers
  const orderId = 'ord-' + Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const orderNumber = `FNP-${new Date().getFullYear()}-${randomSuffix}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    userId: payload.userId,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerPhone: payload.customerPhone,
    shippingAddress: payload.shippingAddress,
    items: verifiedItems,
    subtotal: verifiedSubtotal,
    shippingFee,
    discount,
    couponCode: validCouponCode,
    total: verifiedTotal,
    paymentMethod: payload.paymentMethod,
    paymentStatus: payload.paymentMethod === 'cod' ? 'pending' : 'paid',
    orderStatus: 'pending',
    notes: payload.notes,
    createdAt: now,
    updatedAt: now
  };

  // 7. Atomic-style inventory deduction
  for (const item of payload.items) {
    const prod = await getProductById(item.productId);
    if (prod) {
      const newStock = Math.max(0, prod.stock - item.quantity);
      await updateProduct(prod.id, { stock: newStock });
    }
  }

  // 8. Persist order to Firestore / local storage
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
    } catch (err) {
      console.error('Firestore save order failed:', err);
    }
  }

  const localOrders = getLocalOrders();
  localOrders.unshift(newOrder);
  saveLocalOrders(localOrders);

  return newOrder;
};

export const getOrders = async (userId?: string): Promise<Order[]> => {
  if (isFirebaseConfigured && db) {
    try {
      let q;
      if (userId) {
        q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      } else {
        q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      }
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      }
    } catch (err) {
      console.warn('Firestore orders fetch failed:', err);
    }
  }

  const local = getLocalOrders();
  if (userId) {
    return local.filter(o => o.userId === userId);
  }
  return local;
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'orders', id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Order;
      }
    } catch (err) {
      console.warn('Firestore getOrderById error:', err);
    }
  }
  const local = getLocalOrders();
  return local.find(o => o.id === id || o.orderNumber === id) || null;
};

export const updateOrderStatus = async (
  id: string,
  orderStatus: OrderStatus,
  paymentStatus?: PaymentStatus,
  trackingNumber?: string,
  trackingCarrier?: string
): Promise<void> => {
  const now = new Date().toISOString();
  const updates: Partial<Order> = {
    orderStatus,
    updatedAt: now,
    ...(paymentStatus && { paymentStatus }),
    ...(trackingNumber !== undefined && { trackingNumber }),
    ...(trackingCarrier !== undefined && { trackingCarrier })
  };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'orders', id), updates);
    } catch (err) {
      console.error('Firestore updateOrderStatus error:', err);
    }
  }

  const local = getLocalOrders();
  const idx = local.findIndex(o => o.id === id);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...updates };
    saveLocalOrders(local);
  }
};
