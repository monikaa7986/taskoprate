import React, { useState, useEffect } from 'react';
import { Search, Users, ShieldAlert, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import Loader from '../../components/common/Loader';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminCustomersPage = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCustomers(search);
      if (res.success && res.data?.customers) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleToggleStatus = async (customer) => {
    try {
      setUpdatingId(customer.id);
      const res = await adminService.toggleCustomerStatus(customer.id);
      if (res.success) {
        showToast(res.message, 'success');
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === customer.id ? { ...c, is_active: c.is_active === 1 ? 0 : 1 } : c
          )
        );
      }
    } catch (err) {
      showToast(err.message || 'Error updating customer status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Patron Accounts & Client Directory
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Review registered clientele, historical purchases, and account authorization states.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by patron name, email, or telephone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20"><Loader text="Retrieving patron roster..." /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Patron Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Orders Placed</th>
                  <th className="py-3.5 px-4">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Member Since</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-800">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-400">
                      No customer accounts located.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-serif font-bold text-xs flex items-center justify-center shrink-0">
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-slate-900">{c.email}</p>
                        <p className="text-[11px] text-stone-400">{c.phone || 'No phone'}</p>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {c.city ? `${c.city}, ${c.state || c.country || ''}` : 'Not provided'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {c.total_orders} Orders
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatCurrency(c.total_spend)}
                      </td>
                      <td className="py-3.5 px-4 text-stone-400">{formatDate(c.created_at)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            c.is_active === 1
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}
                        >
                          {c.is_active === 1 ? 'Active Patron' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(c)}
                          disabled={updatingId === c.id}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            c.is_active === 1
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {c.is_active === 1 ? 'Deactivate' : 'Reactivate'}
                        </button>
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

export default AdminCustomersPage;
