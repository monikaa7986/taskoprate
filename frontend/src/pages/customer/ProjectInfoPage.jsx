import React from 'react';
import {
  FileText,
  Layers,
  Server,
  Database,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Code2,
  Lock,
  ArrowRight,
  Terminal,
  FolderTree,
  Bot
} from 'lucide-react';

const ENDPOINTS_CATALOG = [
  { method: 'POST', path: '/api/auth/register', auth: 'Public', desc: 'Registers a new customer account, hashes password with bcrypt, and issues a JWT token' },
  { method: 'POST', path: '/api/auth/login', auth: 'Public', desc: 'Authenticates customer or administrator credentials and returns signed JWT' },
  { method: 'GET', path: '/api/auth/me', auth: 'User', desc: 'Retrieves current authenticated profile and active session state' },
  { method: 'PUT', path: '/api/auth/profile', auth: 'User', desc: 'Updates patron contact details, address, and default preferences' },
  { method: 'GET', path: '/api/products', auth: 'Public', desc: 'Lists products with multi-filter query parameters (gender, category, price, size, color, rating, sort, pagination)' },
  { method: 'GET', path: '/api/products/:identifier', auth: 'Public', desc: 'Fetches single product details with gallery images, variant matrices, and reviews by ID or slug' },
  { method: 'GET', path: '/api/products/featured', auth: 'Public', desc: 'Returns featured garments for curated editorial sections' },
  { method: 'GET', path: '/api/products/trending', auth: 'Public', desc: 'Returns trending garments sorted by customer rating and volume' },
  { method: 'GET', path: '/api/products/new-arrivals', auth: 'Public', desc: 'Returns newest wardrobe pieces added to database' },
  { method: 'GET', path: '/api/products/:id/related', auth: 'Public', desc: 'Returns complementary pieces matching category and gender' },
  { method: 'POST', path: '/api/products', auth: 'Admin', desc: 'Admin creates garment with multiple images, size arrays, and color palettes in transaction' },
  { method: 'PUT', path: '/api/products/:id', auth: 'Admin', desc: 'Admin updates existing product specifications, variants, stock, and pricing' },
  { method: 'DELETE', path: '/api/products/:id', auth: 'Admin', desc: 'Admin deletes product with cascading variant and image removal' },
  { method: 'GET', path: '/api/categories', auth: 'Public', desc: 'Returns all categories with active product count aggregation' },
  { method: 'POST', path: '/api/orders', auth: 'Public/User', desc: 'Processes customer checkout, validates stock against DB, computes coupons & taxes, and writes order in transaction' },
  { method: 'GET', path: '/api/orders/my', auth: 'User', desc: 'Retrieves current user past orders with line items and shipment tracking' },
  { method: 'GET', path: '/api/orders', auth: 'Admin', desc: 'Admin queries all orders with status filtering and customer search' },
  { method: 'PUT', path: '/api/orders/:id/status', auth: 'Admin', desc: 'Admin updates order status (Pending, Confirmed, Shipped, Delivered) and tracking code' },
  { method: 'POST', path: '/api/coupons/validate', auth: 'Public', desc: 'Validates promotional discount code against current subtotal and usage limits' },
  { method: 'GET', path: '/api/admin/dashboard', auth: 'Admin', desc: 'Aggregates gross revenue, total orders, low stock products, and monthly sales data' },
  { method: 'GET', path: '/api/admin/inventory', auth: 'Admin', desc: 'Lists inventory SKU stock counts with low-stock filter capability' },
  { method: 'PUT', path: '/api/admin/inventory/:id/stock', auth: 'Admin', desc: 'Performs inline stock quantity replenishment' }
];

const ProjectInfoPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in text-slate-800">
      {/* Title Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-widest border border-amber-400/30">
          <FileText className="w-3.5 h-3.5" />
          <span>System Documentation & Technical Blueprint</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-tight">
          Project Information & Architecture
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-3xl font-light leading-relaxed">
          Comprehensive technical documentation covering system architecture, relational database schemas, REST APIs, security practices, and operational specifications for the Atelier & Co. e-commerce platform.
        </p>
      </div>

      {/* Navigation Table of Contents */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <h3 className="font-serif text-base font-bold text-slate-900 mb-4 uppercase tracking-wider">
          Documentation Index (15 Sections)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-stone-600">
          <a href="#section-1" className="hover:text-amber-800 transition-colors">1. Project Overview</a>
          <a href="#section-2" className="hover:text-amber-800 transition-colors">2. Project Objectives</a>
          <a href="#section-3" className="hover:text-amber-800 transition-colors">3. Main Features</a>
          <a href="#section-4" className="hover:text-amber-800 transition-colors">4. Customer Features</a>
          <a href="#section-5" className="hover:text-amber-800 transition-colors">5. Admin Features</a>
          <a href="#section-6" className="hover:text-amber-800 transition-colors">6. Technology Stack</a>
          <a href="#section-7" className="hover:text-amber-800 transition-colors">7. System Architecture</a>
          <a href="#section-8" className="hover:text-amber-800 transition-colors">8. Folder Structure</a>
          <a href="#section-9" className="hover:text-amber-800 transition-colors">9. Database Structure (SQL)</a>
          <a href="#section-10" className="hover:text-amber-800 transition-colors">10. REST API Structure</a>
          <a href="#section-11" className="hover:text-amber-800 transition-colors">11. Authentication Pipeline</a>
          <a href="#section-12" className="hover:text-amber-800 transition-colors">12. Security Practices</a>
          <a href="#section-13" className="hover:text-amber-800 transition-colors">13. Development Tools</a>
          <a href="#section-14" className="hover:text-amber-800 transition-colors">14. AI Development Assistance</a>
          <a href="#section-15" className="hover:text-amber-800 transition-colors">15. Future Roadmap & Extensibility</a>
        </div>
      </div>

      {/* 1 & 2: Overview & Objectives */}
      <section id="section-1" className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Section 1 & 2</span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
              Project Overview & Objectives
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-stone-600 space-y-4 leading-relaxed font-light">
            <p>
              <strong>Atelier & Co.</strong> is a full-stack, enterprise-grade clothing e-commerce web application engineered to emulate contemporary luxury fashion platforms. Unlike boilerplate templates, the system incorporates end-to-end relational data integrity, stateless token authentication, fine-grained inventory management, server-side price validation, and a completely segregated administrative management console.
            </p>
            <p>
              <strong>Primary Objectives:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2 text-stone-700">
              <li>Deliver an elevated, responsive user experience tailored for high-end fashion browsing across desktop, tablet, and mobile displays.</li>
              <li>Implement strict separation of concerns between client state, REST controllers, business services, and normalized relational SQL tables.</li>
              <li>Provide an administrative suite capable of catalog CRUD operations, order lifecycle moderation, customer account administration, and warehouse telemetry.</li>
              <li>Maintain total transparency through dedicated technical documentation detailing every architectural decision and integrated dependency.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3, 4, 5: Features Matrix */}
      <section id="section-3" className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Section 3, 4 & 5</span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
              Core Capabilities & Feature Matrix
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 p-6 bg-stone-50 rounded-2xl border border-stone-100">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Customer Storefront Features</span>
              </h3>
              <ul className="text-xs text-stone-600 space-y-2.5">
                <li>• <strong>Departmental Browsing:</strong> Dedicated shopping pathways for Men, Women, and Kids with tailored category filters.</li>
                <li>• <strong>Multi-Faceted Search:</strong> Real-time keyword search with instant filtering by size, color, price range, stock, and ratings.</li>
                <li>• <strong>Interactive Cart Drawer:</strong> Sliding bag with live quantity modification, free shipping progress bar, and voucher code application.</li>
                <li>• <strong>Product Detail Studio:</strong> High-resolution multi-angle photography zoom, size and color selectors, fabric specifications, care instructions, and customer reviews.</li>
                <li>• <strong>Patron Account & Orders:</strong> Saved wishlists, personal shipping address manager, and historical order receipts with printable invoices.</li>
                <li>• <strong>Checkout Flow:</strong> Multi-tiered shipping and future-ready payment module (Card/UPI/COD) with celebratory confirmation.</li>
              </ul>
            </div>

            <div className="space-y-4 p-6 bg-stone-50 rounded-2xl border border-stone-100">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <span>Administrative Control Features</span>
              </h3>
              <ul className="text-xs text-stone-600 space-y-2.5">
                <li>• <strong>Financial & Order Telemetry:</strong> Dashboard cards monitoring revenue, active orders, customer counts, and order pipeline states.</li>
                <li>• <strong>Catalog CRUD Suite:</strong> Multi-image URL publishing, variant generation, SKU assignment, and price discount scheduling.</li>
                <li>• <strong>Order Lifecycle Dispatch:</strong> Status transition management (Pending $\rightarrow$ Confirmed $\rightarrow$ Shipped $\rightarrow$ Delivered) and carrier tracking assignment.</li>
                <li>• <strong>Warehouse Inventory Control:</strong> Real-time low stock surveillance and inline quantity adjustments.</li>
                <li>• <strong>Client Directory:</strong> Customer lifetime spend aggregation and account activation/deactivation toggling.</li>
                <li>• <strong>Review Moderation:</strong> Verified client endorsement approval and deletion controls.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7: System Architecture Visual Flow */}
      <section id="section-7" className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Section 7</span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
              System Architecture & Data Flow
            </h2>
          </div>

          {/* Visual Architecture Diagram */}
          <div className="p-6 bg-stone-950 text-white rounded-2xl space-y-8 font-mono text-xs">
            <div>
              <p className="text-amber-400 font-bold uppercase tracking-wider mb-2">// Customer Storefront Traffic Flow</p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="p-2.5 bg-stone-800 rounded-lg w-full sm:w-auto">Client Browser (React SPA)</div>
                <div className="text-amber-400 font-bold">⎯⎯ HTTP REST ⎯⎯▶</div>
                <div className="p-2.5 bg-stone-800 rounded-lg w-full sm:w-auto">Node.js + Express API (:5000)</div>
                <div className="text-amber-400 font-bold">⎯⎯ better-sqlite3 ⎯⎯▶</div>
                <div className="p-2.5 bg-amber-900 text-amber-100 rounded-lg w-full sm:w-auto">SQL Database (WAL Mode)</div>
              </div>
            </div>

            <div>
              <p className="text-amber-400 font-bold uppercase tracking-wider mb-2">// Administrative Control Flow</p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="p-2.5 bg-stone-800 rounded-lg w-full sm:w-auto">Admin Panel (/admin)</div>
                <div className="text-amber-400 font-bold">⎯⎯ Bearer JWT ⎯⎯▶</div>
                <div className="p-2.5 bg-stone-800 rounded-lg w-full sm:w-auto">Auth & Role Middleware</div>
                <div className="text-amber-400 font-bold">⎯⎯ ACID Tx ⎯⎯▶</div>
                <div className="p-2.5 bg-amber-900 text-amber-100 rounded-lg w-full sm:w-auto">SQL Relational Tables</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8: Folder Structure */}
      <section id="section-8" className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Section 8</span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
              Codebase Organization & Folder Hierarchy
            </h2>
          </div>

          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 font-mono text-xs text-slate-800 space-y-2 overflow-x-auto">
            <p className="font-bold text-amber-800">monika/task/</p>
            <p className="pl-4">├── <strong className="text-slate-900">backend/</strong></p>
            <p className="pl-8">├── database/ <span className="text-stone-400">(schema.sql, seed.sql, seed.js, ecommerce.db)</span></p>
            <p className="pl-8">├── src/</p>
            <p className="pl-12">├── config/ <span className="text-stone-400">(db.js - SQLite connection & pragma config)</span></p>
            <p className="pl-12">├── controllers/ <span className="text-stone-400">(auth, product, category, order, coupon, review, admin)</span></p>
            <p className="pl-12">├── middleware/ <span className="text-stone-400">(authMiddleware.js, errorHandler.js)</span></p>
            <p className="pl-12">├── routes/ <span className="text-stone-400">(REST router definitions)</span></p>
            <p className="pl-12">├── utils/ <span className="text-stone-400">(jwt.js)</span></p>
            <p className="pl-12">└── server.js <span className="text-stone-400">(Express application entrypoint)</span></p>
            <p className="pl-8">├── .env & .env.example</p>
            <p className="pl-8">└── package.json</p>
            <p className="pl-4">├── <strong className="text-slate-900">frontend/</strong></p>
            <p className="pl-8">├── src/</p>
            <p className="pl-12">├── components/ <span className="text-stone-400">(common, customer, admin)</span></p>
            <p className="pl-12">├── context/ <span className="text-stone-400">(AuthContext, CartContext, WishlistContext, ToastContext)</span></p>
            <p className="pl-12">├── layouts/ <span className="text-stone-400">(CustomerLayout, AdminLayout)</span></p>
            <p className="pl-12">├── pages/ <span className="text-stone-400">(customer & admin views)</span></p>
            <p className="pl-12">├── services/ <span className="text-stone-400">(api.js, modular fetch handlers)</span></p>
            <p className="pl-12">├── utils/ <span className="text-stone-400">(formatters.js)</span></p>
            <p className="pl-12">├── App.jsx & main.jsx</p>
            <p className="pl-12">└── index.css <span className="text-stone-400">(Tailwind CSS v4 & luxury styling)</span></p>
            <p className="pl-8">├── vite.config.js</p>
            <p className="pl-8">└── package.json</p>
          </div>
        </div>
      </section>

      {/* 9: Database Structure (SQL) */}
      <section id="section-9" className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Section 9</span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
              Database Structure & Relational Schema
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <strong className="text-slate-900 font-mono">1. users</strong>
              <p className="text-stone-600">Stores customers and administrators. Attributes: <code>id, name, email (UNIQUE), password_hash, role, phone, address, city, state, postal_code, is_active, created_at</code>.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <strong className="text-slate-900 font-mono">2. categories</strong>
              <p className="text-stone-600">Departmental classifications. Attributes: <code>id, name, slug (UNIQUE), description, image_url, gender_category, display_order</code>.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <strong className="text-slate-900 font-mono">3. products</strong>
              <p className="text-stone-600">Garment catalog. Attributes: <code>id, category_id, gender_category, name, slug, description, price, discount_price, stock, sku, status, rating, reviews_count</code>.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <strong className="text-slate-900 font-mono">4. product_images</strong>
              <p className="text-stone-600">Multi-image gallery per product. Attributes: <code>id, product_id (FK), image_url, is_primary, display_order</code>.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <strong className="text-slate-900 font-mono">5. product_variants</strong>
              <p className="text-stone-600">SKU size and color matrix. Attributes: <code>id, product_id (FK), size, color_name, color_hex, stock, sku</code>.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <strong className="text-slate-900 font-mono">6. orders</strong>
              <p className="text-stone-600">Orders header. Attributes: <code>id, order_number (UNIQUE), user_id (FK), customer_name, customer_email, subtotal, discount, shipping_fee, tax, total, order_status, tracking_number</code>.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <strong className="text-slate-900 font-mono">7. order_items</strong>
              <p className="text-stone-600">Line items per order. Attributes: <code>id, order_id (FK), product_id (FK), product_name, size, color, price, quantity, total</code>.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <strong className="text-slate-900 font-mono">8. reviews & coupons</strong>
              <p className="text-stone-600">Customer feedback ratings and promotional discount codes with usage limits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10: API Endpoints Table */}
      <section id="section-10" className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Section 10</span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
              REST API Endpoints Specification
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Endpoint</th>
                  <th className="py-3 px-4">Authorization</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-slate-800">
                {ENDPOINTS_CATALOG.map((ep, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-bold text-amber-800">{ep.method}</td>
                    <td className="py-3 px-4 text-slate-900">{ep.path}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ep.auth === 'Admin' ? 'bg-amber-100 text-amber-900' : ep.auth === 'User' ? 'bg-blue-100 text-blue-900' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {ep.auth}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-stone-600">{ep.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 11 & 12: Authentication & Security */}
      <section id="section-11" className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Section 11 & 12</span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
              Authentication Pipeline & Security Safeguards
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed font-light">
            <div className="space-y-3 p-6 rounded-2xl bg-stone-50 border border-stone-100">
              <h4 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Stateless Token & Password Hashing</span>
              </h4>
              <p>
                Passwords are never stored in plaintext. Passwords are salted and hashed utilizing <strong>bcryptjs</strong> with 10 salt rounds prior to persistence. Authentication generates signed <strong>JSON Web Tokens (JWT)</strong> valid for 7 days, carrying non-sensitive claims (user ID, email, role).
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-stone-50 border border-stone-100">
              <h4 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Server-Side Order Price Validation</span>
              </h4>
              <p>
                The frontend shopping bag never dictates item pricing during order creation. When <code>POST /api/orders</code> is invoked, product prices and stock quantities are re-verified from the SQL database directly inside an ACID transaction to prevent client manipulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 13, 14 & 15: Tools, AI, Roadmap */}
      <section id="section-13" className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Section 13, 14 & 15</span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
              Tooling, AI Assistance & Future Roadmap
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            <p>
              Developed within Google's <strong>Antigravity</strong> coding environment utilizing <strong>Gemini</strong> agentic AI assistance for normalized relational database schema generation, REST controller design, responsive luxury user interface synthesis, and end-to-end regression verification.
            </p>
            <p>
              <strong>Future Roadmap Additions:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700 text-xs">
              <li>Direct payment gateway webhook integration (Stripe / Razorpay live webhooks).</li>
              <li>Automated transactional order confirmation emails via Resend or SendGrid.</li>
              <li>Multi-warehouse inventory location tracking and international customs documentation generator.</li>
              <li>Automated customer garment sizing advisor powered by patron measurements.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectInfoPage;
