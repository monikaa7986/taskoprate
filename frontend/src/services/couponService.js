import api from './api';

export const couponService = {
  validateCoupon: async (code, subtotal) => {
    return await api.post('/coupons/validate', { code, subtotal });
  },

  getAllCoupons: async () => {
    return await api.get('/coupons');
  },

  createCoupon: async (couponData) => {
    return await api.post('/coupons', couponData);
  },

  updateCoupon: async (id, couponData) => {
    return await api.put(`/coupons/${id}`, couponData);
  },

  deleteCoupon: async (id) => {
    return await api.delete(`/coupons/${id}`);
  }
};
