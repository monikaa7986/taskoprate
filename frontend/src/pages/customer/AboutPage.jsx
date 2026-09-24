import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Leaf, Globe, Award, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';

const AboutPage = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-stone-950 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80"
          alt="Atelier workshop"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center py-20 space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300 font-bold">
            Our Architectural Manifesto
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold uppercase tracking-tight">
            Permanence Over Trend
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Atelier & Co. was founded on an exacting ethos: to create contemporary clothing of uncompromising craftsmanship, eliminating plastic fibers in favor of regenerative natural textiles.
          </p>
        </div>
      </section>

      {/* Philosophy Columns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold">
              Provenance & Heritage
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Honoring Generational European Mills
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              In an era dominated by hyper-fast disposable clothing and synthetic micro-plastics, Atelier partners exclusively with family-owned heritage weaving houses across Biella, Italy, Lyon, France, and Hokkaido, Japan.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Each double-faced coat undergoes up to 48 separate hand-pressed operations. Every button is turned from natural horn or sustainably farmed mother-of-pearl, ensuring that when a garment reaches your wardrobe, it is built to outlast seasons.
            </p>

            <div className="pt-2">
              <Link to="/women">
                <Button icon={ArrowRight} iconPosition="right">
                  Explore Collections
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-stone-100">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan at work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Milestone Stats */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="font-serif text-4xl sm:text-5xl font-bold text-amber-300">100%</p>
              <p className="text-xs uppercase tracking-widest text-stone-400">Traceable Natural Fibers</p>
            </div>
            <div className="space-y-2">
              <p className="font-serif text-4xl sm:text-5xl font-bold text-amber-300">0%</p>
              <p className="text-xs uppercase tracking-widest text-stone-400">Petroleum Synthetics</p>
            </div>
            <div className="space-y-2">
              <p className="font-serif text-4xl sm:text-5xl font-bold text-amber-300">30-Day</p>
              <p className="text-xs uppercase tracking-widest text-stone-400">Guaranteed Return Portal</p>
            </div>
            <div className="space-y-2">
              <p className="font-serif text-4xl sm:text-5xl font-bold text-amber-300">48h</p>
              <p className="text-xs uppercase tracking-widest text-stone-400">Carbon-Offset Dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold">
            Conscious Living
          </p>
          <h2 className="font-serif text-3xl font-bold text-slate-900">
            Our Environmental Compact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <Leaf className="w-8 h-8 text-emerald-600 mb-2" />
            <h3 className="font-serif text-lg font-bold text-slate-900">GOTS Organic Certification</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              All combed cottons are grown without synthetic fertilizers or chemical pesticides, preserving biodiversity in farming communities.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <Globe className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-serif text-lg font-bold text-slate-900">Biodegradable Packaging</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Every parcel arrives ensconced in water-soluble botanical tissue and FSC-certified unbleached Kraft mailers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <Award className="w-8 h-8 text-amber-600 mb-2" />
            <h3 className="font-serif text-lg font-bold text-slate-900">Heirloom Longevity</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Garments designed to look as relevant a decade hence as they do today, diminishing demand for endless quarterly replacement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
