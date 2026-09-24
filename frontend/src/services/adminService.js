import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    return await api.get('/admin/dashboard');
  },

  getCustomers: async (search) => {
    return await api.get(`/admin/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  toggleCustomerStatus: async (id) => {
    return await api.put(`/admin/customers/${id}/status`);
  },

  getInventory: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/admin/inventory${query ? `?${query}` : ''}`);
  },

  updateStock: async (id, stock) => {
    return await api.put(`/admin/inventory/${id}/stock`, { stock });
  },

  getSettings: async () => {
    return await api.get('/admin/settings');
  },

  updateSettings: async (settings) => {
    return await api.put('/admin/settings', settings);
  }
};
