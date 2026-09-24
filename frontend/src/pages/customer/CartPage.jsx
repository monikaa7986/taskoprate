import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

const CartPage = () => {
  const navigate = useNavigate();
  const {
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
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeFromCart
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const success = await applyCoupon(couponCode.trim());
    if (success) setCouponCode('');
    setCouponLoading(false);
  };

  const progressPercent = Math.min(100, Math.round(((FREE_SHIPPING_THRESHOLD - freeShippingRemaining) / FREE_SHIPPING_THRESHOLD) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          Looks like you haven't added any garments to your bag yet. Explore our latest arrivals or tailored essentials.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link to="/women">
            <Button size="lg">Explore Women's</Button>
          </Link>
          <Link to="/men">
            <Button variant="outline" size="lg">Explore Men's</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold mb-1">
            Order Review
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Shopping Bag ({itemsCount} Items)
          </h1>
        </div>
        <Link
          to="/women"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-black uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-slate-900">
          {freeShippingRemaining > 0 ? (
            <span>
              Add <strong className="text-amber-800">{formatCurrency(freeShippingRemaining)}</strong> more to unlock <strong className="text-emerald-700">Complimentary Express Shipping</strong>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Sparkles className="w-4 h-4" />
              You qualify for Complimentary Express Delivery!
            </span>
          )}
          <span className="font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-700 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grid: Cart Items (8 cols) & Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs divide-y divide-stone-100">
          {cartItems.map((item) => (
            <div key={item.key} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6">
              {/* Product Thumbnail */}
              <Link to={`/products/${item.slug || item.product_id}`} className="shrink-0">
                <img
                  src={item.primary_image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=400&q=80'}
                  alt={item.name}
                  className="w-24 sm:w-28 aspect-[3/4] object-cover object-center rounded-xl bg-stone-100 shadow-xs hover:opacity-90 transition-opacity"
                />
              </Link>

              {/* Item Info */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link
                      to={`/products/${item.slug || item.product_id}`}
                      className="font-serif text-base sm:text-lg font-bold text-slate-900 hover:text-amber-800 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                      <span>Size: <strong className="text-slate-800">{item.size}</strong></span>
                      <span>•</span>
                      <span>Color: <strong className="text-slate-800">{item.color}</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.key)}
                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Price & Quantity Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-50">
                  <div className="flex items-center border border-stone-300 rounded-xl bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="px-3.5 py-1.5 text-stone-600 hover:text-black font-semibold text-sm"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-900 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="px-3.5 py-1.5 text-stone-600 hover:text-black font-semibold text-sm"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900 font-serif">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[11px] text-stone-400">
                        ({formatCurrency(item.price)} each)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6 sticky top-28">
          <h3 className="font-serif text-xl font-bold text-slate-900 pb-4 border-b border-stone-100">
            Order Summary
          </h3>

          {/* Coupon Form */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-2">
              Promotional Voucher
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <Tag className="w-4 h-4 text-emerald-700" />
                  <span>Code: <strong>{appliedCoupon.code}</strong> (-{formatCurrency(discountAmount)})</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-stone-400 hover:text-red-600 font-bold text-sm"
                >
                  ×
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 uppercase font-mono"
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
          </div>

          {/* Calculation breakdown */}
          <div className="space-y-3 text-xs text-stone-600 border-t border-stone-100 pt-4">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Voucher Savings</span>
                <span className="font-bold">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <strong className="text-emerald-700 uppercase">Complimentary</strong>
                ) : (
                  formatCurrency(shippingFee)
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax (8.5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-stone-200 text-base font-bold text-slate-900">
              <span>Estimated Total</span>
              <span className="font-serif text-xl">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Proceed to checkout CTA */}
          <Button
            onClick={() => navigate('/checkout')}
            size="lg"
            className="w-full"
            icon={ArrowRight}
            iconPosition="right"
          >
            Proceed to Checkout
          </Button>

          <p className="text-[11px] text-center text-stone-400">
            Taxes and shipping fees calculated precisely at checkout. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
