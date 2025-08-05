import axios from 'axios';
import { API_BASE_URL } from '../utils/constants.js';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updatePassword: (passwordData) => api.put('/auth/password', passwordData),
};

// User API calls
export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  getLawyers: () => api.get('/users/lawyers'),
  getJudges: () => api.get('/users/judges'),
  deactivateUser: (id) => api.delete(`/users/${id}`),
};

// Case API calls
export const caseAPI = {
  createCase: (caseData) => api.post('/cases', caseData),
  getCases: (params) => api.get('/cases', { params }),
  getCaseById: (id) => api.get(`/cases/${id}`),
  updateCase: (id, caseData) => api.put(`/cases/${id}`, caseData),
  addCaseUpdate: (id, update) => api.post(`/cases/${id}/updates`, update),
  assignLawyer: (id, lawyerId) => api.put(`/cases/${id}/assign-lawyer`, { lawyerId }),
  assignJudge: (id, judgeId) => api.put(`/cases/${id}/assign-judge`, { judgeId }),
  getDashboardStats: () => api.get('/cases/dashboard-stats'),
};

export default api;
