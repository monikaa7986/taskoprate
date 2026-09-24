import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import CategoryPage from './pages/customer/CategoryPage';
import ProductDetailsPage from './pages/customer/ProductDetailsPage';
import SearchPage from './pages/customer/SearchPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import LoginPage from './pages/customer/LoginPage';
import RegisterPage from './pages/customer/RegisterPage';
import AccountPage from './pages/customer/AccountPage';
import OrdersPage from './pages/customer/OrdersPage';
import AboutPage from './pages/customer/AboutPage';
import ContactPage from './pages/customer/ContactPage';
import TechnologyPage from './pages/customer/TechnologyPage';
import ProjectInfoPage from './pages/customer/ProjectInfoPage';
import NotFoundPage from './pages/customer/NotFoundPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductAddPage from './pages/admin/AdminProductAddPage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Routes>
                {/* 1. Customer Storefront Routes */}
                <Route path="/" element={<CustomerLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="men" element={<CategoryPage genderOverride="men" />} />
                  <Route path="women" element={<CategoryPage genderOverride="women" />} />
                  <Route path="kids" element={<CategoryPage genderOverride="kids" />} />
                  <Route path="products/:id" element={<ProductDetailsPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="account" element={<AccountPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="technology" element={<TechnologyPage />} />
                  <Route path="project-info" element={<ProjectInfoPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* 2. Standalone Admin Login */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* 3. Protected Admin Panel Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/add" element={<AdminProductAddPage />} />
                  <Route path="products/:id/edit" element={<AdminProductEditPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="inventory" element={<AdminInventoryPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
