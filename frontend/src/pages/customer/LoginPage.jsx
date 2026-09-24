import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === 'admin' && from === '/account') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch {
      // toast shown in context
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail('customer@atelier.com');
    setPassword('password123');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@atelier.com');
    setPassword('admin123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-block font-serif text-3xl font-bold tracking-[0.2em] text-slate-900 uppercase">
          ATELIER
        </Link>
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-stone-500">
          Access your saved collection, past orders, and tailored preferences.
        </p>
      </div>

      {/* Demo Credentials Box */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Quick Demo Access (One-Click Fill)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={fillDemoCustomer}
            className="text-left p-2 rounded-lg bg-white border border-amber-200/80 hover:border-amber-400 text-xs transition-colors"
          >
            <p className="font-semibold text-slate-900">Customer Demo</p>
            <p className="text-[10px] text-stone-500 font-mono">customer@atelier.com</p>
          </button>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="text-left p-2 rounded-lg bg-white border border-amber-200/80 hover:border-amber-400 text-xs transition-colors"
          >
            <p className="font-semibold text-slate-900">Admin Demo</p>
            <p className="text-[10px] text-stone-500 font-mono">admin@atelier.com</p>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patron@example.com"
              className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Password
            </label>
            <span className="text-[11px] text-stone-400 hover:text-black cursor-pointer">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={loading}
          className="w-full"
          icon={ArrowRight}
          iconPosition="right"
        >
          Sign In
        </Button>

        <div className="pt-2 text-center text-xs text-stone-500">
          <span>New to Atelier & Co.? </span>
          <Link to="/register" className="font-semibold text-slate-900 hover:text-amber-800 underline">
            Create an Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
