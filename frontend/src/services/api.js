import axios from 'axios';

// In dev, use relative path so Vite proxy handles CORS (proxy: '/api' -> 'http://localhost:8080').
// In production builds, VITE_API_BASE_URL must be set to the absolute backend URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000  // 20s — booking transactions include DB writes + async email dispatch
});

// Request Interceptor: Attach JWT Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('grandstay_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalize errors and handle auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize backend ErrorResponse DTO into a single readable message
    if (error.response) {
      const data = error.response.data;
      // Attach a normalized message for easy consumption in catch blocks
      error.userMessage =
        (typeof data === 'string' ? data : null) ||
        data?.message ||
        data?.error ||
        `Request failed with status ${error.response.status}`;

      if (error.response.status === 401) {
        const currentPath = window.location.pathname;
        const isMockSession = localStorage.getItem('grandstay_mock_session') === 'true';
        if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/admin/login') {
          if (isMockSession) {
            error.userMessage = 'Your offline session is not valid for live API calls. Please log out and sign in again.';
          } else {
            localStorage.removeItem('grandstay_jwt');
            localStorage.removeItem('grandstay_user');
            // Redirect to login so the user knows their session expired
            window.location.href = '/login';
          }
        }
      }
    } else if (error.request) {
      // Request was sent but no response received — network/CORS issue
      error.userMessage = 'Unable to reach the server. Please check your connection or try again.';
    } else {
      error.userMessage = error.message || 'An unexpected error occurred.';
    }

    return Promise.reject(error);
  }
);

export default api;

