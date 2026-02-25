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
      const response = await userAxios.get(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Lấy thông tin hồ sơ cá nhân hiện tại (/api/userProfile/me)
   * @returns {Promise<Object>} Thông tin hồ sơ cá nhân
   */
  async getProfileMe() {
    try {
      const response = await userAxios.get(API_ENDPOINTS.UPDATE_PROFILE_ME);
      return response.data;
    } catch (error) {
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
      const response = await userAxios.put(API_ENDPOINTS.UPDATE_PROFILE_ME, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Cập nhật hồ sơ người dùng hiện tại (/api/userProfile/me)
   * @param {Object} profileData - Dữ liệu hồ sơ cần cập nhật
   * @returns {Promise<Object>}
   */
  async updateProfileMe(profileData) {
    try {
      const token = localStorage.getItem(STORAGE_TOKEN);
      
      const response = await userAxios.put(API_ENDPOINTS.UPDATE_PROFILE_ME, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Cập nhật thông tin người dùng (/api/user/{id})
   * @param {string} userId - ID người dùng
   * @param {Object} userData - Dữ liệu người dùng cần cập nhật
   * @returns {Promise<Object>}
   */
  async updateUser(userId, userData) {
    try {
      const response = await userAxios.put(`/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Lấy danh sách tất cả người dùng
   * @returns {Promise<Array>} Danh sách người dùng
   */
  async getAllUsers() {
    try {
      const response = await userAxios.get('/users'); 
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}
