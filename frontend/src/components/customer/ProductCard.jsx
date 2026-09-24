import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { formatCurrency, calculateDiscountPercent } from '../../utils/formatters';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, onQuickView }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const isSaved = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.price, product.discount_price);
  const displayPrice = product.discount_price || product.price;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'M', 'Standard', 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const primaryImage = product.primary_image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = (product.images && product.images[1]) || primaryImage;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200/70 hover:border-stone-300 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer">
        <Link to={`/products/${product.slug || product.id}`}>
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.is_new_arrival === 1 && (
            <span className="bg-slate-900 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              New
            </span>
          )}
          {product.is_trending === 1 && (
            <span className="bg-stone-800 text-stone-200 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 cursor-pointer ${
            isSaved
              ? 'bg-red-500 text-white shadow-md hover:scale-110 active:scale-90'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-black hover:scale-110 active:scale-90 shadow-sm'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Actions */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex-1 bg-slate-900 hover:bg-black text-white text-xs font-semibold py-2.5 px-3 rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="p-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-lg shadow-md hover:shadow-lg hover:text-black transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Gender */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
            <span>{product.category_name || product.gender_category}</span>
            {product.rating > 0 && (
              <span className="flex items-center gap-0.5 text-stone-600">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            to={`/products/${product.slug || product.id}`}
            className="block text-sm font-medium text-slate-900 hover:text-amber-800 transition-colors line-clamp-1 mb-2 font-serif"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Swatches */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-slate-900">
              {formatCurrency(displayPrice)}
            </span>
            {product.discount_price && (
              <span className="text-xs text-stone-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Color Preview Dots */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="flex items-center -space-x-1">
              {product.availableColors.slice(0, 3).map((col, idx) => (
                <div
                  key={idx}
                  title={col.name}
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-xs transition-transform duration-200 hover:scale-125 hover:z-10 cursor-pointer"
                  style={{ backgroundColor: col.hex }}
                />
              ))}
              {product.availableColors.length > 3 && (
                <span className="text-[10px] text-stone-400 pl-1.5 font-medium">
                  +{product.availableColors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
