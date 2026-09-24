import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrdersPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal / Detail state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders({
        status: statusFilter,
        search
      });
      if (res.success && res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.order_status);
    setTrackingNumber(order.tracking_number || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      const res = await orderService.updateOrderStatus(selectedOrder.id, {
        order_status: newStatus,
        tracking_number: trackingNumber.trim() || null
      });

      if (res.success) {
        showToast(`Order updated to status: "${newStatus}"`, 'success');
        setSelectedOrder((prev) => ({
          ...prev,
          order_status: newStatus,
          tracking_number: trackingNumber.trim()
        }));
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message || 'Error updating order status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Confirmed':
      default:
        return 'bg-purple-50 text-purple-800 border-purple-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Order Fulfillment & Tracking
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor client orders, print dispatch lists, and update courier tracking tokens.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by Order #, client, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="all">All Order Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-20"><Loader text="Compiling orders..." /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Order Reference</th>
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tracking #</th>
                  <th className="py-3.5 px-4">Order Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-400">
                      No orders found matching current filters.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ord.order_number}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{ord.customer_name}</p>
                        <p className="text-[10px] text-stone-400">{ord.customer_email}</p>
                      </td>
                      <td className="py-3.5 px-4">{ord.items?.length || 1} pieces</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(ord.total)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(ord.order_status)}`}>
                          {ord.order_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">
                        {ord.tracking_number || <span className="text-stone-300">Unassigned</span>}
                      </td>
                      <td className="py-3.5 px-4 text-stone-400">{formatDate(ord.created_at)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          onClick={() => handleOpenDetail(ord)}
                          variant="secondary"
                          size="sm"
                          icon={Eye}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details: ${selectedOrder?.order_number}`}
        maxWidth="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs text-slate-800">
            {/* Status & Tracking updater */}
            <form onSubmit={handleUpdateStatus} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Update Order Status & Tracking
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer font-semibold"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">Carrier Tracking Number</label>
                  <input
                    type="text"
                    placeholder="e.g. FDX-9938210"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <Button type="submit" size="sm" isLoading={updating}>
                  Save Order Updates
                </Button>
              </div>
            </form>

            {/* Client and Shipping details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-white border border-stone-100 rounded-2xl">
              <div>
                <p className="font-bold uppercase tracking-wider text-[11px] text-stone-400 mb-1">Shipping Destination</p>
                <p className="font-semibold text-slate-900">{selectedOrder.customer_name}</p>
                <p>{selectedOrder.shipping_address}</p>
                <p>{selectedOrder.city}, {selectedOrder.state} {selectedOrder.postal_code}</p>
                <p>{selectedOrder.country}</p>
                <p className="text-stone-400 pt-1">Phone: {selectedOrder.customer_phone}</p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider text-[11px] text-stone-400 mb-1">Payment & Accounting</p>
                <p>Method: <strong className="uppercase">{selectedOrder.payment_method}</strong></p>
                <p>Status: <strong className="text-emerald-700 uppercase">{selectedOrder.payment_status}</strong></p>
                {selectedOrder.coupon_code && (
                  <p>Coupon: <strong>{selectedOrder.coupon_code}</strong></p>
                )}
                {selectedOrder.notes && (
                  <p className="text-amber-800 italic pt-1">Notes: "{selectedOrder.notes}"</p>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-stone-400">Purchased Garments</h4>
              <div className="divide-y divide-stone-100 border border-stone-100 rounded-2xl overflow-hidden">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product_image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=200&q=80'}
                        alt=""
                        className="w-10 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{item.product_name}</p>
                        <p className="text-stone-400 text-[11px]">
                          {item.size} • {item.color} • Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accounting Breakdown */}
            <div className="border-t border-stone-100 pt-3 space-y-1.5 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{selectedOrder.shipping_fee === 0 ? 'Complimentary' : formatCurrency(selectedOrder.shipping_fee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(selectedOrder.tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-slate-900">
                <span>Grand Total:</span>
                <span className="font-serif text-base">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
