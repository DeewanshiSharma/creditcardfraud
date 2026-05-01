// src/api/fraudApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://creditcardfraud-tyza.onrender.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add JWT Token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Handle 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Fraud API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      alert("Your session has expired. Please login again.");
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const fraudApi = {
  // Health check
  healthCheck: () => api.get('/'),

  // Predict Fraud (Protected)
  predict: (featuresArray) =>
    api.post('/predict', { features: featuresArray }),

  // Login
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  // Register
  register: (userData) =>
    api.post('/register', userData),
};
