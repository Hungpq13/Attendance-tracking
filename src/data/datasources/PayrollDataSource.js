/**
 * PayrollDataSource
 * Xử lý all API calls liên quan đến lương - Layer Data
 */
import axios from 'axios';
import { API_BASE_URL, STORAGE_TOKEN, API_ENDPOINTS } from '../../config/constants';

// Tạo axios instance riêng cho payroll API
const payrollAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Thêm interceptor để tự động thêm Bearer token vào header
payrollAxios.interceptors.request.use(
  (config) => {
    // Lấy access token từ localStorage
    const token = localStorage.getItem(STORAGE_TOKEN);
    console.log(`🔐 [PayrollAxios] Token from localStorage:`, token ? '✅ Present' : '❌ Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [PayrollAxios] Authorization header added');
    } else {
      console.warn('⚠️ [PayrollAxios] No token found in localStorage');
    }
    console.log('🌐 [PayrollAxios] Request URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export class PayrollDataSource {
  /**
   * Lấy danh sách các thành phần lương
   * @returns {Promise<Array>} Danh sách thành phần lương
   */
  async getSalaryComponents() {
    try {
      console.log('📥 Lấy danh sách thành phần lương...');
      const response = await payrollAxios.get(API_ENDPOINTS.GET_SALARY_COMPONENTS);
      console.log('✅ Lấy thành phần lương thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get salary components API error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Lấy cơ cấu lương của người dùng
   * @param {string} userId - ID người dùng
   * @returns {Promise<Array>} Thông tin cơ cấu lương của người dùng
   */
  async getUserSalaryStructure(userId) {
    try {
      const endpoint = `${API_ENDPOINTS.GET_USER_SALARY_STRUCTURE}?id=${userId}`;
      console.log(`📥 [DataSource] Fetching salary structure from: ${endpoint}`);
      const response = await payrollAxios.get(endpoint);
      console.log('✅ [DataSource] Salary structure API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [DataSource] Get user salary structure API error:', error);
      if (error.response) {
        console.error('❌ [DataSource] Response status:', error.response.status);
        console.error('❌ [DataSource] Response data:', error.response.data);
      }
      throw error.response?.data || error.message;
    }
  }
}
