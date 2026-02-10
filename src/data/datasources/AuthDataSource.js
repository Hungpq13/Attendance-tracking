/**
 * AuthDataSource
 * Xử lý all API calls liên quan đến authentication - Layer Data
 */
import axios from 'axios';
import { API_BASE_URL, STORAGE_TOKEN, API_ENDPOINTS } from '../../config/constants';

/**
 * 🔍 Debug: In tất cả cookies hiện có
 */
const logAllCookies = () => {
  console.log('📦 Tất cả cookies hiện có:');
  const cookies = document.cookie.split(';').map(c => c.trim());
  cookies.forEach(cookie => {
    if (cookie) {
      const [name] = cookie.split('=');
      console.log(`  - ${name}`);
    }
  });
};

// Tạo axios instance riêng cho auth
const authAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Cho phép gửi cookies cùng với request
});

// 🔍 Request interceptor với logging chi tiết
authAxios.interceptors.request.use(
  (config) => {
    // Lấy access token từ localStorage
    const token = localStorage.getItem(STORAGE_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 🔍 Debug logging
    console.log(`📤 Request: ${config.method.toUpperCase()} ${config.url}`);
    console.log('  Headers:', {
      'Authorization': config.headers.Authorization ? '✅ Có' : '❌ Không',
      'withCredentials': 'true ✅'
    });
    logAllCookies();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔍 Response interceptor với logging chi tiết
authAxios.interceptors.response.use(
  (response) => {
    console.log(`📥 Response: ${response.status} ${response.statusText}`);
    if (response.headers['set-cookie']) {
      console.log('🍪 Set-Cookie headers:', response.headers['set-cookie']);
    }
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    throw error;
  }
);

export class AuthDataSource {
  /**
   * Đăng nhập người dùng
   * @param {string} username - Tên đăng nhập
   * @param {string} password - Mật khẩu
   * @returns {Promise<{accessToken, message}>}
   */
  async login(username, password) {
    try {
      console.log('🔐 Gửi request đăng nhập...');
      const response = await authAxios.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      console.log('✅ Đăng nhập thành công');
      return response.data;
    } catch (error) {
      console.error('❌ Login API error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Đăng xuất người dùng
   * 💡 Browser sẽ tự động gửi refreshToken từ HTTP-only Cookie nhờ withCredentials: true
   * Không cần truyền refreshToken trong body
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      console.log('🔓 Gửi request đăng xuất...');
      console.log('💾 Browser sẽ tự động gửi refreshToken từ HTTP-only Cookie');
      // Gửi request rỗng, withCredentials sẽ tự động kèm cookies
      const response = await authAxios.post(API_ENDPOINTS.LOGOUT);
      console.log('✅ Đăng xuất thành công');
      return response.data;
    } catch (error) {
      console.error('❌ Logout API error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Thay đổi mật khẩu
   * @param {string} oldPassword - Mật khẩu cũ
   * @param {string} newPassword - Mật khẩu mới
   * @param {string} confirmPassword - Xác nhận mật khẩu
   * @returns {Promise<void>}
   */
  async changePassword(oldPassword, newPassword, confirmPassword) {
    try {
      console.log('🔒 Gửi request thay đổi mật khẩu...');
      const response = await authAxios.post(API_ENDPOINTS.CHANGE_PASSWORD, {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      console.log('✅ Thay đổi mật khẩu thành công');
      return response.data;
    } catch (error) {
      console.error('❌ Change password API error:', error);
      throw error.response?.data || error.message;
    }
  }
}
