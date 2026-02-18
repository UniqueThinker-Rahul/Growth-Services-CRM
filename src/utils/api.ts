/// <reference types="vite/client" />
import axios from 'axios';

// Professional: Read from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add a response interceptor to handle auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If server says "Unauthorized", force logout
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;