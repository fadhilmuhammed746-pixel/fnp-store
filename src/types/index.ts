export type UserRole = 'customer' | 'admin';

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
  addresses?: UserAddress[];
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  category: string;
  categorySlug: string;
  images: string[];
  stock: number;
  featured?: boolean;
  trending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  specs?: Record<string, string>;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  order: number;
  productCount?: number;
}

export interface WebsiteCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  order: number;
  websiteCount?: number;
}

export interface Website {
  id: string;
  name: string;
  url: string;
  description: string;
  categoryId: string;
  category: string;
  thumbnail: string;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  quantity: number;
  stock: number;
}

export type PaymentMethod = 'cod' | 'razorpay' | 'card' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
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
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  trackingCarrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BannerOffer {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  badge?: string;
  bgGradient: string;
  image?: string;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  marketplaceConcept: string;
  tagline: string;
  secondaryTagline: string;
  currency: string;
  currencySymbol: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  shippingFee: number;
  freeShippingThreshold: number;
  enableCod: boolean;
  enableOnlinePayment: boolean;
  announcementText: string;
  showAnnouncement: boolean;
  banners: BannerOffer[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  orderNumber?: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}
