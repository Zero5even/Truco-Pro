import axios from 'axios';
import backendURL from '../src/config';

const api = axios.create({
  baseURL: backendURL,
});

// 👉 interceptor de request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    // ⚠️ solo lectura técnica, NO lógica de auth

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 👉 interceptor de response (opcional pero recomendado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token inválido / expirado
      localStorage.removeItem('token');
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

export default api;
