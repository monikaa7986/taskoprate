import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const ContactPage = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Styling Consultation',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      showToast('Your inquiry has been received. Our concierge will respond within 4 business hours.', 'success');
      setFormData({ name: '', email: '', topic: 'Styling Consultation', message: '' });
      setSubmitting(false);
    }, 600);
  };

  const faqs = [
    {
      q: 'What are your complimentary shipping thresholds?',
      a: 'We offer complimentary express courier shipping on all global orders exceeding $150. For orders under this threshold, a flat $12 express courier rate applies.'
    },
    {
      q: 'How does your 30-day return policy operate?',
      a: 'All unworn, unwashed garments retaining original tags and security ribbons are eligible for prepaid complimentary return or size exchange within 30 days of arrival.'
    },
    {
      q: 'How should I determine my optimal sizing?',
      a: 'Our garments are patterned according to traditional European bespoke tailoring standards with contemporary drape. Detailed measurement charts and fit notes are available on each individual product details page.'
    },
    {
      q: 'Do you offer bespoke tailoring or alterations?',
      a: 'We provide complimentary sleeve and hem alterations at all our flagship ateliers in New York, Paris, and London upon presentation of your order reference.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold">
          Client Services & Concierge
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
          How May We Assist You?
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
          Whether seeking personal styling advice, bespoke alterations guidance, or order status assistance, our atelier team is at your disposal.
        </p>
      </div>

      {/* Grid: Form (7 cols) & Details (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Transmit an Inquiry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Camille Dupont"
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="camille@example.com"
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Inquiry Topic
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="Styling Consultation">Private Styling & Fit Advice</option>
                <option value="Order Tracking">Order Dispatch & Delivery Query</option>
                <option value="Returns & Exchanges">Complimentary Return / Exchange</option>
                <option value="Wholesale & Press">Press, Editorial & Wholesale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Message *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please describe how we can assist you with your wardrobe requirements..."
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={submitting}
              icon={Send}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Transmit Message
            </Button>
          </form>
        </div>

        {/* Concierge Details & Showrooms */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-stone-900 text-white rounded-3xl p-8 space-y-6 shadow-md">
            <h3 className="font-serif text-xl font-bold text-white">
              Private Concierge
            </h3>
            <div className="space-y-4 text-xs text-stone-300">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Direct Line</p>
                  <p>+1 (800) 492-8350</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Electronic Dispatch</p>
                  <p>concierge@atelierclothing.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Advisory Hours</p>
                  <p>Monday — Saturday: 09:00 — 20:00 EST</p>
                  <p>Sunday: 11:00 — 18:00 EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Showroom Locations */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Flagship Showrooms
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-stone-600">
              <div>
                <p className="font-bold text-slate-900">New York</p>
                <p>740 Fifth Avenue</p>
                <p>Floor 18</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">Paris</p>
                <p>28 Rue du Faubourg</p>
                <p>Saint-Honoré, 75008</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">London</p>
                <p>14 Savile Row</p>
                <p>Mayfair, W1S 3JN</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">Milan</p>
                <p>Via Monte Napoleone</p>
                <p>12, 20121 Milano</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold">
            Frequently Inquired
          </p>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Common Client Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-stone-100">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                className="w-full flex justify-between items-center text-left py-2 focus:outline-none"
              >
                <span className="font-serif text-sm sm:text-base font-bold text-slate-900">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                    openFaq === index ? 'transform rotate-180 text-black' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed pt-2 animate-fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
