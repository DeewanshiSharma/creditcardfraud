import axios from 'axios';

const api = axios.create({
  // Ensure there is NO '/' at the end
  baseURL: '[https://creditcardfraud-tyza.onrender.com](https://creditcardfraud-tyza.onrender.com)', 
  timeout: 20000, // 20 seconds to give Render time to wake up
});

export const fraudApi = {
  predict: (features) => api.post('/predict', { features }),
};
