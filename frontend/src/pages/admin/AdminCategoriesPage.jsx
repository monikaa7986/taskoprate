import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tags, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';

const AdminCategoriesPage = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gender_category: 'women',
    image_url: '',
    display_order: 1
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      if (res.success && res.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      gender_category: 'women',
      image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      display_order: categories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      gender_category: cat.gender_category,
      image_url: cat.image_url || '',
      display_order: cat.display_order || 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;

    try {
      const res = await categoryService.deleteCategory(cat.id);
      if (res.success) {
        showToast('Category deleted successfully.', 'success');
        fetchCategories();
      }
    } catch (err) {
      showToast(err.message || 'Error deleting category.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setSubmitting(true);
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        showToast('Category updated.', 'success');
      } else {
        await categoryService.createCategory(formData);
        showToast('New category created.', 'success');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      showToast(err.message || 'Error saving category.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Category Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize customer navigation and departmental classifications.
          </p>
        </div>

        <Button onClick={handleOpenAdd} size="sm" icon={Plus}>
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="py-20"><Loader text="Loading categories..." /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-slate-800">
                    Dept: {cat.gender_category}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    Order: #{cat.display_order}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt=""
                      className="w-14 h-14 object-cover rounded-xl bg-stone-100 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                      <Tags className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-serif text-base font-bold text-slate-900 leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 font-mono">slug: /{cat.slug}</p>
                  </div>
                </div>

                {cat.description && (
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {cat.product_count || 0} Garments Listed
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-stone-500 hover:text-black hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add / Edit Category */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Category Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Tailored Outerwear"
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Department
              </label>
              <select
                value={formData.gender_category}
                onChange={(e) => setFormData({ ...formData, gender_category: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kids">Kids</option>
                <option value="all">Unisex / All</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Header Cover Image URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of fabrics and silhouettes in this category..."
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategoriesPage;
