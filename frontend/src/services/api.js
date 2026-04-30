import axios from 'axios';

const api = axios.create({
  baseURL: 'https://creditcardfraud-tyza.onrender.com',
  timeout: 20000,           // Increased to 20 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add response interceptor for better error messages
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const fraudApi = {
  healthCheck: () => api.get('/'),
  predict: (features) => api.post('/predict', features),   // features as direct body
};
