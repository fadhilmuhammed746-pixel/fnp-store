import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { validateCoupon } from '../services/couponService';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  couponCode: string;
  discount: number;
  couponMessage: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  shippingFee: number;
  total: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'fnp_shopping_cart_v1';
const COUPON_STORAGE_KEY = 'fnp_applied_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    return localStorage.getItem(COUPON_STORAGE_KEY) || '';
  });

  const [discount, setDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Subtotal calculation
  const subtotal = cart.reduce((acc, item) => {
    const price = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    return acc + price * item.quantity;
  }, 0);

  // Recalculate coupon whenever subtotal changes
  useEffect(() => {
    if (couponCode && subtotal > 0) {
      const result = validateCoupon(couponCode, subtotal);
      if (result.valid) {
        setDiscount(result.discountAmount);
        setCouponMessage(result.message);
      } else {
        setDiscount(0);
        setCouponMessage(result.message);
      }
    } else {
      setDiscount(0);
      setCouponMessage('');
    }
  }, [couponCode, subtotal]);

  // Shipping rule: Free shipping over ₹2,999, else standard ₹149
  const shippingFee = subtotal > 0 ? (subtotal >= 2999 ? 0 : 149) : 0;
  const total = Math.max(0, subtotal + shippingFee - discount);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: Product, quantity = 1): boolean => {
    if (product.stock <= 0) return false;

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        const unitPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: unitPrice,
            salePrice: product.salePrice,
            image: product.images[0] || '',
            quantity: Math.min(quantity, product.stock),
            stock: product.stock
          }
        ];
      }
    });
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.productId === productId) {
          const clamped = Math.min(quantity, item.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const applyCoupon = (code: string): boolean => {
    const result = validateCoupon(code, subtotal);
    if (result.valid) {
      setCouponCode(code);
      localStorage.setItem(COUPON_STORAGE_KEY, code);
      setDiscount(result.discountAmount);
      setCouponMessage(result.message);
      return true;
    } else {
      setCouponMessage(result.message);
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    setCouponMessage('');
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        discount,
        couponMessage,
        applyCoupon,
        removeCoupon,
        subtotal,
        shippingFee,
        total,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
