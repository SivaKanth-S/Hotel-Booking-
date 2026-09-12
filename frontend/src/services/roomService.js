import api from './api';

export const roomService = {
  getRoomsByHotel: async (hotelId) => {
    const response = await api.get(`/hotels/${hotelId}/rooms`);
    return response.data;
  },

  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  checkAvailability: async (roomId, checkIn, checkOut) => {
    const response = await api.get(`/rooms/${roomId}/availability`, {
      params: { checkIn, checkOut }
    });
    return response.data;
  },

  createRoom: async (roomData) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },

  updateRoom: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  }
};
