/**
 * UserDataSource
 * Xử lý all API calls liên quan đến user - Layer Data
 */
import axios from 'axios';
import { API_BASE_URL, STORAGE_TOKEN, API_ENDPOINTS } from '../../config/constants';

// Tạo axios instance riêng cho user API
const userAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Thêm interceptor để tự động thêm Bearer token vào header
userAxios.interceptors.request.use(
  (config) => {
    // Lấy access token từ localStorage
    const token = localStorage.getItem(STORAGE_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export class UserDataSource {
  /**
   * Lấy thông tin hồ sơ người dùng
   * @param {string} id - ID người dùng
   * @returns {Promise<Object>} Thông tin hồ sơ
   */
  async getProfile(id) {
    try {
      console.log(`📥 Lấy hồ sơ người dùng ${id}...`);
      const response = await userAxios.get(`${API_ENDPOINTS.GET_PROFILE}/${id}`);
      console.log('✅ Lấy hồ sơ thành công');
      return response.data;
    } catch (error) {
      console.error('❌ Get profile API error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Cập nhật hồ sơ người dùng
   * @param {Object} profileData - Dữ liệu hồ sơ cần cập nhật
   * @returns {Promise<Object>}
   */
  async updateProfile(profileData) {
    try {
      console.log('📝 Cập nhật hồ sơ người dùng...');
      const response = await userAxios.put(API_ENDPOINTS.UPDATE_PROFILE, profileData);
      console.log('✅ Cập nhật hồ sơ thành công');
      return response.data;
    } catch (error) {
      console.error('❌ Update profile API error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Lấy danh sách tất cả người dùng
   * @returns {Promise<Array>} Danh sách người dùng
   */
  async getAllUsers() {
    try {
      console.log('📥 Lấy danh sách tất cả người dùng...');
      const response = await userAxios.get('/users');
      console.log('✅ Lấy danh sách người dùng thành công');
      return response.data;
    } catch (error) {
      console.error('❌ Get all users API error:', error);
      throw error.response?.data || error.message;
    }
  }
}
