import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import ProductGrid from '../../components/customer/ProductGrid';
import FilterSidebar from '../../components/customer/FilterSidebar';
import QuickViewModal from '../../components/customer/QuickViewModal';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

const CategoryPage = ({ genderOverride }) => {
  const location = useLocation();
  const params = useParams();

  // Determine gender from props or path
  let gender = genderOverride;
  if (!gender) {
    if (location.pathname.startsWith('/men')) gender = 'men';
    else if (location.pathname.startsWith('/women')) gender = 'women';
    else if (location.pathname.startsWith('/kids')) gender = 'kids';
    else gender = params.gender || '';
  }

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, pages: 1 });

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  // Mobile filters drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Fetch categories for this gender
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getCategories(gender);
        if (res.success && res.data?.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, [gender]);

  // Fetch products whenever filters or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = {
          gender,
          category: selectedCategory,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          size: selectedSize,
          color: selectedColor,
          inStock: inStockOnly ? 'true' : '',
          rating: minRating,
          sort,
          page,
          limit: 12
        };

        const res = await productService.getProducts(queryParams);
        if (res.success && res.data) {
          setProducts(res.data.products);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [gender, selectedCategory, priceRange, selectedSize, selectedColor, inStockOnly, minRating, sort, page]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSelectedSize('');
    setSelectedColor('');
    setInStockOnly(false);
    setMinRating('');
    setSort('featured');
    setPage(1);
  };

  const getCategoryTitle = () => {
    switch (gender) {
      case 'men':
        return "Men's Collection";
      case 'women':
        return "Women's Collection";
      case 'kids':
        return "Kids' Collection";
      default:
        return 'Complete Wardrobe Archive';
    }
  };

  const getCategorySubtitle = () => {
    switch (gender) {
      case 'men':
        return 'Architectural outerwear, double-faced wool, and Italian Supima cottons cut with refined proportion.';
      case 'women':
        return 'Lustrous mulberry silks, double-breasted cashmere blazers, and fluid silhouettes designed for contemporary life.';
      case 'kids':
        return 'Certified organic cotton waffle knits, recycled sherpa fleece, and twirl dresses engineered for durability.';
      default:
        return 'Explore timeless silhouettes and certified sustainable textiles.';
    }
  };

  const hasActiveFilters = selectedCategory || priceRange.min || priceRange.max || selectedSize || selectedColor || inStockOnly || minRating;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Category Hero Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold">
            Atelier Permanent Collection
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-tight">
            {getCategoryTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
            {getCategorySubtitle()}
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-stone-800 to-transparent opacity-30 pointer-events-none" />
      </div>

      {/* Control Bar: Product Count, Mobile Filter Trigger, Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-slate-800 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>
          <p className="text-xs text-stone-500 font-medium">
            Showing <strong className="text-slate-900">{pagination.total}</strong> luxury garments
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort-select" className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none text-xs font-semibold bg-white border border-stone-200 rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:border-slate-900 cursor-pointer shadow-xs"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-stone-400 font-medium">Active:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-slate-800 rounded-full text-xs font-medium">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3 text-stone-500 hover:text-black" /></button>
            </span>
          )}
          {(priceRange.min || priceRange.max) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-slate-800 rounded-full text-xs font-medium">
              Price: ${priceRange.min || 0} - ${priceRange.max || 'Any'}
              <button onClick={() => setPriceRange({ min: '', max: '' })}><X className="w-3 h-3 text-stone-500 hover:text-black" /></button>
            </span>
          )}
          {selectedSize && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-slate-800 rounded-full text-xs font-medium">
              Size: {selectedSize}
              <button onClick={() => setSelectedSize('')}><X className="w-3 h-3 text-stone-500 hover:text-black" /></button>
            </span>
          )}
          {selectedColor && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-slate-800 rounded-full text-xs font-medium">
              Color: {selectedColor}
              <button onClick={() => setSelectedColor('')}><X className="w-3 h-3 text-stone-500 hover:text-black" /></button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-slate-800 rounded-full text-xs font-medium">
              In Stock Only
              <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3 text-stone-500 hover:text-black" /></button>
            </span>
          )}
          {minRating && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-slate-800 rounded-full text-xs font-medium">
              {minRating}★ & Above
              <button onClick={() => setMinRating('')}><X className="w-3 h-3 text-stone-500 hover:text-black" /></button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-amber-800 font-semibold hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            priceRange={priceRange}
            onChangePrice={setPriceRange}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            minRating={minRating}
            onSelectRating={setMinRating}
            onClearFilters={clearAllFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          <ProductGrid
            products={products}
            loading={loading}
            onResetFilters={clearAllFilters}
            onQuickView={(p) => setQuickViewProduct(p)}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          />

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
              >
                Previous
              </button>
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i + 1}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 text-xs font-bold rounded-lg transition-colors ${
                    page === i + 1
                      ? 'bg-slate-900 text-white'
                      : 'border border-stone-200 text-slate-700 hover:bg-stone-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b border-stone-100 mb-6">
                <h3 className="font-serif text-lg font-bold text-slate-900">Filters</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-stone-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(c) => {
                  setSelectedCategory(c);
                  setMobileFilterOpen(false);
                }}
                priceRange={priceRange}
                onChangePrice={setPriceRange}
                selectedSize={selectedSize}
                onSelectSize={(s) => {
                  setSelectedSize(s);
                  setMobileFilterOpen(false);
                }}
                selectedColor={selectedColor}
                onSelectColor={(col) => {
                  setSelectedColor(col);
                  setMobileFilterOpen(false);
                }}
                inStockOnly={inStockOnly}
                onToggleInStock={setInStockOnly}
                minRating={minRating}
                onSelectRating={(r) => {
                  setMinRating(r);
                  setMobileFilterOpen(false);
                }}
                onClearFilters={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default CategoryPage;
