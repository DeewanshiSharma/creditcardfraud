import axios from 'axios';

const api = axios.create({
  // Removed the trailing slash here
  baseURL: 'https://creditcardfraud-tyza.onrender.com', 
  timeout: 15000, // Increased timeout to 15s to help with Render's "Cold Start"
});

export const fraudApi = {
  predict: (features) => api.post('/predict', { features }),
};
