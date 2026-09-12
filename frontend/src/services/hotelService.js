import api from './api';
import { TN_HOTELS } from '../data/tnData';

/**
 * Apply local filters to the TN_HOTELS array, mirroring the backend query params.
 */
const applyLocalFilters = (hotels, params = {}) => {
  let result = [...hotels];

  if (params.city) {
    const q = params.city.toLowerCase();
    result = result.filter(
      (h) =>
        h.city?.toLowerCase().includes(q) ||
        h.name?.toLowerCase().includes(q)
    );
  }

  if (params.maxPrice) {
    result = result.filter(
      (h) => (h.minPrice || h.startingPrice || 5000) <= Number(params.maxPrice)
    );
  }

  if (params.minRating) {
    result = result.filter(
      (h) => (h.starRating || 0) >= Number(params.minRating)
    );
  }

  if (params.amenities) {
    const filterAmenities = params.amenities.split(',').map((a) => a.toLowerCase().trim());
    result = result.filter((h) => {
      const hAmenities = Array.isArray(h.amenities)
        ? h.amenities.map((a) => a.toLowerCase())
        : [];
      return filterAmenities.every((fa) =>
        hAmenities.some((ha) => ha.includes(fa))
      );
    });
  }

  return result;
};

export const hotelService = {
  getAllHotels: async (params = {}) => {
    try {
      const response = await api.get('/hotels', { params });
      return response.data;
    } catch {
      // Backend unavailable — serve local Tamil Nadu hotel data with client-side filtering
      return applyLocalFilters(TN_HOTELS, params);
    }
  },

  getHotelById: async (id) => {
    try {
      const response = await api.get(`/hotels/${id}`);
      return response.data;
    } catch {
      // Fallback: find hotel in local data
      const found = TN_HOTELS.find((h) => String(h.id) === String(id));
      if (!found) throw new Error('Hotel not found');
      return found;
    }
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
  },
};
