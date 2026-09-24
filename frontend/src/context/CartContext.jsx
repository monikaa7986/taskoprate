import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponService } from '../services/couponService';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'atelier_cart_items';
const COUPON_STORAGE_KEY = 'atelier_applied_coupon';

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const addToCart = (product, size = 'M', color = 'Standard', quantity = 1) => {
    const itemKey = `${product.id}-${size}-${color}`;
    const unitPrice = product.discount_price !== null && product.discount_price !== undefined 
      ? Number(product.discount_price) 
      : Number(product.price);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.key === itemKey);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        const maxStock = product.stock || 99;

        if (newQty > maxStock) {
          showToast(`Cannot add more. Only ${maxStock} in stock.`, 'warning');
          return prevItems;
        }

        updated[existingIndex].quantity = newQty;
        showToast(`Updated "${product.name}" quantity in cart (${newQty}).`, 'success');
        return updated;
      } else {
        showToast(`Added "${product.name}" to cart.`, 'success');
        return [
          ...prevItems,
          {
            key: itemKey,
            product_id: product.id,
            name: product.name,
            slug: product.slug,
            price: unitPrice,
            original_price: Number(product.price),
            primary_image: product.primary_image || (product.images && product.images[0]) || '',
            size,
            color,
            quantity,
            stock: product.stock || 50
          }
        ];
      }
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (itemKey) => {
    setCartItems((prev) => {
      const removed = prev.find((item) => item.key === itemKey);
      if (removed) {
        showToast(`Removed "${removed.name}" from cart.`, 'info');
      }
      return prev.filter((item) => item.key !== itemKey);
    });
  };

  const updateQuantity = (itemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.key === itemKey) {
          if (quantity > item.stock) {
            showToast(`Maximum available stock reached (${item.stock}).`, 'warning');
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Subtotal calculation
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= (appliedCoupon.min_order_amount || 0)) {
    if (appliedCoupon.discount_type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discount_value) / 100;
      if (appliedCoupon.max_discount_amount && discountAmount > appliedCoupon.max_discount_amount) {
        discountAmount = appliedCoupon.max_discount_amount;
      }
    } else {
      discountAmount = Math.min(subtotal, appliedCoupon.discount_value);
    }
  }

  // Shipping rules
  const FREE_SHIPPING_THRESHOLD = 150.00;
  const STANDARD_SHIPPING_FEE = 12.00;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const shippingFee = cartItems.length === 0 || taxableSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - taxableSubtotal);

  // Taxes
  const TAX_RATE = 0.085; // 8.5%
  const tax = cartItems.length > 0 ? Number((taxableSubtotal * TAX_RATE).toFixed(2)) : 0;

  // Grand Total
  const total = Number((taxableSubtotal + shippingFee + tax).toFixed(2));
  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Coupon methods
  const applyCoupon = async (code) => {
    try {
      const res = await couponService.validateCoupon(code, subtotal);
      if (res.success && res.data) {
        setAppliedCoupon({
          code: res.data.code,
          discount_type: res.data.discount_type,
          discount_value: res.data.discount_value,
          discount_amount: res.data.discount_amount
        });
        showToast(res.message, 'success');
        return true;
      }
    } catch (error) {
      showToast(error.message || 'Invalid coupon code.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        subtotal,
        discountAmount,
        shippingFee,
        tax,
        total,
        freeShippingRemaining,
        FREE_SHIPPING_THRESHOLD,
        appliedCoupon,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
