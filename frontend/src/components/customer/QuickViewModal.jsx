import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatCurrency, calculateDiscountPercent } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(
    product?.availableColors?.[0]?.name || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const isSaved = isInWishlist(product.id);
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.primary_image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80'];

  const sizes = product.availableSizes?.length > 0
    ? product.availableSizes
    : ['XS', 'S', 'M', 'L', 'XL'];

  const colors = product.availableColors?.length > 0
    ? product.availableColors
    : [{ name: 'Standard', hex: '#222222' }];

  const displayPrice = product.discount_price || product.price;
  const discountPercent = calculateDiscountPercent(product.price, product.discount_price);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Images Column */}
        <div className="space-y-3">
          <div className="aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden relative shadow-sm">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-amber-700 text-white text-xs font-bold px-2 py-1 rounded">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                    activeImageIndex === idx ? 'border-slate-900 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="flex flex-col space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-widest font-semibold mb-1">
              <span>{product.category_name || product.gender_category}</span>
              {product.rating > 0 && (
                <span className="flex items-center gap-1 text-stone-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-stone-400">({product.reviews_count || 0})</span>
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 leading-snug">
              {product.name}
            </h2>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-slate-900">
              {formatCurrency(displayPrice)}
            </span>
            {product.discount_price && (
              <span className="text-base text-stone-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
            {product.description}
          </p>

          {/* Color Selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-2">
              Color: <span className="font-normal text-stone-500">{selectedColor}</span>
            </p>
            <div className="flex gap-2">
              {colors.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  title={c.name}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    selectedColor === c.name ? 'ring-2 ring-slate-900 ring-offset-2 scale-110' : 'hover:scale-115 opacity-85 active:scale-95'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {selectedColor === c.name && (
                    <Check className={`w-3.5 h-3.5 ${c.hex === '#ffffff' || c.hex === '#fdfbf7' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-900 mb-2">
              <span>Select Size</span>
              <span className="text-stone-400 font-normal">Standard Fit</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                    selectedSize === sz
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-stone-200 text-slate-700 hover:border-slate-400 bg-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-500 hover:text-black hover:bg-stone-50 active:scale-90 transition-all duration-150 cursor-pointer"
                >
                  -
                </button>
                <span className="px-2 text-xs font-semibold text-slate-900 min-w-[24px] text-center select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-stone-500 hover:text-black hover:bg-stone-50 active:scale-90 transition-all duration-150 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                className="flex-1"
                icon={ShoppingBag}
              >
                Add To Cart • {formatCurrency(displayPrice * quantity)}
              </Button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90 ${
                  isSaved
                    ? 'border-red-500 bg-red-50 text-red-500 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:text-black hover:border-stone-400 bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* View Full Product Link */}
            <div className="pt-2 text-center">
              <Link
                to={`/products/${product.slug || product.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-amber-800 hover:translate-x-1 transition-all duration-200 uppercase tracking-wider"
              >
                <span>View Complete Product Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;
