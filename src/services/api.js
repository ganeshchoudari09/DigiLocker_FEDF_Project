import axios from 'axios';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.digilocker.gov.in/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const user = storage.get('user');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const documentApi = {
  getAll: () => api.get('/documents'),
  upload: (data) => api.post('/documents', data),
  sync: () => api.post('/sync'),
  verify: (id) => api.post(`/documents/${id}/verify`),
  share: (id) => api.post(`/documents/${id}/share`),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export default api;
