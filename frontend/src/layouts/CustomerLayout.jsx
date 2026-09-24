import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/customer/Navbar';
import Footer from '../components/customer/Footer';
import CartDrawer from '../components/customer/CartDrawer';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default CustomerLayout;
