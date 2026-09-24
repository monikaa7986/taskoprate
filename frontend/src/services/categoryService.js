import api from './api';

export const categoryService = {
  getCategories: async (gender) => {
    return await api.get(`/categories${gender ? `?gender=${gender}` : ''}`);
  },

  getCategoryBySlug: async (slug) => {
    return await api.get(`/categories/${slug}`);
  },

  // Admin methods
  createCategory: async (categoryData) => {
    return await api.post('/categories', categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return await api.put(`/categories/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return await api.delete(`/categories/${id}`);
  }
};
