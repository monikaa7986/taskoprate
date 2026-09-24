import React, { useState, useEffect } from 'react';
import { Plus, TicketPercent, Trash2, Tag, Calendar, Check, X } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { couponService } from '../../services/couponService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminCouponsPage = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '0',
    max_discount_amount: '',
    usage_limit: '100'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await couponService.getAllCoupons();
      if (res.success && res.data?.coupons) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggleActive = async (coupon) => {
    try {
      const res = await couponService.updateCoupon(coupon.id, {
        is_active: coupon.is_active === 1 ? 0 : 1
      });
      if (res.success) {
        showToast('Coupon status updated.', 'success');
        fetchCoupons();
      }
    } catch (err) {
      showToast('Error updating coupon.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon code?')) return;
    try {
      const res = await couponService.deleteCoupon(id);
      if (res.success) {
        showToast('Coupon removed.', 'success');
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      showToast('Error deleting coupon.', 'error');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount_value) return;

    try {
      setSubmitting(true);
      const res = await couponService.createCoupon(formData);
      if (res.success) {
        showToast(`Voucher code "${formData.code.toUpperCase()}" created.`, 'success');
        setIsModalOpen(false);
        setFormData({
          code: '',
          description: '',
          discount_type: 'percentage',
          discount_value: '',
          min_order_amount: '0',
          max_discount_amount: '',
          usage_limit: '100'
        });
        fetchCoupons();
      }
    } catch (err) {
      showToast(err.message || 'Error creating coupon.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Promotional Vouchers & Discounts
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure promotional campaign codes, threshold limits, and percentage reductions.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} size="sm" icon={Plus}>
          Create Voucher
        </Button>
      </div>

      {loading ? (
        <div className="py-20"><Loader text="Loading vouchers..." /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-2xl p-6 border shadow-xs space-y-4 transition-all ${
                c.is_active === 1 ? 'border-stone-200/80 hover:shadow-md' : 'border-stone-200 opacity-60 bg-stone-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-slate-900 tracking-wider bg-stone-100 px-3 py-1 rounded-lg">
                  {c.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    c.is_active === 1 ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {c.is_active === 1 ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div>
                <p className="font-serif text-xl font-bold text-amber-800">
                  {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `${formatCurrency(c.discount_value)} FLAT`}
                </p>
                <p className="text-xs text-stone-500 mt-1">{c.description || 'Promotional patron discount'}</p>
              </div>

              <div className="text-xs space-y-1.5 text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span>Minimum Spend:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(c.min_order_amount)}</span>
                </div>
                {c.max_discount_amount && (
                  <div className="flex justify-between">
                    <span>Max Cap:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(c.max_discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Usage Redemptions:</span>
                  <span className="font-semibold text-slate-900">{c.usage_count} / {c.usage_limit || '∞'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleActive(c)}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors ${
                    c.is_active === 1
                      ? 'border-stone-200 text-stone-600 hover:bg-stone-100'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {c.is_active === 1 ? 'Disable' : 'Enable'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                  title="Delete voucher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue New Promotional Voucher"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Voucher Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. VIP25"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 uppercase font-mono font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Discount Type
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Cash ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="20"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Min Order Spend ($)
              </label>
              <input
                type="number"
                value={formData.min_order_amount}
                onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Max Discount Cap ($)
              </label>
              <input
                type="number"
                placeholder="Optional"
                value={formData.max_discount_amount}
                onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. 25% discount for private VIP salon guests"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Issue Voucher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCouponsPage;
