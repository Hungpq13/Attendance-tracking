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
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

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
  createUser: async (userdata) => {
    debugger;
  try {
    const token = localStorage.getItem(STORAGE_TOKEN);
    if (!token) {
      throw new Error('Không có accessToken. Vui lòng đăng nhập lại.');
    }
    
    const response = await api.post('/user/create-auto', userdata);
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

export const payrollAPI = {
  // Calculate payroll for multiple employees
  calculatePayroll: async (employees, month, year) => {
    try {
      // Create query string from employees array
      const employeeIds = employees.map(emp => emp.id).join(',');
      const params = new URLSearchParams({
        month,
        year,
        ids: employeeIds
      });
      
      const response = await api.get(
        `/payroll/calculate?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Calculate payroll for single employee
  calculateSinglePayroll: async (employeeId, month, year) => {
    try {
      const params = new URLSearchParams({
        month,
        year
      });
      
      const response = await api.get(
        `/payroll/calculate/${employeeId}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get timesheet data for an employee
  getTimesheetData: async (employeeId, month, year) => {
    try {
      const params = new URLSearchParams({
        month,
        year
      });
      
      const response = await api.get(
        `/payroll/timesheet/user/${employeeId}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Save timesheet entry
  saveTimesheet: async (timesheetData) => {
    try {
      console.log('[saveTimesheet] Sending payload:', timesheetData);
      const response = await api.post('/payroll/timesheet', timesheetData);
      console.log('[saveTimesheet] Success response:', response.data);
      return response.data;
    } catch (error) {
      const errorDetail = {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        payload: timesheetData
      };
      console.error('[saveTimesheet] Error:', errorDetail);
      if (error.response?.data?.errors) {
        console.error('[saveTimesheet] Validation errors:', error.response.data.errors);
      }
      throw errorDetail;
    }
  },

  // Save salary component
  saveSalaryComponent: async (salaryData) => {
    try {
      console.log('[saveSalaryComponent] Sending payload:', salaryData);
      const response = await api.post('/payroll/salary-structure', salaryData);
      console.log('[saveSalaryComponent] Success response:', response.data);
      return response.data;
    } catch (error) {
      const errorDetail = {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        payload: salaryData
      };
      console.error('[saveSalaryComponent] Error:', errorDetail);
      if (error.response?.data?.errors) {
        console.error('[saveSalaryComponent] Validation errors:', error.response.data.errors);
      }
      throw errorDetail;
    }
  },
};

export default api;
