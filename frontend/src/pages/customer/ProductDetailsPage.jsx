import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronRight,
  Sparkles,
  Share2
} from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import ProductGrid from '../../components/customer/ProductGrid';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, calculateDiscountPercent, formatDate } from '../../utils/formatters';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interaction State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('fabric'); // 'fabric' | 'shipping' | 'care'

  // Review Form Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const res = await productService.getProductByIdOrSlug(id);
        if (res.success && res.data?.product) {
          const p = res.data.product;
          setProduct(p);
          setSelectedImageIndex(0);
          setSelectedSize(p.availableSizes?.[0] || 'M');
          setSelectedColor(p.availableColors?.[0]?.name || 'Standard');

          // Fetch related
          try {
            const relRes = await productService.getRelated(p.id);
            if (relRes.success) setRelatedProducts(relRes.data.products);
          } catch (e) {
            console.error('Failed to load related products:', e);
          }
        }
      } catch (err) {
        setError(err.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="py-24"><Loader text="Inspecting garment atelier..." /></div>;
  if (error || !product) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4">
        <ErrorState
          title="Garment Not Found"
          message={error || 'The requested piece could not be located in our current collections.'}
          onRetry={() => navigate('/')}
        />
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.primary_image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80'];

  const sizes = product.availableSizes?.length > 0 ? product.availableSizes : ['XS', 'S', 'M', 'L', 'XL'];
  const colors = product.availableColors?.length > 0 ? product.availableColors : [{ name: 'Standard', hex: '#222222' }];
  const displayPrice = product.discount_price || product.price;
  const discountPercent = calculateDiscountPercent(product.price, product.discount_price);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard.', 'success');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please provide your review feedback.', 'warning');
      return;
    }

    try {
      setReviewSubmitting(true);
      const res = await reviewService.addReview(product.id, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        user_name: user?.name || 'Verified Patron'
      });

      if (res.success && res.data?.review) {
        showToast('Review submitted successfully!', 'success');
        setProduct((prev) => ({
          ...prev,
          reviews: [res.data.review, ...(prev.reviews || [])],
          reviews_count: (prev.reviews_count || 0) + 1
        }));
        setIsReviewModalOpen(false);
        setReviewComment('');
        setReviewTitle('');
      }
    } catch (err) {
      showToast(err.message || 'Error submitting review.', 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to={`/${product.gender_category}`} className="capitalize hover:text-black transition-colors">
          {product.gender_category}
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        {product.category_name && (
          <>
            <span className="hover:text-black cursor-default">{product.category_name}</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </>
        )}
        <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery: 7 Cols */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Vertical Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[640px] pr-1 shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-slate-900 ring-2 ring-slate-900/10'
                      : 'border-stone-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-center" />
                </button>
              ))}
            </div>
          )}

          {/* Main Featured Image */}
          <div className="flex-1 aspect-[3/4] bg-stone-100 rounded-3xl overflow-hidden relative shadow-sm border border-stone-200/60">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-amber-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                -{discountPercent}% Atelier Privilege
              </span>
            )}
            <button
              type="button"
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md transition-transform active:scale-95"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Details & Actions: 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header */}
          <div className="space-y-2 border-b border-stone-100 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-amber-800">
                {product.category_name || product.gender_category}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating and Reviews Counter */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(product.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-900">
                {(product.rating || 5).toFixed(1)}
              </span>
              <span className="text-xs text-stone-400">•</span>
              <a href="#reviews" className="text-xs text-stone-500 hover:text-black underline font-medium">
                {product.reviews_count || 0} Client Endorsements
              </a>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-3xl font-bold text-slate-900">
              {formatCurrency(displayPrice)}
            </span>
            {product.discount_price && (
              <>
                <span className="text-lg text-stone-400 line-through">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Save {formatCurrency(product.price - product.discount_price)}
                </span>
              </>
            )}
          </div>

          {/* Short Narrative */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-900">
              <span>Color Selection</span>
              <span className="font-normal text-stone-500">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-3">
              {colors.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  title={c.name}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    selectedColor === c.name
                      ? 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                      : 'hover:scale-115 opacity-85 active:scale-95'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {selectedColor === c.name && (
                    <Check className={`w-4 h-4 ${c.hex === '#ffffff' || c.hex === '#fdfbf7' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-900">
              <span>Size Dimension</span>
              <span className="text-stone-500 font-normal underline cursor-pointer hover:text-black transition-colors">Size Guide</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                    selectedSize === sz
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-stone-200 text-slate-800 hover:border-stone-400 bg-white hover:shadow-xs'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-stone-600 hover:text-black hover:bg-stone-50 active:scale-90 font-semibold text-sm transition-all duration-150 cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-900 min-w-[32px] text-center select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-stone-600 hover:text-black hover:bg-stone-50 active:scale-90 font-semibold text-sm transition-all duration-150 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1"
                icon={ShoppingBag}
              >
                Add To Bag • {formatCurrency(displayPrice * quantity)}
              </Button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90 ${
                  isSaved
                    ? 'border-red-500 bg-red-50 text-red-500 shadow-xs'
                    : 'border-stone-200 text-slate-700 hover:text-black hover:border-slate-400 bg-white hover:shadow-xs'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Buy Now CTA */}
            <Button
              onClick={handleBuyNow}
              variant="secondary"
              size="lg"
              className="w-full bg-stone-100 hover:bg-stone-200 text-slate-900 font-semibold"
            >
              Instant Express Checkout
            </Button>
          </div>

          {/* Assurance Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Free express delivery over $150</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
              <span>30-Day complimentary returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Guaranteed authentic craftsmanship</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Zero microplastics certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Information */}
      <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs">
        <div className="flex border-b border-stone-200 space-x-8 text-xs font-bold uppercase tracking-wider mb-6">
          <button
            onClick={() => setActiveTab('fabric')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'fabric'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-stone-400 hover:text-black'
            }`}
          >
            Fabric & Composition
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'care'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-stone-400 hover:text-black'
            }`}
          >
            Care Instructions
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'shipping'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-stone-400 hover:text-black'
            }`}
          >
            Delivery & Returns
          </button>
        </div>

        <div className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
          {activeTab === 'fabric' && (
            <div className="space-y-3 animate-fade-in">
              <p>
                <strong>Textile Sourcing: </strong>
                {product.fabric_details || '100% certified organic and traceable natural fibers produced in accordance with environmental standards.'}
              </p>
              <p>
                Constructed with single-needle tailoring, genuine horn or mother-of-pearl closures, and reinforced stress points to maintain structural silhouette across years of wear.
              </p>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-3 animate-fade-in">
              <p>
                <strong>Garment Care: </strong>
                {product.care_instructions || 'Specialist dry clean recommended, or delicate cold hand wash with natural wool/silk detergent. Dry flat away from direct heat.'}
              </p>
              <p>
                To preserve fiber elasticity, store on contoured cedar hangers and steam lightly rather than pressing directly.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3 animate-fade-in">
              <p>
                Complimentary global priority dispatch on all orders exceeding $150. Orders placed before 2:00 PM EST ship same day with DHL Express / FedEx Carbon Neutral.
              </p>
              <p>
                Should the fit require alteration or exchange, return the unworn garment within 30 days using our prepaid postage portal for a 100% refund.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews" className="space-y-8 bg-stone-50/60 p-8 sm:p-12 rounded-3xl border border-stone-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              Patron Reviews ({product.reviews?.length || 0})
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Feedback from verified purchasers who own this piece.
            </p>
          </div>

          <Button
            onClick={() => setIsReviewModalOpen(true)}
            variant="outline"
            size="sm"
          >
            Write a Review
          </Button>
        </div>

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-stone-200/70 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400' : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {formatDate(rev.created_at)}
                  </span>
                </div>

                {rev.title && (
                  <h4 className="font-serif text-sm font-bold text-slate-900">
                    {rev.title}
                  </h4>
                )}

                <p className="text-xs text-stone-600 leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium text-slate-900">
                    {rev.reviewer_name || rev.user_name || 'Verified Patron'}
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    Verified Order
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xs text-stone-500 mb-3">No reviews submitted yet for this garment.</p>
            <Button onClick={() => setIsReviewModalOpen(true)} size="sm">
              Be the first to review
            </Button>
          </div>
        )}
      </section>

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full space-y-5">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Review: {product.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="text-stone-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">
                  Overall Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'fill-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Masterful cut and sumptuous fabric"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">
                  Your Observations *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details on fit, fabric weight, drape, and versatility..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={reviewSubmitting}>
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-8 border-t border-stone-200">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold mb-1">
                Complementary Ensemble
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                You May Also Admire
              </h2>
            </div>
            <Link
              to={`/${product.gender_category}`}
              className="text-xs font-semibold text-slate-900 hover:text-amber-800 underline uppercase tracking-wider"
            >
              View Full Category
            </Link>
          </div>

          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;
