import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role !== 'admin') {
        showToast('Access restricted: Administrator role required.', 'error');
        return;
      }
      navigate('/admin/dashboard');
    } catch {
      // Toast handled by auth context
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@atelier.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-600/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-[0.2em] text-white uppercase">
            ATELIER
          </h1>
          <p className="text-xs uppercase tracking-widest text-stone-400">
            Administrative Control Console
          </p>
        </div>

        {/* Demo Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-white">Default Admin Account</p>
            <p className="text-stone-400 font-mono text-[11px]">admin@atelier.com / admin123</p>
          </div>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>One-Click Fill</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-3xl p-8 border border-slate-800 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@atelier.com"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 text-white placeholder-stone-600"
              />
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Secret Key / Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 text-white font-mono placeholder-stone-600"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="w-full bg-amber-700 hover:bg-amber-600 text-white font-semibold"
            icon={ArrowRight}
            iconPosition="right"
          >
            Authenticate Console
          </Button>

          <div className="pt-2 text-center text-xs text-stone-500">
            <Link to="/" className="hover:text-stone-300 transition-colors">
              ← Return to Customer Storefront
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
