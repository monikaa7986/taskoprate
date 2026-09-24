import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductGrid from '../../components/customer/ProductGrid';
import FilterSidebar from '../../components/customer/FilterSidebar';
import QuickViewModal from '../../components/customer/QuickViewModal';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(query);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, pages: 1 });

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setInputVal(query);
  }, [query]);

  // Load categories
  useEffect(() => {
    categoryService.getCategories()
      .then((res) => {
        if (res.success && res.data?.categories) setCategories(res.data.categories);
      })
      .catch(() => {});
  }, []);

  // Fetch search products
  useEffect(() => {
    const fetchSearch = async () => {
      try {
        setLoading(true);
        const res = await productService.getProducts({
          search: query,
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
        });

        if (res.success && res.data) {
          setProducts(res.data.products);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query, selectedCategory, priceRange, selectedSize, selectedColor, inStockOnly, minRating, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setInputVal('');
    setSearchParams({});
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Search Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-md">
        <div className="max-w-xl mx-auto space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold">
            Atelier Archive Search
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Explore the Wardrobe
          </h1>
        </div>

        {/* Big Search Input */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative flex items-center">
          <input
            type="text"
            placeholder="Search by garment name, material, cut, or styling..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full text-sm pl-12 pr-28 py-3.5 bg-white text-slate-900 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xl placeholder-stone-400"
          />
          <SearchIcon className="w-5 h-5 text-stone-400 absolute left-4.5" />
          <div className="absolute right-2 flex items-center gap-1">
            {inputVal && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-stone-400 hover:text-black mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="bg-slate-900 text-white hover:bg-black text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-slate-800 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <p className="text-xs text-stone-500 font-medium">
            Found <strong className="text-slate-900">{pagination.total}</strong> results {query && <span>for "<strong className="text-slate-900">{query}</strong>"</span>}
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort-select-search" className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort-select-search"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none text-xs font-semibold bg-white border border-stone-200 rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:border-slate-900 cursor-pointer shadow-xs"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar */}
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

        {/* Results */}
        <div className="lg:col-span-3 space-y-8">
          <ProductGrid
            products={products}
            loading={loading}
            emptyTitle={`No results found for "${query}"`}
            emptyDescription="Try checking for spelling errors, using more general keywords like 'coat', 'silk', or clearing filters."
            onResetFilters={clearAllFilters}
            onQuickView={(p) => setQuickViewProduct(p)}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          />

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
                  className={`w-9 h-9 text-xs font-bold rounded-lg ${
                    page === i + 1 ? 'bg-slate-900 text-white' : 'border border-stone-200 text-slate-700 hover:bg-stone-50'
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

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default SearchPage;
