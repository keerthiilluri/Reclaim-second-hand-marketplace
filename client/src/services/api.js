import axios from 'axios';

// Base API URL: uses Vite proxy '/api' by default or environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('reclaim_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract error messages cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(customMessage));
  }
);

// Auth Endpoints
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateMe: async (data) => {
    const res = await api.put('/auth/me', data);
    return res.data;
  },
};

// Products Endpoints
export const productService = {
  getAll: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  create: async (payload, isFormData = false) => {
    const config = isFormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const res = await api.post('/products', payload, config);
    return res.data;
  },
  update: async (id, payload, isFormData = false) => {
    const config = isFormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const res = await api.put(`/products/${id}`, payload, config);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/products/${id}/status`, { status });
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
  getMyListings: async () => {
    const res = await api.get('/users/me/listings');
    return res.data;
  },
};

// Wishlist Endpoints
export const wishlistService = {
  get: async () => {
    const res = await api.get('/wishlist');
    return res.data;
  },
  add: async (productId) => {
    const res = await api.post(`/wishlist/${productId}`);
    return res.data;
  },
  remove: async (productId) => {
    const res = await api.delete(`/wishlist/${productId}`);
    return res.data;
  },
};

// Contact Endpoints
export const contactService = {
  sendInquiry: async (inquiryData) => {
    const res = await api.post('/contact', inquiryData);
    return res.data;
  },
  getMyInquiries: async () => {
    const res = await api.get('/contact/inquiries');
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/contact/inquiries/${id}`, { status });
    return res.data;
  },
};

export default api;
