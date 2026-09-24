import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle,
  ArrowRight,
  PackageCheck,
  Building,
  Smartphone,
  Banknote
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, subtotal, discountAmount, shippingFee, tax, total, appliedCoupon, clearCart } = useCart();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Form State pre-populated with logged in user details if available
  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    shipping_address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postal_code: user?.postal_code || '',
    country: user?.country || 'United States',
    payment_method: 'credit_card',
    notes: ''
  });

  // Card details state for future-ready module
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardName: user?.name || 'Alexandre Vance',
    cardExpiry: '12/28',
    cardCvv: '883'
  });

  if (cartItems.length === 0 && !completedOrder) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/women">
          <Button size="md">Return to Collections</Button>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.customer_email || !formData.shipping_address || !formData.city || !formData.postal_code) {
      showToast('Please fill in all required shipping address fields.', 'error');
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        ...formData,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          product_image: item.primary_image
        })),
        coupon_code: appliedCoupon?.code || null
      };

      const res = await orderService.createOrder(orderPayload);
      if (res.success && res.data?.order) {
        setCompletedOrder(res.data.order);
        clearCart();

        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        showToast('Your order has been confirmed! An email receipt was sent.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Error processing your order. Please retry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Order Confirmation Screen
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold">
            Thank You For Your Patronage
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
            Order Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Order Reference: <strong className="text-slate-900 font-mono text-base">{completedOrder.orderNumber}</strong>
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm text-left space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-stone-100">
            <div>
              <p className="text-xs text-stone-400">Total Charged</p>
              <p className="font-serif text-2xl font-bold text-slate-900">{formatCurrency(completedOrder.total)}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Payment Authorized
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-600">
            <div>
              <h4 className="font-semibold text-slate-900 uppercase tracking-wider mb-2">Delivery Address</h4>
              <p className="text-slate-800 font-medium">{formData.customer_name}</p>
              <p>{formData.shipping_address}</p>
              <p>{formData.city}, {formData.state} {formData.postal_code}</p>
              <p>{formData.country}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 uppercase tracking-wider mb-2">Delivery Method</h4>
              <p className="text-slate-800 font-medium">Complimentary Global Express Courier</p>
              <p className="text-stone-400 mt-1">Dispatches within 24 hours. Tracking link sent to {formData.customer_email}.</p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-xs mb-3">Order Garments</h4>
            <div className="space-y-3">
              {completedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-slate-800">{item.quantity} × {item.product_name} ({item.size})</span>
                  <span className="font-bold text-slate-900">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link to="/orders">
            <Button size="lg" icon={PackageCheck}>View In My Orders</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg">Return to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold mb-1">
          Secure Atelier Checkout
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Complete Your Wardrobe Order
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Shipping, Delivery, Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Customer Contact & Shipping */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Customer & Shipping Address
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Alexandre Vance"
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                  Email Address (Receipt & Tracking) *
                </label>
                <input
                  type="email"
                  required
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                  Telephone Contact *
                </label>
                <input
                  type="tel"
                  required
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                  Street Address & Apartment/Suite *
                </label>
                <input
                  type="text"
                  required
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleInputChange}
                  placeholder="740 Fifth Avenue, Floor 18"
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    placeholder="10019"
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Leave with concierge or ring lobby buzzer"
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Delivery Service
              </h3>
            </div>

            <div className="p-4 rounded-2xl border-2 border-slate-900 bg-stone-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-slate-900" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Atelier Carbon-Neutral Priority Courier</p>
                  <p className="text-[11px] text-stone-500">Delivered within 2-3 business days via DHL / FedEx</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 uppercase">
                {shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}
              </span>
            </div>
          </div>

          {/* Section 3: Payment Options (Future-Ready Architecture) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Payment Method (Future-Ready Module)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, payment_method: 'credit_card' })}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  formData.payment_method === 'credit_card'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-stone-200 text-slate-800 hover:border-slate-400 bg-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold">Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, payment_method: 'upi_netbanking' })}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  formData.payment_method === 'upi_netbanking'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-stone-200 text-slate-800 hover:border-slate-400 bg-white'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs font-bold">UPI / Instant Bank</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, payment_method: 'cash_on_delivery' })}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  formData.payment_method === 'cash_on_delivery'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-stone-200 text-slate-800 hover:border-slate-400 bg-white'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-bold">Cash on Delivery</span>
              </button>
            </div>

            {formData.payment_method === 'credit_card' && (
              <div className="space-y-3 pt-3 border-t border-stone-100 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      value={cardData.cardExpiry}
                      onChange={(e) => setCardData({ ...cardData, cardExpiry: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                      Security Code (CVV)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardData.cardCvv}
                      onChange={(e) => setCardData({ ...cardData, cardCvv: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-stone-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payment pipeline structured for live production gateways. Encrypted 256-bit TLS connection.</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6 sticky top-28">
          <h3 className="font-serif text-xl font-bold text-slate-900 pb-4 border-b border-stone-100">
            Order Review ({cartItems.length} Products)
          </h3>

          {/* Items Preview */}
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-stone-100">
            {cartItems.map((item) => (
              <div key={item.key} className="flex gap-4 pt-3 first:pt-0">
                <img
                  src={item.primary_image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=300&q=80'}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-lg bg-stone-100 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-serif text-xs font-bold text-slate-900 line-clamp-1">{item.name}</p>
                    <p className="text-[11px] text-stone-500">
                      {item.size} • {item.color} • Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="space-y-2.5 text-xs text-stone-600 border-t border-stone-100 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Voucher ({appliedCoupon?.code})</span>
                <span className="font-bold">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? <strong className="text-emerald-700 uppercase">Complimentary</strong> : formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax (8.5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-stone-200 text-base font-bold text-slate-900">
              <span>Total Payable</span>
              <span className="font-serif text-2xl">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="w-full"
            icon={ArrowRight}
            iconPosition="right"
          >
            Authorize & Place Order • {formatCurrency(total)}
          </Button>

          <p className="text-[10px] text-center text-stone-400">
            By placing your order you accept our Terms of Sale and 30-Day Return Commitment.
          </p>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
