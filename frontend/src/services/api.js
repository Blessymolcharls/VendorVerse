import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────
export const registerVendor = (data) => api.post('/auth/vendor/register', data);
export const loginVendor    = (data) => api.post('/auth/vendor/login', data);
export const registerBuyer  = (data) => api.post('/auth/buyer/register', data);
export const loginBuyer     = (data) => api.post('/auth/buyer/login', data);

// ── Products ──────────────────────────────────────────
export const getProducts       = (params) => api.get('/products', { params });
export const getProduct        = (id)     => api.get(`/products/${id}`);
export const getMyProducts     = ()       => api.get('/products/vendor/me');
export const getRecommendations = ()      => api.get('/products/recommendations');
export const createProduct     = (data)   => api.post('/products', data);
export const updateProduct     = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct     = (id)     => api.delete(`/products/${id}`);
export const searchProductsByImage = (formData) => api.post('/products/search-by-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// ── Vendors ───────────────────────────────────────────
export const getVendors        = ()       => api.get('/vendors');
export const getVendor         = (id)     => api.get(`/vendors/${id}`);
export const getMyVendorProfile = ()      => api.get('/vendors/me/profile');
export const updateVendorProfile = (data) => api.put('/vendors/me/profile', data);

// ── Ratings ───────────────────────────────────────────
export const getVendorRatings  = (vendorId) => api.get(`/ratings/vendor/${vendorId}`);
export const submitRating      = (data)     => api.post('/ratings', data);
export const deleteRating      = (id)       => api.delete(`/ratings/${id}`);

// ── Tags ──────────────────────────────────────────────
// ── Tags ──────────────────────────────────────────────
export const getTags    = ()     => api.get('/tags');
export const createTag  = (data) => api.post('/tags', data);

// ── Messages ──────────────────────────────────────────
export const sendMessage       = (data) => api.post('/messages', data);
export const getMessages       = (otherUserId) => api.get(`/messages/${otherUserId}`);
export const getConversations  = () => api.get('/messages/conversations/me');

export default api;
