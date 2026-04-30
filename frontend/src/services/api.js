import axios from 'axios';

const api = axios.create({
  baseURL: 'https://creditcardfraud-tyza.onrender.com/',
  timeout: 10000,
});

export const fraudApi = {
  predict: (features) => api.post('/predict', { features }),
};
