import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemsCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Men', path: '/men' },
    { name: 'Women', path: '/women' },
    { name: 'Kids', path: '/kids' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Technology', path: '/technology' },
    { name: 'Project Info', path: '/project-info' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-stone-300 text-xs py-2 px-4 text-center font-medium tracking-wider flex items-center justify-center gap-2">
        <span>COMPLIMENTARY GLOBAL EXPRESS SHIPPING ON ORDERS OVER $150</span>
        <span className="hidden sm:inline text-stone-500">•</span>
        <span className="hidden sm:inline text-amber-300">CODE: WELCOME10</span>
      </div>

      {/* Main Navbar */}
      <nav className="glass-nav border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile hamburger & Main Links */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-black rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="hidden lg:flex items-center space-x-7">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `relative py-1 text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-slate-900 after:transition-all after:duration-300 ${
                      isActive ? 'text-black after:w-full' : 'text-slate-600 hover:text-black after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/men"
                  className={({ isActive }) =>
                    `relative py-1 text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-slate-900 after:transition-all after:duration-300 ${
                      isActive ? 'text-black after:w-full' : 'text-slate-600 hover:text-black after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  Men
                </NavLink>
                <NavLink
                  to="/women"
                  className={({ isActive }) =>
                    `relative py-1 text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-slate-900 after:transition-all after:duration-300 ${
                      isActive ? 'text-black after:w-full' : 'text-slate-600 hover:text-black after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  Women
                </NavLink>
                <NavLink
                  to="/kids"
                  className={({ isActive }) =>
                    `relative py-1 text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-slate-900 after:transition-all after:duration-300 ${
                      isActive ? 'text-black after:w-full' : 'text-slate-600 hover:text-black after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  Kids
                </NavLink>
              </div>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link to="/" className="inline-block group">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-slate-900 group-hover:text-amber-800 transition-colors uppercase">
                  AANGAN
                </span>
                <span className="block text-[9px] uppercase tracking-[0.35em] text-stone-500 font-sans -mt-1 text-center">
                  Couture &amp; Craft
                </span>
              </Link>
            </div>

            {/* Right: Actions (Search, Wishlist, Cart, User) */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Search Toggle */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center animate-fade-in">
                    <input
                      type="text"
                      placeholder="Search coats, silks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-36 sm:w-56 text-xs px-3 py-1.5 border border-stone-300 rounded-full focus:outline-none focus:border-slate-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="p-1.5 text-stone-400 hover:text-black ml-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-slate-700 hover:text-black hover:bg-stone-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Search collection"
                  >
                    <Search className="w-5 h-5 stroke-[1.75]" />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                to="/account"
                className="relative p-2 text-slate-700 hover:text-black hover:bg-stone-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:flex cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCartDrawer}
                className="relative p-2 text-slate-700 hover:text-black hover:bg-stone-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {itemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-slate-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {itemsCount}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 text-slate-700 hover:text-black hover:bg-stone-100 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Account Menu"
                >
                  <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-slate-800 text-xs font-semibold">
                    {isAuthenticated ? user?.name?.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200/80 py-2 z-20 animate-dropdown text-sm divide-y divide-stone-100 origin-top-right">
                      {isAuthenticated ? (
                        <>
                          <div className="px-4 py-3">
                            <p className="text-xs text-stone-500">Signed in as</p>
                            <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-stone-400 truncate">{user?.email}</p>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/account"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-slate-700 hover:bg-stone-50 hover:text-black hover:pl-5 transition-all duration-150"
                            >
                              My Account
                            </Link>
                            <Link
                              to="/orders"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-slate-700 hover:bg-stone-50 hover:text-black hover:pl-5 transition-all duration-150"
                            >
                              My Orders
                            </Link>
                          </div>
                          {isAdmin && (
                            <div className="py-1 bg-amber-50/50">
                              <Link
                                to="/admin/dashboard"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-amber-900 font-medium hover:bg-amber-100/50 hover:pl-5 transition-all duration-150"
                              >
                                <ShieldCheck className="w-4 h-4 text-amber-700" />
                                Admin Panel
                              </Link>
                            </div>
                          )}
                          <div className="py-1">
                            <button
                              type="button"
                              onClick={() => {
                                setUserDropdownOpen(false);
                                logout();
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 hover:pl-5 transition-all duration-150 text-left cursor-pointer"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-2 space-y-1">
                          <Link
                            to="/login"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block text-center py-2 px-3 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-black hover:shadow-sm active:scale-95 transition-all duration-150"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block text-center py-2 px-3 bg-stone-100 text-slate-800 rounded-lg text-xs font-medium hover:bg-stone-200 active:scale-95 transition-all duration-150"
                          >
                            Create Account
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-4 pb-6 space-y-4 animate-fade-in shadow-xl">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </form>

            <div className="flex flex-col space-y-2 pt-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium tracking-wide transition-colors ${
                      isActive ? 'bg-stone-100 text-slate-900 font-semibold' : 'text-slate-600 hover:text-black hover:bg-stone-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {isAdmin && (
              <div className="pt-2 border-t border-stone-100">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-amber-900 bg-amber-50 hover:bg-amber-100"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Admin Dashboard
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
