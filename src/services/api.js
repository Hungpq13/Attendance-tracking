import axios from 'axios';
import { getUserFromToken } from '../config/TokenHelper';
import { API_BASE_URL, STORAGE_TOKEN } from '../config/constants';

// Helper function to get cookie value
const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Allow sending cookies with requests
});

// Request interceptor to add auth token and refresh token
api.interceptors.request.use(
  (config) => {
    // Add Bearer token from localStorage
    const token = localStorage.getItem(STORAGE_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add Refresh token from cookies
      // const refreshToken = getCookie(COOKIE_REFRESH_TOKEN);
      // if (refreshToken) {
      //   config.headers['X-Refresh-Token'] = refreshToken;
      // }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User API endpoints

export const userAPI = {
 
  // Get user profile by ID with Bearer token in Authorization header
  getProfile: async (id) => { 
    try {
      const response = await api.get(`/userProfile/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export const attendanceAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/attendance');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  create: async (attendanceData) => {
    try {
      const response = await api.post('/attendance', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  update: async (id, attendanceData) => {
    try {
      const response = await api.put(`/attendance/${id}`, attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getStatistics: async () => {
    try {
      const response = await api.get('/attendance/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
