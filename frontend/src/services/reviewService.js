import api from './api';

export const reviewService = {
  getProductReviews: async (productId) => {
    return await api.get(`/reviews/product/${productId}`);
  },

  addReview: async (productId, reviewData) => {
    return await api.post(`/reviews/product/${productId}`, reviewData);
  },

  // Admin methods
  getAllReviews: async () => {
    return await api.get('/reviews');
  },

  toggleApproveReview: async (id) => {
    return await api.put(`/reviews/${id}/approve`);
  },

  deleteReview: async (id) => {
    return await api.delete(`/reviews/${id}`);
  }
};
