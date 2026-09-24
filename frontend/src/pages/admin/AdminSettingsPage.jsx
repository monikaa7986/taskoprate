import React, { useState, useEffect } from 'react';
import { Save, Sliders, Store, DollarSign, Truck, ShieldAlert } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const AdminSettingsPage = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    store_name: 'ATELIER & CO.',
    store_tagline: 'Contemporary Elegance & Timeless Wardrobe Essentials',
    currency_symbol: '$',
    tax_rate_percent: '8.5',
    free_shipping_threshold: '150',
    standard_shipping_rate: '12.00',
    support_email: 'concierge@atelierclothing.com',
    support_phone: '+1 (800) 492-8350'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService.getSettings()
      .then((res) => {
        if (res.success && res.data?.settings) {
          setSettings((prev) => ({ ...prev, ...res.data.settings }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminService.updateSettings(settings);
      if (res.success) {
        showToast('Store settings synchronized.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Error saving settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-24"><Loader text="Loading atelier configurations..." /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Storefront & Commercial Settings
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure financial rules, shipping thresholds, concierge contacts, and currency.
          </p>
        </div>

        <Button onClick={handleSubmit} isLoading={saving} icon={Save}>
          Save Settings
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Store Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-700" />
            <span>Brand Identity & Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Storefront Name
              </label>
              <input
                type="text"
                name="store_name"
                value={settings.store_name}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                name="store_tagline"
                value={settings.store_tagline}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Concierge Inbound Email
              </label>
              <input
                type="email"
                name="support_email"
                value={settings.support_email}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Direct Telephone Support
              </label>
              <input
                type="text"
                name="support_phone"
                value={settings.support_phone}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Commercial Accounting & Shipping Rates */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-700" />
            <span>Fiscal Rules & Courier Logistics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                name="currency_symbol"
                value={settings.currency_symbol}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 text-center font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="tax_rate_percent"
                value={settings.tax_rate_percent}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Free Shipping Over ($)
              </label>
              <input
                type="number"
                name="free_shipping_threshold"
                value={settings.free_shipping_threshold}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Standard Shipping ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="standard_shipping_rate"
                value={settings.standard_shipping_rate}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" isLoading={saving} icon={Save}>
            Apply Store Configurations
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
