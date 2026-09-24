import React from 'react';
import { Layers, Server, Database, Wrench, Bot, CheckCircle, Code2 } from 'lucide-react';

const TECH_DATA = {
  frontend: [
    {
      name: 'React.js (v19)',
      purpose: 'Core User Interface Library',
      where: 'Entire customer-facing storefront and administrative control panel',
      why: 'Provides declarative component architecture, virtual DOM reconciliation, and efficient state management for interactive shopping and dashboard experiences.'
    },
    {
      name: 'React Router (v7)',
      purpose: 'Client-Side Declarative Routing',
      where: 'frontend/src/App.jsx, navigating between /men, /women, /products/:id, /cart, /checkout, /admin/*',
      why: 'Enables seamless Single Page Application (SPA) navigation without full-page browser reloads, deep linking, dynamic parameter parsing, and route authorization guarding.'
    },
    {
      name: 'Tailwind CSS (v4)',
      purpose: 'Utility-First Styling Engine',
      where: 'frontend/src/index.css and every component across the application',
      why: 'Delivers responsive layouts, typography scales, spacing grids, and custom styling without CSS bloat or naming collisions.'
    },
    {
      name: 'Lucide React',
      purpose: 'Modern Iconography System',
      where: 'Throughout navigation, product cards, filters, and admin interface',
      why: 'Consistent, clean, lightweight SVG vector icons optimized for tree-shaking.'
    },
    {
      name: 'Canvas Confetti',
      purpose: 'Micro-Interaction Animation',
      where: 'Checkout confirmation screen upon successful order completion',
      why: 'Elevates customer delight and celebratory feedback on checkout completion.'
    },
    {
      name: 'Vite (v8)',
      purpose: 'Next-Generation Frontend Build Tool & Dev Server',
      where: 'frontend/vite.config.js, development HMR and production bundle optimization',
      why: 'Sub-second Hot Module Replacement (HMR) and roll-up packaging.'
    }
  ],
  backend: [
    {
      name: 'Node.js (v22.21.1)',
      purpose: 'JavaScript Server Runtime',
      where: 'Backend execution environment hosting the Express REST API',
      why: 'High-throughput event-driven I/O engine capable of handling concurrent requests with low latency.'
    },
    {
      name: 'Express.js (v5)',
      purpose: 'REST API Web Framework',
      where: 'backend/src/server.js and backend/src/routes/*',
      why: 'Robust HTTP routing, middleware pipeline, JSON request/response handling, and RESTful resource organization.'
    },
    {
      name: 'better-sqlite3',
      purpose: 'High-Performance Synchronous SQL Engine',
      where: 'backend/src/config/db.js and all backend controllers',
      why: 'Extremely fast, reliable, zero-configuration SQL database engine with direct C++ bindings, full SQL-92 support, transactions, and foreign key constraint enforcement.'
    },
    {
      name: 'jsonwebtoken (JWT)',
      purpose: 'Stateless Authentication & Session Tokens',
      where: 'backend/src/utils/jwt.js and backend/src/middleware/authMiddleware.js',
      why: 'Provides tamper-proof cryptographic JSON Web Tokens for authenticating both customers and administrators across API calls.'
    },
    {
      name: 'bcryptjs',
      purpose: 'One-Way Salted Password Hashing',
      where: 'backend/src/controllers/authController.js and backend/database/seed.js',
      why: 'Secures user credentials with adaptive work-factor hashing to protect against rainbow table and brute-force attacks.'
    },
    {
      name: 'cors',
      purpose: 'Cross-Origin Resource Sharing Middleware',
      where: 'backend/src/server.js',
      why: 'Safely allows the React frontend on localhost:5173 to communicate with the Express API on localhost:5000.'
    },
    {
      name: 'dotenv',
      purpose: 'Environment Configuration Management',
      where: 'backend/src/server.js',
      why: 'Loads sensitive configuration (JWT secrets, port numbers, database file paths) from .env files.'
    },
    {
      name: 'morgan',
      purpose: 'HTTP Request Logger Middleware',
      where: 'backend/src/server.js',
      why: 'Provides real-time terminal logging of HTTP methods, endpoints, status codes, and response times in development.'
    }
  ],
  database: [
    {
      name: 'SQL Relational Database (SQLite)',
      purpose: 'Persistent Relational Storage Engine',
      where: 'backend/database/ecommerce.db and backend/database/schema.sql',
      why: 'Provides full ACID guarantees, relational integrity via foreign keys, atomic transactions, and B-tree indexes without external daemon management.'
    },
    {
      name: 'Write-Ahead Logging (WAL Mode)',
      purpose: 'Concurrent Database Journaling',
      where: 'backend/src/config/db.js (PRAGMA journal_mode = WAL)',
      why: 'Allows simultaneous reads and writes without thread contention or table locking.'
    }
  ],
  tools: [
    {
      name: 'Antigravity IDE & Agentic Environment',
      purpose: 'Development & Orchestration Environment',
      where: 'Complete project lifecycle management and terminal execution',
      why: 'Provides integrated terminal tooling, background task supervision, and autonomous coding assistance.'
    },
    {
      name: 'Windows PowerShell 5.1 / Node Toolchain',
      purpose: 'Command-Line Shell & Execution Environment',
      where: 'Running build scripts, dependency installation, and local servers',
      why: 'Native administrative and execution pipeline for running Node.js and npm commands.'
    }
  ],
  ai: [
    {
      name: 'Gemini (Advanced Agentic AI)',
      purpose: 'Architecture Planning, Full-Stack Code Synthesis, Schema Design',
      where: 'Pair programming partner across frontend, backend, database, and documentation',
      why: 'Accelerated design of normalized SQL schemas, REST API controllers, stateful React components, and responsive luxury styling.'
    }
  ]
};

const TechnologyPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-14 text-center space-y-4 shadow-lg">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold">
          Technical Architecture Specification
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-tight">
          Technologies & Tools
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
          Comprehensive inventory of every library, runtime, database engine, and development tool actually incorporated into this clothing e-commerce platform.
        </p>
      </div>

      {/* Sections */}
      {/* 1. Frontend */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-800">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Frontend Technologies</h2>
            <p className="text-xs text-stone-500">Client-side rendering, routing, styling, and interactivity.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TECH_DATA.frontend.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                  {t.purpose}
                </span>
              </div>
              <div className="text-xs space-y-1.5 text-stone-600">
                <p><strong>Where Used: </strong><code className="text-[11px] bg-stone-100 px-1 py-0.5 rounded">{t.where}</code></p>
                <p><strong>Why Included: </strong>{t.why}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Backend */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Backend Technologies</h2>
            <p className="text-xs text-stone-500">Server environment, REST controllers, and authentication middleware.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TECH_DATA.backend.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  {t.purpose}
                </span>
              </div>
              <div className="text-xs space-y-1.5 text-stone-600">
                <p><strong>Where Used: </strong><code className="text-[11px] bg-stone-100 px-1 py-0.5 rounded">{t.where}</code></p>
                <p><strong>Why Included: </strong>{t.why}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Database */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Database Architecture</h2>
            <p className="text-xs text-stone-500">Relational SQL schema, integrity constraints, and persistence.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TECH_DATA.database.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                  {t.purpose}
                </span>
              </div>
              <div className="text-xs space-y-1.5 text-stone-600">
                <p><strong>Where Used: </strong><code className="text-[11px] bg-stone-100 px-1 py-0.5 rounded">{t.where}</code></p>
                <p><strong>Why Included: </strong>{t.why}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Development Tools & AI */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-800">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Development Tools & AI Assistance</h2>
            <p className="text-xs text-stone-500">Toolchain, environment, and artificial intelligence coding collaboration.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...TECH_DATA.tools, ...TECH_DATA.ai].map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-800">
                  {t.purpose}
                </span>
              </div>
              <div className="text-xs space-y-1.5 text-stone-600">
                <p><strong>Where Used: </strong><code className="text-[11px] bg-stone-100 px-1 py-0.5 rounded">{t.where}</code></p>
                <p><strong>Why Included: </strong>{t.why}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TechnologyPage;
