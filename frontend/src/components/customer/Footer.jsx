import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Thank you for subscribing to the Aangan & Co. Gazette.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-stone-300 border-t border-slate-900 mt-auto">
      {/* Value Pillars */}
      <div className="border-b border-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4 group p-2 rounded-xl transition-all duration-300 hover:bg-slate-900/40">
              <div className="p-3 rounded-xl bg-slate-900 text-amber-400 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Complimentary Shipping</h4>
                <p className="text-xs text-stone-400 mt-1">Free global express delivery on all orders over $150.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group p-2 rounded-xl transition-all duration-300 hover:bg-slate-900/40">
              <div className="p-3 rounded-xl bg-slate-900 text-amber-400 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Effortless Returns</h4>
                <p className="text-xs text-stone-400 mt-1">30-day seamless return window with doorstep courier pickup.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group p-2 rounded-xl transition-all duration-300 hover:bg-slate-900/40">
              <div className="p-3 rounded-xl bg-slate-900 text-amber-400 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Artisanal Provenance</h4>
                <p className="text-xs text-stone-400 mt-1">Certified sustainable fibers spun in heritage European mills.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group p-2 rounded-xl transition-all duration-300 hover:bg-slate-900/40">
              <div className="p-3 rounded-xl bg-slate-900 text-amber-400 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Secure Commerce</h4>
                <p className="text-xs text-stone-400 mt-1">Encrypted 256-bit checkout with authenticated privacy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white uppercase">
              AANGAN & CO.
            </span>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Contemporary tailoring and elevated everyday garments designed with architectural purity, exceptional natural textiles, and conscious manufacturing.
            </p>
            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-2">
                Join the Private Gazette
              </p>
              <form onSubmit={handleNewsletter} className="flex max-w-md">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs px-3.5 py-2.5 rounded-l-lg focus:outline-none focus:border-amber-400 flex-1 text-white placeholder-stone-500 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-600 active:scale-95 text-white px-4 rounded-r-lg text-xs font-medium flex items-center justify-center transition-all duration-200 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/men" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Men's Tailoring & Shirts</Link></li>
              <li><Link to="/women" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Women's Dresses & Cashmere</Link></li>
              <li><Link to="/kids" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Kids' Natural Basics</Link></li>
              <li><Link to="/search?q=jacket" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Outerwear Archive</Link></li>
              <li><Link to="/search?q=silk" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Mulberry Silk Series</Link></li>
            </ul>
          </div>

          {/* Brand & Customer Care */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">
              Customer Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/orders" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Order Tracking</Link></li>
              <li><Link to="/account" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Account Dashboard</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Client Services & FAQ</Link></li>
              <li><Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Our Ethical Philosophy</Link></li>
            </ul>
          </div>

          {/* Project & Tech Documentation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">
              Architecture & Tech
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/technology" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-amber-300 font-medium">Technology Stack</Link></li>
              <li><Link to="/project-info" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-amber-300 font-medium">Project Documentation</Link></li>
              <li><Link to="/admin/login" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Admin Portal Login</Link></li>
              <li><span className="text-stone-600">REST API v1.0.0</span></li>
              <li><span className="text-stone-600">SQL Schema v2.1</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Aangan & Co. All rights reserved. Built with React, Node.js, Express & SQL.</p>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-stone-400 transition-colors">Sustainability</Link>
            <Link to="/contact" className="hover:text-stone-400 transition-colors">Terms of Service</Link>
            <Link to="/project-info" className="hover:text-stone-400 transition-colors">Architecture Docs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
