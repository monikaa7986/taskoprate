import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    return await api.get(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductByIdOrSlug: async (identifier) => {
    return await api.get(`/products/${identifier}`);
  },

  getFeatured: async () => {
    return await api.get('/products/featured');
  },

  getTrending: async () => {
    return await api.get('/products/trending');
  },

  getNewArrivals: async () => {
    return await api.get('/products/new-arrivals');
  },

  getRelated: async (productId) => {
    return await api.get(`/products/${productId}/related`);
  },

  // Admin methods
  createProduct: async (productData) => {
    return await api.post('/products', productData);
  },

  updateProduct: async (id, productData) => {
    return await api.put(`/products/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await api.delete(`/products/${id}`);
  }
};
