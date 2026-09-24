import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, MessageSquareQuote } from 'lucide-react';
import Loader from '../../components/common/Loader';
import { reviewService } from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

const AdminReviewsPage = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getAllReviews();
      if (res.success && res.data?.reviews) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (rev) => {
    try {
      const res = await reviewService.toggleApproveReview(rev.id);
      if (res.success) {
        showToast(res.message, 'success');
        setReviews((prev) =>
          prev.map((r) => (r.id === rev.id ? { ...r, is_approved: r.is_approved === 1 ? 0 : 1 } : r))
        );
      }
    } catch (err) {
      showToast(err.message || 'Error updating review.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer review permanently?')) return;
    try {
      const res = await reviewService.deleteReview(id);
      if (res.success) {
        showToast('Review removed.', 'success');
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      showToast(err.message || 'Error deleting review.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Patron Reviews Moderation
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Evaluate customer commentary, verify review integrity, and approve public visibility.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20"><Loader text="Gathering patron feedback..." /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Garment Reviewed</th>
                  <th className="py-3.5 px-4">Reviewer</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Commentary</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Display Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-800">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400">
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  reviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-serif font-bold text-slate-900">
                        {rev.product_name}
                      </td>
                      <td className="py-3.5 px-4 text-stone-700 font-medium">
                        {rev.user_name}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        {rev.title && <p className="font-bold text-slate-900 truncate">{rev.title}</p>}
                        <p className="text-stone-500 line-clamp-2 italic">"{rev.comment}"</p>
                      </td>
                      <td className="py-3.5 px-4 text-stone-400">{formatDate(rev.created_at)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rev.is_approved === 1
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {rev.is_approved === 1 ? 'Approved' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleApprove(rev)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                              rev.is_approved === 1
                                ? 'border-stone-200 text-stone-600 hover:bg-stone-100'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                            title={rev.is_approved === 1 ? 'Hide review' : 'Approve review'}
                          >
                            {rev.is_approved === 1 ? 'Hide' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(rev.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
