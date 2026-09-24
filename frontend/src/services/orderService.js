import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },

  getMyOrders: async () => {
    return await api.get('/orders/my');
  },

  getOrderById: async (identifier) => {
    return await api.get(`/orders/${identifier}`);
  },

  // Admin methods
  getAllOrders: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    return await api.get(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  updateOrderStatus: async (id, statusData) => {
    return await api.put(`/orders/${id}/status`, statusData);
  }
};
