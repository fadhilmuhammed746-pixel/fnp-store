import { Coupon } from '../types';

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c-nextgen15',
    code: 'NEXTGEN15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 1000,
    isActive: true
  },
  {
    id: 'c-fnp500',
    code: 'FNP500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 3000,
    isActive: true
  },
  {
    id: 'c-vip20',
    code: 'VIP20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 5000,
    isActive: true
  }
];

export const validateCoupon = (code: string, subtotal: number): { valid: boolean; coupon?: Coupon; message: string; discountAmount: number } => {
  const normalized = code.trim().toUpperCase();
  const coupon = DEFAULT_COUPONS.find(c => c.code.toUpperCase() === normalized && c.isActive);

  if (!coupon) {
    return { valid: false, message: 'Invalid or expired coupon code.', discountAmount: 0 };
  }

  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `Minimum order amount for code ${coupon.code} is ₹${coupon.minOrderAmount.toLocaleString('en-IN')}.`,
      discountAmount: 0
    };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
  } else {
    discount = Math.min(coupon.discountValue, subtotal);
  }

  return {
    valid: true,
    coupon,
    message: `Applied ${coupon.code}! You saved ₹${discount.toLocaleString('en-IN')}`,
    discountAmount: discount
  };
};
