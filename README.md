# ATELIER & CO. — Contemporary Clothing E-Commerce Platform

A production-style, responsive, full-stack clothing e-commerce web application with customer storefront and separate administrative control panel.

---

## 🌟 Technology Stack

* **Frontend:** React 19, React Router v7, Tailwind CSS v4, Lucide React, Canvas Confetti, Vite 8
* **Backend:** Node.js (v22), Express.js (v5), REST API Architecture
* **Database:** SQL / SQLite with Write-Ahead Logging (`WAL` mode) & foreign key constraints via `better-sqlite3`
* **Security:** JSON Web Tokens (JWT), Salted Bcrypt Password Hashing, Server-Side Price & Stock Validation
* **Development Environment:** Google Antigravity

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Run

```bash
cd backend

# Install dependencies (already installed)
npm install

# Seed the SQL Database (creates 14 products, 8 categories, 3 users, 3 coupons, orders)
npm run seed

# Start the REST API server on http://localhost:5000
npm start
```

### 2. Frontend Setup & Run

```bash
cd frontend

# Install dependencies (already installed)
npm install

# Start Vite dev server on http://localhost:5173
npm run dev

# Or build production bundle
npm run build
```

---

## 🔐 Demo Credentials

| Role | Email | Password | Access Path |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@atelier.com` | `admin123` | `/admin/login` or `/admin/dashboard` |
| **Customer** | `customer@atelier.com` | `password123` | `/login` or `/account` |

*(One-click demo buttons are provided on both `/login` and `/admin/login`)*

---

## 🛍️ Active Promotional Coupons

* **`WELCOME10`**: 10% discount on initial orders (min spend: $50)
* **`LUXE20`**: 20% discount on orders over $150
* **`ATELIER50`**: $50 flat reduction on orders over $250

---

## 🧭 Application Routes

### Customer Storefront
* `/` — Home (Hero, Categories, Featured/Trending/New Arrivals tabs, Editorial banner, Reviews)
* `/men` — Men's Collection (Filters by category, size, price, color, in-stock, rating)
* `/women` — Women's Collection (Silks, dresses, blazers, outerwear)
* `/kids` — Kids' Collection (Organic cotton basics, sherpa jackets, twirl dresses)
* `/products/:id` — Product Details (Multi-image gallery, variant selectors, reviews, related pieces)
* `/search` — Keyword Search with real-time multi-filtering
* `/cart` — Dedicated Shopping Bag
* `/checkout` — Checkout (Address, delivery, future-ready payment module, instant confirmation)
* `/login` & `/register` — Authentication with demo credential fill
* `/account` — Patron Portal (Personal profile, shipping address editor, saved wishlist)
* `/orders` — Order History with tracking badges and printable invoices
* `/about` — Brand Philosophy, Ethical Manufacturing, Sustainable Mills
* `/contact` — Concierge Contact, Flagship Showrooms, FAQ Accordion
* `/technology` — Complete Technical Architecture & Tools Reference
* `/project-info` — 15-Section Comprehensive Project Documentation
* `404` — Fashion-themed Not Found recovery page

### Admin Control Panel (`/admin`)
* `/admin/login` — Dedicated Admin Console Authentication
* `/admin/dashboard` — KPI Metrics (Revenue, Orders, Products, Patrons, Low Stock), Pipeline chart, Recent Orders
* `/admin/products` — Product Catalog Table with search, department filter, and deletion
* `/admin/products/add` — Comprehensive Add Garment form (Images, sizes, colors, SKU, pricing, stock)
* `/admin/products/:id/edit` — Edit Garment form with pre-populated data
* `/admin/categories` — Department Category Management with product counts
* `/admin/orders` — Order Fulfillment with status pipeline updater and courier tracking assignment
* `/admin/customers` — Client Directory with lifetime spend metrics and account deactivation
* `/admin/inventory` — Warehouse Inventory Surveillance with inline stock replenishment
* `/admin/reviews` — Customer Feedback Moderation (Approve/Hide/Delete)
* `/admin/coupons` — Promotional Voucher Manager with redemption rules
* `/admin/settings` — Commercial Storefront Settings (Taxes, shipping threshold, brand info)

---

## 🗄️ Relational Database Schema (`backend/database/schema.sql`)

* `users` — Customers and administrators with salted password hashes
* `categories` — Departments and shopping categories
* `products` — Garment catalog with prices, discounts, stock, SKU, ratings
* `product_images` — Multi-image URLs per garment
* `product_variants` — SKU size and color swatch matrices
* `orders` & `order_items` — Relational order header and purchase line items
* `reviews` — Customer product ratings and endorsements
* `coupons` — Promotional discount rules and usage trackers
* `wishlist` — Saved patron items
* `store_settings` — Key-value operational configurations
