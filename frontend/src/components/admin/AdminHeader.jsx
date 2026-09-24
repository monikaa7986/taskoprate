import React from 'react';
import { Menu, Bell, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminHeader = ({ onToggleSidebar, title = 'Control Center' }) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-stone-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-stone-600 hover:text-black rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="font-serif text-lg font-bold text-slate-900 hidden sm:block">
          {title}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Production Store Active</span>
        </div>

        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-black px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Storefront</span>
        </Link>
      </div>
    </header>
  );
};

export default AdminHeader;
