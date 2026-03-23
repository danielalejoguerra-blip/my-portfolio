// ============================================
// API Client - Cliente HTTP con interceptors
// ============================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// Crear instancia de axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para enviar cookies
});

// Interceptor de request - Agregar CSRF token + lang
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener CSRF token de la cookie
    const csrfToken = Cookies.get('csrf_token');
    
    // Agregar CSRF token al header para requests que lo requieran
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Agregar lang param basado en el locale actual de la URL
    if (typeof window !== 'undefined' && config.method?.toLowerCase() === 'get') {
      const pathLocale = window.location.pathname.split('/')[1];
      if (pathLocale && ['es', 'en'].includes(pathLocale)) {
        config.params = { ...config.params, lang: pathLocale };
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Bandera para evitar múltiples refresh simultáneos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Interceptor de response - Manejar refresh automático de token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Si es un 401 y no es un retry, intentar refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // No intentar refresh si ya estamos en login, logout o refresh
      const url = originalRequest.url || '';
      if (url.includes('/auth/login') || url.includes('/auth/logout') || url.includes('/auth/refresh')) {
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        // Si ya estamos refrescando, encolar la petición
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Intentar refresh del token
        await api.post('/auth/refresh');
        processQueue(null);
        
        // Reintentar la petición original
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        
        // Redirigir a login si el refresh falla
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
