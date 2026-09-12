import api from './api';

export const hotelService = {
  getAllHotels: async (params = {}) => {
    const response = await api.get('/hotels', { params });
    return response.data;
  },

  getHotelById: async (id) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },

  createHotel: async (hotelData) => {
    const response = await api.post('/hotels', hotelData);
    return response.data;
  },

  updateHotel: async (id, hotelData) => {
    const response = await api.put(`/hotels/${id}`, hotelData);
    return response.data;
  },

  deleteHotel: async (id) => {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  }
};
