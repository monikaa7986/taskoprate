import api from './api';

export const wishlistService = {
  getWishlist: async () => {
    return await api.get('/wishlist');
  },

  addToWishlist: async (productId) => {
    return await api.post(`/wishlist/${productId}`);
  },

  removeFromWishlist: async (productId) => {
    return await api.delete(`/wishlist/${productId}`);
  }
};
