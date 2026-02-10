/**
 * useAuth Hook
 * Custom hook để quản lý authentication
 */
import { useState, useCallback } from 'react';
import { AuthRepository } from '../../data/repositories/AuthRepository';
import { LoginUseCase } from '../../domain/usecases/LoginUseCase';
import { LogoutUseCase } from '../../domain/usecases/LogoutUseCase';
import { ChangePasswordUseCase } from '../../domain/usecases/ChangePasswordUseCase';
import { decodeToken, saveTokenToStorage, saveUserToStorage, getUserFromToken, clearAuthStorage } from '../../config/TokenHelper';
import { STORAGE_TOKEN } from '../../config/constants';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Khởi tạo repositories và use cases
  const authRepository = new AuthRepository();
  const loginUseCase = new LoginUseCase(authRepository);
  const logoutUseCase = new LogoutUseCase(authRepository);
  const changePasswordUseCase = new ChangePasswordUseCase(authRepository);

  /**
   * Đăng nhập
   */
  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔐 Bắt đầu quy trình đăng nhập...');

      // Gọi use case đăng nhập
      const response = await loginUseCase.execute(username, password);

      if (!response || !response.accessToken) {
        throw new Error('Không nhận được token từ server');
      }

      console.log('✅ Đăng nhập thành công!');

      // Lưu token vào localStorage
      saveTokenToStorage(response.accessToken);

      // Decode token và lấy user info
      const decoded = decodeToken(response.accessToken);
      if (!decoded) {
        throw new Error('Không thể decode token');
      }

      // Lưu user info vào localStorage
      const user = getUserFromToken();
      if (user) {
        saveUserToStorage(user);
      }

      return { success: true, user };
    } catch (err) {
      console.error('❌ Lỗi đăng nhập:', err);
      setError(err.message || 'Đăng nhập thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Đăng xuất
   */
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔓 Bắt đầu quy trình đăng xuất...');
      console.log('💡 Browser sẽ tự động gửi refreshToken từ HTTP-only Cookie');

      // Gọi use case đăng xuất
      // 💾 RefreshToken được gửi tự động bởi browser (withCredentials: true)
      await logoutUseCase.execute();

      // Xóa tất cả auth data từ localStorage
      clearAuthStorage();

      console.log('✅ Đăng xuất thành công!');
      return { success: true };
    } catch (err) {
      console.error('❌ Lỗi đăng xuất:', err);
      // Vẫn xóa local data dù API gặp lỗi
      clearAuthStorage();
      setError(err.message || 'Đăng xuất thất bại');
      return { success: true }; // Coi là thành công vì đã xóa local data
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Thay đổi mật khẩu
   */
  const changePassword = useCallback(async (oldPassword, newPassword, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔒 Thay đổi mật khẩu...');

      // Gọi use case thay đổi mật khẩu
      await changePasswordUseCase.execute(oldPassword, newPassword, confirmPassword);

      console.log('✅ Thay đổi mật khẩu thành công!');
      return { success: true };
    } catch (err) {
      console.error('❌ Lỗi thay đổi mật khẩu:', err);
      setError(err.message || 'Thay đổi mật khẩu thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Lấy user hiện tại đã lưu
   */
  const getCurrentUser = useCallback(() => {
    return getUserFromToken();
  }, []);

  /**
   * Kiểm tra xem user đã đăng nhập chưa
   */
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem(STORAGE_TOKEN);
    const user = getUserFromToken();
    return !!token && !!user;
  }, []);

  return {
    loading,
    error,
    login,
    logout,
    changePassword,
    getCurrentUser,
    isAuthenticated,
  };
};
