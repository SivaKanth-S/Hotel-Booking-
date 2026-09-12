import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data && response.data.token) {
      localStorage.setItem('grandstay_jwt', response.data.token);
      localStorage.setItem('grandstay_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('grandstay_jwt', response.data.token);
      localStorage.setItem('grandstay_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('grandstay_jwt');
    localStorage.removeItem('grandstay_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('grandstay_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('grandstay_jwt');
  }
};
