import React from 'react';
import { RotateCcw, Check, Star } from 'lucide-react';

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COMMON_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Camel', hex: '#c19a6b' },
  { name: 'Navy', hex: '#1e293b' },
  { name: 'Charcoal', hex: '#4b5563' },
  { name: 'Emerald', hex: '#046307' },
  { name: 'Wine', hex: '#581845' },
  { name: 'Terracotta', hex: '#b33939' }
];

const FilterSidebar = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  priceRange = { min: '', max: '' },
  onChangePrice,
  selectedSize,
  onSelectSize,
  selectedColor,
  onSelectColor,
  inStockOnly,
  onToggleInStock,
  minRating,
  onSelectRating,
  onClearFilters
}) => {
  return (
    <div className="space-y-7 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <h3 className="font-serif text-lg font-bold text-slate-900 tracking-tight">
          Refine Search
        </h3>
        <button
          type="button"
          onClick={onClearFilters}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-black font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Categories
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => onSelectCategory('')}
              className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                !selectedCategory
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-black'
              }`}
            >
              <span>All Categories</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === cat.slug
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-black'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {cat.product_count !== undefined && (
                  <span className={`text-[10px] ${selectedCategory === cat.slug ? 'text-stone-300' : 'text-stone-400'}`}>
                    {cat.product_count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Price ($ USD)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => onChangePrice({ ...priceRange, min: e.target.value })}
            className="w-1/2 text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-slate-900"
          />
          <span className="text-stone-400 text-xs">—</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => onChangePrice({ ...priceRange, max: e.target.value })}
            className="w-1/2 text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Size
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {COMMON_SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => onSelectSize(selectedSize === sz ? '' : sz)}
              className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                selectedSize === sz
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-stone-200 text-slate-700 hover:border-slate-400 bg-white hover:shadow-xs'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Color Palette
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {COMMON_COLORS.map((col) => (
            <button
              key={col.name}
              type="button"
              onClick={() => onSelectColor(selectedColor === col.name ? '' : col.name)}
              title={col.name}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-120 active:scale-90 shadow-xs border cursor-pointer ${
                selectedColor === col.name
                  ? 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                  : 'border-stone-300'
              }`}
              style={{ backgroundColor: col.hex }}
            >
              {selectedColor === col.name && (
                <Check
                  className={`w-3.5 h-3.5 ${
                    col.hex === '#ffffff' ? 'text-black' : 'text-white'
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock & Ratings */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-800">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300 text-slate-900 focus:ring-slate-900"
          />
          <span>In Stock Items Only</span>
        </label>

        {/* Rating filter */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-700 mb-1.5">Customer Rating</p>
          <div className="space-y-1">
            {[4, 3].map((stars) => (
              <button
                key={stars}
                type="button"
                onClick={() => onSelectRating(minRating === stars ? '' : stars)}
                className={`flex items-center gap-1.5 text-xs py-1 px-2 rounded-md transition-colors w-full ${
                  minRating === stars ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex text-amber-400">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <span>& Up</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
