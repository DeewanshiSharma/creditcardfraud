// src/api/fraudApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://creditcardfraud-tyza.onrender.com',   // Keep your Render URL
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Automatically add JWT token
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

// Response Interceptor - Handle token expiration nicely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Fraud API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });

    // If token is expired or invalid → logout user
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optional: Redirect to login or show message
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export const fraudApi = {
  // Health check (public)
  healthCheck: () => api.get('/'),

  // Protected prediction
  predict: (featuresArray) =>
    api.post('/predict', {
      features: featuresArray
    }),

  // Optional: Login & Register functions (if you want to move them here later)
  login: (username, password) => 
    api.post('/login', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }),

  register: (userData) => 
    api.post('/register', userData),
};
