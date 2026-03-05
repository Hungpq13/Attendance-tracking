import { API_BASE_URL, STORAGE_TOKEN, ROUTES } from './constants';
import { clearAuthStorage, handleForceLogout } from './TokenHelper';

/**
 * API Client
 * Wrapper around fetch để tự động thêm token và handle errors
 */
export const apiClient = async (url, options = {}) => {
  // Lấy token từ localStorage
  const token = localStorage.getItem(STORAGE_TOKEN);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Nếu có token, thêm vào Authorization header
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Nếu 401 (token hết hạn) hoặc 403 (forbidden):
    if (response.status === 401 || response.status === 403) {
      console.warn(`⚠️ Status ${response.status} - Triggering force logout`);
      handleForceLogout();
      return Promise.reject(`Unauthorized - Status ${response.status}`);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
