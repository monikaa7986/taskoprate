import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Quote,
  TrendingUp,
  Clock
} from 'lucide-react';
import Button from '../../components/common/Button';
import CategoryCard from '../../components/customer/CategoryCard';
import ProductGrid from '../../components/customer/ProductGrid';
import QuickViewModal from '../../components/customer/QuickViewModal';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('featured'); // 'featured' | 'new-arrivals' | 'trending'
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, newRes, trendRes] = await Promise.all([
          productService.getFeatured(),
          productService.getNewArrivals(),
          productService.getTrending()
        ]);

        if (featRes.success) setFeaturedProducts(featRes.data.products);
        if (newRes.success) setNewArrivals(newRes.data.products);
        if (trendRes.success) setTrendingProducts(trendRes.data.products);
      } catch (err) {
        console.error('Error fetching homepage products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDisplayedProducts = () => {
    switch (activeTab) {
      case 'new-arrivals':
        return newArrivals;
      case 'trending':
        return trendingProducts;
      case 'featured':
      default:
        return featuredProducts;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-stone-950 overflow-hidden">
        {/* Background Visual */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="Atelier Autumn Collection"
            className="w-full h-full object-cover object-center opacity-45 transform scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs uppercase tracking-[0.25em] text-amber-300 font-semibold animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autumn / Winter 2026 Collection</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[1.08] max-w-4xl mx-auto">
            The Architecture of Contemporary Wardrobe
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Impeccably tailored virgin wool coats, fluid mulberry silks, and fine-gauge Australian merino knits engineered for longevity and effortless grace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/women">
              <Button size="lg" className="w-full sm:w-auto bg-white text-slate-950 hover:bg-stone-100 font-semibold">
                Explore Women's
              </Button>
            </Link>
            <Link to="/men">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-semibold">
                Explore Men's
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Primary Shopping Categories (Men, Women, Kids) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold">
            Curated Archives
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Tailored garments crafted from certified organic and regenerative natural materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CategoryCard
            title="Men's Wardrobe"
            subtitle="Tailored & Relaxed"
            image="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80"
            link="/men"
            count="18"
          />
          <CategoryCard
            title="Women's Wardrobe"
            subtitle="Silk, Knits & Suiting"
            image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
            link="/women"
            count="24"
          />
          <CategoryCard
            title="Kids' Collection"
            subtitle="Hypoallergenic Essentials"
            image="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80"
            link="/kids"
            count="12"
          />
        </div>
      </section>

      {/* 3. Featured & Trending Collection Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-stone-200">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold mb-1">
              Select Pieces
            </p>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Editor's Selection
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'featured'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-black hover:bg-stone-200/60'
              } hover:-translate-y-0.5 active:translate-y-0 active:scale-95`}
            >
              Featured
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('new-arrivals')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'new-arrivals'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-black hover:bg-stone-200/60'
              } hover:-translate-y-0.5 active:translate-y-0 active:scale-95`}
            >
              New Arrivals
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'trending'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-black hover:bg-stone-200/60'
              } hover:-translate-y-0.5 active:translate-y-0 active:scale-95`}
            >
              Trending
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={getDisplayedProducts()}
          loading={loading}
          onQuickView={(p) => setQuickViewProduct(p)}
        />

        <div className="text-center mt-12">
          <Link to="/women">
            <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right">
              View All 50+ Garments in Catalog
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. Promotional Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
              alt="Promotional Runway"
              className="w-full h-full object-cover object-right md:object-center opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
          </div>

          <div className="relative max-w-xl p-8 sm:p-16 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-widest border border-amber-400/30">
              <Clock className="w-3.5 h-3.5" />
              <span>Limited Archive Window</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Complimentary Atelier Welcome Gift
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Receive 10% off your inaugural wardrobe order and complimentary express worldwide courier handling. Use promotional code <strong className="text-amber-300 font-mono text-sm">WELCOME10</strong> at checkout.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/women">
                <Button className="bg-amber-700 hover:bg-amber-600 text-white font-semibold">
                  Shop New Arrivals
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-stone-500 text-white hover:bg-white/10">
                  Read Our Manifesto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us / Craftsmanship Section */}
      <section className="bg-white py-16 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold">
              Uncompromising Standards
            </p>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              The Atelier Standard
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Every seam, buttonhole, and lining is engineered to outlive rapid trend cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center space-y-3 p-6 rounded-2xl bg-stone-50/70 border border-stone-100">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-slate-900">100% Traceable Textiles</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                From Grade-6A mulberry silks to GOTS-certified Aegean organic cottons, our fibers are ethically sourced and free from microplastics.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-2xl bg-stone-50/70 border border-stone-100">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-slate-900">Slow Fashion Ethos</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                We produce in intentional, limited runs to eliminate deadstock waste while preserving generational tailoring techniques.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-2xl bg-stone-50/70 border border-stone-100">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-slate-900">Carbon-Neutral Courier</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Orders are protected with plastic-free biodegradable mulberry paper packaging and dispatched via carbon-offset logistics partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold">
            Patron Voices
          </p>
          <h2 className="font-serif text-3xl font-bold text-slate-900">
            Endorsements of Elegance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
              "The Double-Breasted Wool Overcoat possesses the precise silhouette and drape of high-end savile row tailoring. It has instantly become the cornerstone of my winter rotation."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Julian Hayes</p>
                <p className="text-[11px] text-stone-400">Architect, London</p>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Verified Buyer</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
              "Finding genuine 22 momme silk charmeuse at this transparent price point is virtually unheard of today. The bias-cut falls like liquid gold. Completely exquisite."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Camille Dupont</p>
                <p className="text-[11px] text-stone-400">Creative Director, Paris</p>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Verified Buyer</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
              "The Kids' Organic Sherpa Corduroy jacket survived an entire winter of playground games and still looks brand new. Quality that can actually be passed down between siblings."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Elena Rostova</p>
                <p className="text-[11px] text-stone-400">Interior Designer, New York</p>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default HomePage;
