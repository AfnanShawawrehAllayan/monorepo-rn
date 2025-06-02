import axios from 'axios';

import { ENV } from '../config/env';
import { storage } from '../utils/storage';

const BASE_URL = ENV.API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = storage.getItem<string>('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Handle token expiration
      storage.removeItem('token');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
