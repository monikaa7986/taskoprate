import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartDrawerOpen,
    closeCartDrawer,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    tax,
    total,
    freeShippingRemaining,
    FREE_SHIPPING_THRESHOLD,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const success = await applyCoupon(couponInput.trim());
    if (success) setCouponInput('');
    setCouponLoading(false);
  };

  const handleCheckoutClick = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const progressPercent = Math.min(100, Math.round(((FREE_SHIPPING_THRESHOLD - freeShippingRemaining) / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCartDrawer}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-fade-in">
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-900" />
              <h2 className="font-serif text-lg font-bold text-slate-900 tracking-tight">
                Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCartDrawer}
              className="p-1 text-stone-400 hover:text-slate-900 rounded-lg hover:bg-stone-100 hover:rotate-90 active:scale-90 transition-all duration-200 cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-stone-50 px-6 py-3 border-b border-stone-100">
            <div className="flex items-center justify-between text-xs font-medium text-slate-800 mb-1.5">
              {freeShippingRemaining > 0 ? (
                <span>
                  Add <span className="font-bold text-amber-800">{formatCurrency(freeShippingRemaining)}</span> for free express shipping
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Unlocked Complimentary Express Shipping!
                </span>
              )}
              <span className="text-[10px] text-stone-500 font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-700 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-100">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-base font-semibold text-slate-900 mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Discover our new arrivals and timeless silhouettes crafted from natural fibers.
                </p>
                <Button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/women');
                  }}
                  size="sm"
                >
                  Explore Collections
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.key} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.primary_image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=400&q=80'}
                    alt={item.name}
                    className="w-20 h-24 object-cover object-center rounded-lg bg-stone-100 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/products/${item.slug || item.product_id}`}
                          onClick={closeCartDrawer}
                          className="text-xs font-semibold text-slate-900 hover:text-amber-800 line-clamp-1 font-serif"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.key)}
                          className="text-stone-400 hover:text-red-500 p-1 transition-all duration-200 hover:scale-115 active:scale-90 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span>Size: <strong className="text-slate-700">{item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-slate-700">{item.color}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-md overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-stone-500 hover:text-black hover:bg-stone-100 active:scale-90 transition-all duration-150 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold text-slate-900 min-w-[20px] text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-stone-500 hover:text-black hover:bg-stone-100 active:scale-90 transition-all duration-150 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Totals and Coupon */}
          {cartItems.length > 0 && (
            <div className="border-t border-stone-100 p-6 bg-stone-50/50 space-y-4">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon: {appliedCoupon.code} (-{formatCurrency(discountAmount)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-slate-900 uppercase placeholder-normal"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    isLoading={couponLoading}
                  >
                    Apply
                  </Button>
                </form>
              )}

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 uppercase">Complimentary</strong> : formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8.5%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-slate-900">
                  <span>Total</span>
                  <span className="font-serif text-base">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Button
                  onClick={handleCheckoutClick}
                  className="w-full"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Proceed to Checkout • {formatCurrency(total)}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/cart');
                  }}
                  className="w-full text-center text-xs font-semibold text-stone-600 hover:text-black py-2 transition-colors uppercase tracking-wider"
                >
                  View Full Shopping Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
