import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/common/Button';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '2Y', '3-4Y', '5-6Y', '7-8Y'];

const DEFAULT_PRESET_COLORS = [
  { name: 'Onyx Black', hex: '#111111' },
  { name: 'Crisp White', hex: '#ffffff' },
  { name: 'Camel Tan', hex: '#c19a6b' },
  { name: 'Midnight Navy', hex: '#1e293b' },
  { name: 'Forest Olive', hex: '#2e7d32' },
  { name: 'Burgundy Wine', hex: '#581845' }
];

const AdminProductAddPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    gender_category: 'women',
    price: '',
    discount_price: '',
    stock: 25,
    sku: '',
    status: 'active',
    is_featured: false,
    is_trending: false,
    is_new_arrival: true,
    fabric_details: '100% Certified Organic & Traceable Natural Fiber',
    care_instructions: 'Specialist dry clean or delicate cold hand wash.',
    description: ''
  });

  const [selectedSizes, setSelectedSizes] = useState(['S', 'M', 'L']);
  const [colors, setColors] = useState([DEFAULT_PRESET_COLORS[0], DEFAULT_PRESET_COLORS[2]]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#222222');
  const [imageUrls, setImageUrls] = useState([
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    categoryService.getCategories()
      .then((res) => {
        if (res.success && res.data?.categories) {
          setCategories(res.data.categories);
          if (res.data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, category_id: res.data.categories[0].id }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleSize = (sz) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors((prev) => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const handleRemoveColor = (index) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImageUrls((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      showToast('Garment name and price are required.', 'error');
      return;
    }

    if (imageUrls.length === 0) {
      showToast('Please add at least one product image URL.', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        price: Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : null,
        stock: Number(formData.stock),
        category_id: formData.category_id ? Number(formData.category_id) : null,
        images: imageUrls,
        sizes: selectedSizes,
        colors: colors
      };

      const res = await productService.createProduct(payload);
      if (res.success) {
        showToast('New garment published to database!', 'success');
        navigate('/admin/products');
      }
    } catch (err) {
      showToast(err.message || 'Error creating product.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl text-stone-500 hover:text-black hover:bg-white border border-stone-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Add New Garment
            </h2>
            <p className="text-xs text-stone-500">
              Populate metadata, photography, inventory stock, and size variants.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          isLoading={submitting}
          icon={Save}
        >
          Publish Garment
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-3">
            Garment Identification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Garment Name *
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Sculpted Double-Breasted Cashmere Trench"
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Department *
              </label>
              <select
                name="gender_category"
                value={formData.gender_category}
                onChange={handleInputChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="women">Women's Collection</option>
                <option value="men">Men's Collection</option>
                <option value="kids">Kids' Collection</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.gender_category})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Description & Silhouette Narrative
              </label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe drape, cut, lining, buttons, and craftsmanship..."
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-3">
            Valuation & Inventory Stock
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Retail Price ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="240.00"
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Privilege Discount Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleInputChange}
                placeholder="Optional"
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 text-emerald-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Available Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="50"
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Custom SKU (Optional)
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="ATL-W-NEW-01"
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Sizes and Colors */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-3">
            Variants (Sizes & Color Palette)
          </h3>

          {/* Sizes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-2">
              Select Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    selectedSizes.includes(sz)
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-stone-200 text-slate-700 hover:border-slate-400 bg-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="pt-2 border-t border-stone-100 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800">
              Color Palette Swatches
            </label>
            <div className="flex flex-wrap gap-3">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-stone-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="font-medium text-slate-900">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(i)}
                    className="text-stone-400 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Color row */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="text"
                placeholder="Color Name (e.g. Sage Olive)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="text-xs px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-10 h-8 p-0 border border-stone-200 rounded-lg cursor-pointer bg-white"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-black"
              >
                Add Swatch
              </button>
            </div>
          </div>
        </div>

        {/* Photography URLs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-3">
            Garment Photography
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-white">
                    Primary Cover
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste Image URL (Unsplash or CDN link)..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddImage}
              icon={Plus}
            >
              Add URL
            </Button>
          </div>
        </div>

        {/* Fabric & Toggles */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-stone-100 pb-3">
            Textile Standards & Display Badges
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Fabric Details
              </label>
              <input
                type="text"
                name="fabric_details"
                value={formData.fabric_details}
                onChange={handleInputChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Care Instructions
              </label>
              <input
                type="text"
                name="care_instructions"
                value={formData.care_instructions}
                onChange={handleInputChange}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 border-t border-stone-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-slate-900"
              />
              <span className="font-semibold text-slate-800">Featured Showcase</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_trending"
                checked={formData.is_trending}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-slate-900"
              />
              <span className="font-semibold text-slate-800">Trending Now</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_new_arrival"
                checked={formData.is_new_arrival}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-slate-900"
              />
              <span className="font-semibold text-slate-800">New Arrival</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/admin/products">
            <Button variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit" size="lg" isLoading={submitting} icon={Save}>
            Save and Publish Garment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductAddPage;
