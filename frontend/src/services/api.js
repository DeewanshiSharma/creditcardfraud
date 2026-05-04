// src/services/api.js
import axios from 'axios';
import { supabase } from '../supabase';

const api = axios.create({
  baseURL: 'https://creditcardfraud-tyza.onrender.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add Supabase JWT Token automatically
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
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
  async (error) => {
    console.error("❌ Fraud API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      await supabase.auth.signOut(); // sign out from Supabase
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const fraudApi = {
  // Health check
  healthCheck: () => api.get('/'),

  // Predict Fraud (Protected)
  predict: (featuresArray) =>
    api.post('/predict',{features: featuresArray}),

};
