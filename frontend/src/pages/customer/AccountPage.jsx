import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, ShieldCheck, LogOut, Save, MapPin, Phone, Mail } from 'lucide-react';
import Button from '../../components/common/Button';
import ProductGrid from '../../components/customer/ProductGrid';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout, updateUser } = useAuth();
  const { wishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'wishlist'
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postal_code: user?.postal_code || '',
    country: user?.country || 'United States'
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900">Sign In Required</h2>
        <p className="text-xs text-stone-500">Please sign in to view and manage your account details.</p>
        <Link to="/login">
          <Button size="md">Proceed to Sign In</Button>
        </Link>
      </div>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await authService.updateProfile(profileForm);
      if (res.success && res.data?.user) {
        updateUser(res.data.user);
        setIsEditing(false);
        showToast('Profile information updated successfully.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Error updating profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold mb-1">
            Private Patron Portal
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Welcome, {user?.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin/dashboard">
              <Button variant="secondary" size="sm" icon={ShieldCheck}>
                Admin Dashboard
              </Button>
            </Link>
          )}
          <Button
            onClick={() => {
              logout();
              navigate('/');
            }}
            variant="outline"
            size="sm"
            icon={LogOut}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-8 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-stone-400 hover:text-black'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Address</span>
        </button>
        <Link
          to="/orders"
          className="pb-3 flex items-center gap-2 text-stone-400 hover:text-black transition-colors"
        >
          <Package className="w-4 h-4" />
          <span>My Orders</span>
        </Link>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'wishlist'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-stone-400 hover:text-black'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlist.length})</span>
        </button>
      </div>

      {/* Tab 1: Profile & Address */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-serif text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">{user?.name}</h3>
              <p className="text-xs text-stone-500">{user?.email}</p>
              <div className="mt-2">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-slate-700">
                  Role: {user?.role}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-stone-400" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-stone-400" />
                <span>{user?.phone || 'No phone registered'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  {user?.address ? `${user.address}, ${user.city || ''} ${user.postal_code || ''}` : 'No default shipping address'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Personal Information & Default Shipping
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-amber-800 hover:underline"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Details'}
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 disabled:opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 disabled:opacity-70"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 disabled:opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 disabled:opacity-70"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={profileForm.state}
                      onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 disabled:opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={profileForm.postal_code}
                      onChange={(e) => setProfileForm({ ...profileForm, postal_code: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 disabled:opacity-70"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 flex justify-end">
                  <Button type="submit" isLoading={saving} icon={Save}>
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              Saved Garments ({wishlist.length})
            </h3>
            <p className="text-xs text-stone-500">
              Pieces you have earmarked for upcoming acquisitions.
            </p>
          </div>

          <ProductGrid
            products={wishlist}
            emptyTitle="Your Wishlist is Empty"
            emptyDescription="Tap the heart icon on any garment to preserve it in your private wardrobe selection."
          />
        </div>
      )}
    </div>
  );
};

export default AccountPage;
