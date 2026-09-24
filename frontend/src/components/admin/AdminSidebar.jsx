import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  Tags,
  ShoppingBag,
  Users,
  Boxes,
  MessageSquareQuote,
  TicketPercent,
  Sliders,
  ExternalLink,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Shirt },
  { name: 'Categories', path: '/admin/categories', icon: Tags },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
  { name: 'Reviews', path: '/admin/reviews', icon: MessageSquareQuote },
  { name: 'Coupons', path: '/admin/coupons', icon: TicketPercent },
  { name: 'Settings', path: '/admin/settings', icon: Sliders }
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-stone-300 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-900 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Close Button */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-900">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-[0.2em] text-white uppercase">
                AANGAN
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Admin
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-700 text-white font-semibold shadow-xs translate-x-1'
                        : 'text-stone-400 hover:text-white hover:bg-slate-900 hover:translate-x-1'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Storefront Link & Admin Profile */}
        <div className="p-4 border-t border-slate-900 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Customer Store</span>
            </span>
          </Link>

          <div className="p-3 rounded-xl bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-serif font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-stone-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="text-stone-400 hover:text-red-400 p-1 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
