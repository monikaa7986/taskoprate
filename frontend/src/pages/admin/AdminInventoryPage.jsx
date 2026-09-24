import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Check, Save, Boxes } from 'lucide-react';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

const AdminInventoryPage = () => {
  const { showToast } = useToast();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [stockInputs, setStockInputs] = useState({});
  const [savingId, setSavingId] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await adminService.getInventory({
        search,
        lowStockOnly: lowStockOnly ? 'true' : ''
      });
      if (res.success && res.data?.inventory) {
        setInventory(res.data.inventory);
        const map = {};
        res.data.inventory.forEach((item) => {
          map[item.id] = item.stock;
        });
        setStockInputs(map);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [lowStockOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  const handleStockChange = (id, val) => {
    setStockInputs((prev) => ({ ...prev, [id]: val }));
  };

  const handleSaveStock = async (id) => {
    const val = stockInputs[id];
    if (val === undefined || isNaN(val) || Number(val) < 0) {
      showToast('Please provide a valid non-negative stock count.', 'warning');
      return;
    }

    try {
      setSavingId(id);
      const res = await adminService.updateStock(id, Number(val));
      if (res.success) {
        showToast('Inventory level synchronized.', 'success');
        setInventory((prev) =>
          prev.map((item) => (item.id === id ? { ...item, stock: Number(val) } : item))
        );
      }
    } catch (err) {
      showToast(err.message || 'Error updating stock.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Stock & Inventory Control
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor SKU levels, replenish low stocks, and adjust warehouse counts inline.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by SKU, product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-slate-900"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </form>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
          />
          <span className="flex items-center gap-1.5 text-red-700">
            <AlertTriangle className="w-3.5 h-3.5" />
            Show Low Stock Items Only (&lt; 15 units)
          </span>
        </label>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="py-20"><Loader text="Reconciling warehouse inventory counts..." /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Garment</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Retail Price</th>
                  <th className="py-3.5 px-4">Current Stock Status</th>
                  <th className="py-3.5 px-4">Quick Adjust Count</th>
                  <th className="py-3.5 px-4 text-right">Commit Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-800">
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400">
                      No inventory records match the search filter.
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => {
                    const isLow = item.stock < 15;
                    const isChanged = stockInputs[item.id] !== undefined && Number(stockInputs[item.id]) !== item.stock;

                    return (
                      <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.primary_image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=200&q=80'}
                              alt=""
                              className="w-10 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                            />
                            <div>
                              <p className="font-serif font-bold text-slate-900 text-sm">{item.name}</p>
                              <p className="text-[10px] text-stone-400 uppercase tracking-wider">
                                Dept: {item.gender_category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">{item.sku}</td>
                        <td className="py-3.5 px-4 text-stone-600">{item.category_name}</td>
                        <td className="py-3.5 px-4 font-bold">{formatCurrency(item.price)}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isLow
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {isLow ? `Low Alert: ${item.stock} left` : `Optimal: ${item.stock} units`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={stockInputs[item.id] ?? item.stock}
                              onChange={(e) => handleStockChange(item.id, e.target.value)}
                              className={`w-20 text-xs px-2.5 py-1.5 border rounded-lg focus:outline-none font-bold text-center ${
                                isChanged
                                  ? 'border-amber-500 bg-amber-50 text-amber-900'
                                  : 'border-stone-200 bg-stone-50 text-slate-900'
                              }`}
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleSaveStock(item.id)}
                            disabled={!isChanged || savingId === item.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all ${
                              isChanged
                                ? 'bg-slate-900 text-white hover:bg-black shadow-xs'
                                : 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400'
                            }`}
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{savingId === item.id ? 'Syncing...' : 'Update'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventoryPage;
