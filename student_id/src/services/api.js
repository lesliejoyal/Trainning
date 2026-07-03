import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ============================================
// AUTHENTICATION APIS
// ============================================
export const authAPI = {
  login: (data) => apiClient.post('/auth/login', data),
  verify: () => apiClient.post('/auth/verify'),
  getCurrentUser: () => apiClient.get('/auth/me'),
};

// ============================================
// STUDENT APIS
// ============================================
export const studentAPI = {
  getAll: (params) => apiClient.get('/students', { params }),
  getById: (id) => apiClient.get(`/students/${id}`),
  create: (data) => apiClient.post('/students', data),
  update: (id, data) => apiClient.put(`/students/${id}`, data),
  delete: (id) => apiClient.delete(`/students/${id}`),
  getStats: () => apiClient.get('/students/stats/count'),
};

// ============================================
// ATTENDANCE APIS
// ============================================
export const attendanceAPI = {
  getToday: () => apiClient.get('/attendance/today'),
  mark: (data) => apiClient.post('/attendance/mark', data),
  getStudentHistory: (studentId, params) => 
    apiClient.get(`/attendance/student/${studentId}`, { params }),
  getReports: (params) => apiClient.get('/attendance/reports', { params }),
  getDashboardStats: () => apiClient.get('/attendance/dashboard/stats'),
};

export default apiClient;
