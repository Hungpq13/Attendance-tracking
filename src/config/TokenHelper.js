/**
 * TokenHelper
 * Tiện ích để làm việc với JWT tokens
 */
import { User } from '../domain/entities/User.entity';
import { STORAGE_TOKEN, STORAGE_USER } from '../config/constants';

/**
 * Decode JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload hoặc null nếu lỗi
 */
export const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    // Decode Base64 payload
    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Lấy thông tin user từ token đã lưu
 * @returns {User|null} User instance hoặc null
 */
export const getUserFromToken = () => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem(STORAGE_TOKEN);
    if (!token) {
      console.warn('⚠️ getUserFromToken: No token in localStorage');
      return null;
    }

    // Decode token
    const decoded = decodeToken(token);
    if (!decoded) {
      console.warn('⚠️ getUserFromToken: Token decode failed - invalid format');
      return null;
    }

    // Kiểm tra token có hết hạn không
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn('⚠️ getUserFromToken: Token expired');
      localStorage.removeItem(STORAGE_TOKEN);
      return null;
    }

    // Tạo User entity từ decoded token
    return new User(
      decoded.sub,
      decoded.unique_name,
      decoded.email,
      decoded.permissions || [],
      decoded.exp,
      decoded.iat
    );
  } catch (error) {
    console.error('❌ getUserFromToken error:', error);
    return null;
  }
};

/**
 * Lưu user vào localStorage
 * @param {User} user - User entity
 */
export const saveUserToStorage = (user) => {
  try {
    localStorage.setItem(STORAGE_USER, JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      permissions: user.permissions,
    }));
  } catch (error) {
  }
};

/**
 * Lưu token vào localStorage
 * @param {string} token - Access token
 */
export const saveTokenToStorage = (token) => {
  try {
    localStorage.setItem(STORAGE_TOKEN, token);
  } catch (error) {
  }
};

/**
 * Xóa tất cả thông tin auth khỏi localStorage
 */
export const clearAuthStorage = () => {
  try {
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_TOKEN);
  } catch (error) {
  }
};

/**
 * Lưu temp token vào localStorage (dùng khi cần đổi mật khẩu ban đầu)
 * @param {string} tempToken - Temporary token
 */
export const saveTempTokenToStorage = (tempToken) => {
  try {
    localStorage.setItem('tempToken', tempToken);

  } catch (error) {
  }
};

/**
 * Lấy temp token từ localStorage
 * @returns {string|null} Temp token hoặc null
 */
export const getTempToken = () => {
  try {
    return localStorage.getItem('tempToken');
  } catch (error) {
    return null;
  }
};

/**
 * Xóa temp token khỏi localStorage
 */
export const clearTempToken = () => {
  try {
    localStorage.removeItem('tempToken');
  } catch (error) {
  }
};

/**
 * Kiểm tra xem đang sử dụng temp token không
 * @returns {boolean}
 */
export const isUsingTempToken = () => {
  return !!getTempToken();
};

/**
 * Force Logout - Xóa sạch dữ liệu và dispatch event về lỗi phiên đăng nhập
 * Dùng khi token expire hoặc respond 401/403 từ server
 * Dispatch event để App.jsx xử lý toast + navigate
 */
export const handleForceLogout = () => {
  // Nếu chưa có token thì không cần logout
  if (!localStorage.getItem(STORAGE_TOKEN)) return;

  

  // 1. XÓA SẠCH TẤT CẢ DỮ LIỆU AUTH
  clearAuthStorage();
  clearTempToken();
  
  // 2. Dispatch event tokenExpired để App.jsx xử lý toast + navigate
  window.dispatchEvent(new Event('tokenExpired'));
  
  // 3. Dispatch event qua BroadcastChannel để các tab khác biết
  try {
    const channel = new BroadcastChannel('auth-channel');
    channel.postMessage({ type: 'TOKEN_EXPIRED' });
    channel.close();
  } catch (error) {
    // BroadcastChannel có thể không support trên một số trình duyệt
  }

  // 4. Set localStorage logout-event để các tab khác (dùng storage event) cũng logout
  try {
    localStorage.setItem('logout-event', Date.now().toString());
  } catch (error) {
  }
};

