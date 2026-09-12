import api from './api';
import { TN_HOTELS } from '../data/tnData';

export const roomService = {
  getRoomsByHotel: async (hotelId) => {
    try {
      const response = await api.get(`/hotels/${hotelId}/rooms`);
      return response.data;
    } catch {
      // Fallback: return rooms from local TN_HOTELS data
      const hotel = TN_HOTELS.find((h) => String(h.id) === String(hotelId));
      if (hotel && hotel.rooms) return hotel.rooms;
      return [];
    }
  },

  getRoomById: async (id) => {
    try {
      const response = await api.get(`/rooms/${id}`);
      return response.data;
    } catch {
      // Search across all local hotels for the room
      for (const hotel of TN_HOTELS) {
        const room = (hotel.rooms || []).find((r) => String(r.id) === String(id));
        if (room) return room;
      }
      throw new Error('Room not found');
    }
  },

  checkAvailability: async (roomId, checkIn, checkOut) => {
    try {
      const response = await api.get(`/rooms/${roomId}/availability`, {
        params: { checkIn, checkOut },
      });
      return response.data;
    } catch {
      // Optimistically indicate available when backend is down
      return { available: true, roomId, checkIn, checkOut };
    }
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
  },
};
