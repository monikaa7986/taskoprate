import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Calendar, Printer, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate } from '../../utils/formatters';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        if (res.success && res.data?.orders) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="py-24"><Loader text="Retrieving order archives..." /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold mb-1">
            Archival Acquisitions
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            My Order History ({orders.length})
          </h1>
        </div>

        <Link to="/women">
          <Button variant="outline" size="sm">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Located"
          description="You have not placed any wardrobe orders yet. Explore our latest arrivals to acquire your first piece."
          actionLabel="Explore Collections"
          onAction={() => (window.location.href = '/women')}
        />
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6"
            >
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {order.order_number}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Ordered on {formatDate(order.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-black font-semibold py-1.5 px-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4 divide-y divide-stone-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    <img
                      src={item.product_image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=300&q=80'}
                      alt={item.product_name}
                      className="w-16 h-20 object-cover rounded-xl bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-slate-900">
                          {item.product_name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                          <span>Size: <strong>{item.size}</strong></span>
                          <span>•</span>
                          <span>Color: <strong>{item.color}</strong></span>
                          <span>•</span>
                          <span>Qty: <strong>{item.quantity}</strong></span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Summary & Shipping info */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-between gap-6 text-xs text-stone-600">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900 uppercase tracking-wider">Dispatched To</p>
                  <p>{order.customer_name}</p>
                  <p>{order.shipping_address}, {order.city} {order.postal_code}</p>
                  {order.tracking_number && (
                    <p className="flex items-center gap-1.5 text-blue-700 font-mono pt-1">
                      <Truck className="w-3.5 h-3.5" />
                      Tracking: {order.tracking_number}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:text-right min-w-[200px]">
                  <div className="flex justify-between sm:justify-end sm:gap-6">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between sm:justify-end sm:gap-6 text-emerald-700">
                      <span>Discount:</span>
                      <span className="font-bold">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between sm:justify-end sm:gap-6">
                    <span>Shipping:</span>
                    <span>{order.shipping_fee === 0 ? 'Complimentary' : formatCurrency(order.shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between sm:justify-end sm:gap-6">
                    <span>Tax (8.5%):</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="flex justify-between sm:justify-end sm:gap-6 pt-2 border-t border-stone-200 text-sm font-bold text-slate-900">
                    <span>Total Paid:</span>
                    <span className="font-serif text-base">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
