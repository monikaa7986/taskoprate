import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Shirt,
  Users,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Package,
  TrendingUp,
  Layers
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboardStats();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="py-24"><Loader text="Compiling financial & inventory telemetry..." /></div>;
  }

  const { metrics, recentOrders, lowStockProducts, orderStatusBreakdown, categoryDistribution } = data || {};

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Performance Overview
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Real-time analytics across orders, revenue streams, and inventory levels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products/add">
            <Button size="sm" icon={PlusCircle}>
              Add Product
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="secondary" size="sm" icon={Package}>
              Process Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          title="Gross Revenue"
          value={formatCurrency(metrics?.totalRevenue || 0)}
          icon={DollarSign}
          trend="+18.4%"
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={metrics?.totalOrders || 0}
          icon={ShoppingBag}
          trend="+12.2%"
          color="slate"
        />
        <StatCard
          title="Active Garments"
          value={metrics?.totalProducts || 0}
          icon={Shirt}
          trend="+4 new"
          color="amber"
        />
        <StatCard
          title="Registered Patrons"
          value={metrics?.totalCustomers || 0}
          icon={Users}
          trend="+28%"
          color="blue"
        />
        <StatCard
          title="Low Stock Watch"
          value={metrics?.lowStockCount || 0}
          icon={AlertTriangle}
          trend={metrics?.lowStockCount > 0 ? "Requires restock" : "Healthy"}
          color={metrics?.lowStockCount > 0 ? "red" : "emerald"}
        />
      </div>

      {/* 2. Visualizations Breakdown: Status & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Order Status Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-700" />
            <span>Order Pipeline Status</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {orderStatusBreakdown?.map((st, i) => (
              <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider truncate">
                  {st.order_status}
                </p>
                <p className="font-serif text-xl font-bold text-slate-900">
                  {st.count} Orders
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Product Distribution */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-700" />
            <span>Category Distribution</span>
          </h3>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {categoryDistribution?.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-stone-50">
                <span className="font-medium text-slate-800 truncate">{cat.name}</span>
                <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                  {cat.product_count} Garments
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Orders & Low Stock Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-slate-900">Recent Store Orders</h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-800">
                {recentOrders?.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{ord.order_number}</td>
                    <td className="py-3 px-4">{ord.customer_name}</td>
                    <td className="py-3 px-4 font-bold">{formatCurrency(ord.total)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-slate-800">
                        {ord.order_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-400">{formatDate(ord.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Low Stock Alerts</span>
            </h3>
            <Link to="/admin/inventory" className="text-xs font-semibold text-amber-800 hover:underline">
              Inventory
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {lowStockProducts && lowStockProducts.length > 0 ? (
              lowStockProducts.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={p.primary_image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=200&q=80'}
                      alt=""
                      className="w-10 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="font-semibold text-xs text-slate-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 shrink-0">
                    {p.stock} units left
                  </span>
                </div>
              ))
            ) : (
              <p className="p-6 text-xs text-stone-500 text-center">All inventory stock levels are healthy.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
