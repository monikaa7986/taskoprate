import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Edit2, Trash2, ExternalLink, Filter } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

const AdminProductsPage = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({
        search,
        gender: selectedGender,
        limit: 50
      });
      if (res.success && res.data) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedGender]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await productService.deleteProduct(id);
      if (res.success) {
        showToast(`Product "${name}" deleted.`, 'success');
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      showToast(err.message || 'Error deleting product.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Garment Catalog Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Create, update, and manage pricing, stock, and photography across all collections.
          </p>
        </div>

        <Link to="/admin/products/add">
          <Button size="sm" icon={PlusCircle}>
            Add New Garment
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="">All Departments</option>
            <option value="men">Men's Department</option>
            <option value="women">Women's Department</option>
            <option value="kids">Kids' Department</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-20"><Loader text="Querying catalog..." /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Garment</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-800">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-400">
                      No garments match the current criteria.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.primary_image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="w-10 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                          />
                          <div>
                            <Link
                              to={`/products/${p.slug || p.id}`}
                              target="_blank"
                              className="font-bold text-slate-900 hover:text-amber-800 flex items-center gap-1 font-serif text-sm"
                            >
                              <span>{p.name}</span>
                              <ExternalLink className="w-3 h-3 text-stone-400" />
                            </Link>
                            <p className="text-[11px] text-stone-400">{p.category_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 uppercase font-semibold text-[10px] tracking-wider text-stone-500">
                        {p.gender_category}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">{p.sku}</td>
                      <td className="py-3.5 px-4 font-bold">{formatCurrency(p.price)}</td>
                      <td className="py-3.5 px-4">
                        {p.discount_price ? (
                          <span className="text-emerald-700 font-bold">{formatCurrency(p.discount_price)}</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.stock < 15
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-slate-800">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="p-1.5 text-stone-600 hover:text-black hover:bg-stone-100 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletingId === p.id}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
