import api from './api';

export const promotionService = {
  validatePromo: async (code) => {
    const response = await api.get('/promotions/validate', {
      params: { code }
    });
    return response.data;
  },

  getAllPromotions: async () => {
    const response = await api.get('/promotions');
    return response.data;
  },

  createPromotion: async (promoData) => {
    const response = await api.post('/promotions', promoData);
    return response.data;
  }
};
