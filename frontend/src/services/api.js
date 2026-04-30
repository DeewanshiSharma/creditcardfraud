// src/api/fraudApi.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://creditcardfraud-tyza.onrender.com',
  timeout: 30000,                    // 30 seconds for Render cold start
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global error interceptor for better debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Fraud API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const fraudApi = {
  // Health check
  healthCheck: () => api.get('/'),

  // Main prediction function
  predict: (featuresArray) => 
    api.post('/predict', { 
      features: featuresArray 
    }),
};
