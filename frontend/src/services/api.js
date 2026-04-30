import axios from 'axios';

const api = axios.create({
  // Remove the slash from the very end
  baseURL: 'https://creditcardfraud-tyza.onrender.com', 
  timeout: 15000, // Increased to 15 seconds to allow for the Render "Cold Start"
});

export const fraudApi = {
  predict: (features) => api.post('/predict', { features }),
};
