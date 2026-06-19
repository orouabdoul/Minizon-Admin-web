import axios from 'axios';
import { apiConfig } from '../config/api.config';
import { tokenStore } from './token_store';

export const api = axios.create(apiConfig);

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      tokenStore.clear();
    }
    return Promise.reject(error);
  },
);
