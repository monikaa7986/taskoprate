import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code
      });
      navigate('/account');
    } catch {
      // toast shown in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-20 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <Link to="/" className="inline-block font-serif text-3xl font-bold tracking-[0.2em] text-slate-900 uppercase">
          ATELIER
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
          Create Your Patron Account
        </h1>
        <p className="text-xs text-stone-500">
          Join Atelier & Co. for expedited checkout, complimentary alterations, and archival previews.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Full Legal Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Sophia Laurent"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sophia@example.com"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Password * (Min 6 chars)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 782-9901"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Shipping Street Address (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="124 Mercer Street, Loft 4A"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="New York"
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="10012"
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
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
          Create Account & Sign In
        </Button>

        <div className="pt-2 text-center text-xs text-stone-500">
          <span>Already hold an account? </span>
          <Link to="/login" className="font-semibold text-slate-900 hover:text-amber-800 underline">
            Sign In Here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
