import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const userAPI = {
  search: (q) => api.get(`/users/search?q=${encodeURIComponent(q)}`),
  getOnline: () => api.get('/users/online'),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) =>
    api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ─── Conversations ────────────────────────────────────────────────────────────
export const conversationAPI = {
  getAll: () => api.get('/conversations'),
  createOrGet: (recipientId) => api.post('/conversations', { recipientId }),
  getById: (id) => api.get(`/conversations/${id}`),
};

// ─── Messages ─────────────────────────────────────────────────────────────────
export const messageAPI = {
  getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
  sendMessage: (conversationId, content) =>
    api.post(`/messages/${conversationId}`, { content }),
};

export default api;
