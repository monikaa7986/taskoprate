import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const AdminLayout = () => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <Loader text="Verifying administrative credentials..." />
      </div>
    );
  }

  // Guard: Must be authenticated admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Atelier Administration"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
