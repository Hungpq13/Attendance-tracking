/**
 * useUser Hook
 * Custom hook để quản lý thông tin người dùng
 */
import { useState, useCallback } from 'react';
import { UserRepository } from '../../data/repositories/UserRepository';
import { GetProfileUseCase } from '../../domain/usecases/GetProfileUseCase';
import { UpdateProfileUseCase } from '../../domain/usecases/UpdateProfileUseCase';
import { getUserFromToken } from '../../config/TokenHelper';

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  // Khởi tạo repositories và use cases
  const userRepository = new UserRepository();
  const getProfileUseCase = new GetProfileUseCase(userRepository);
  const updateProfileUseCase = new UpdateProfileUseCase(userRepository);

  /**
   * Lấy thông tin hồ sơ người dùng
   */
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📥 Lấy thông tin hồ sơ...');

      // Lấy user ID từ token
      const user = getUserFromToken();
      if (!user) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Gọi use case lấy hồ sơ
      const data = await getProfileUseCase.execute(user.id);
      setProfile(data);

      console.log('✅ Lấy hồ sơ thành công!');
      return data;
    } catch (err) {
      console.error('❌ Lỗi lấy hồ sơ:', err);
      setError(err.message || 'Lấy hồ sơ thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cập nhật thông tin hồ sơ người dùng
   */
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 Cập nhật hồ sơ...');

      // Gọi use case cập nhật hồ sơ
      await updateProfileUseCase.execute(profileData);

      // Cập nhật local state
      setProfile(profileData);

      console.log('✅ Cập nhật hồ sơ thành công!');
      return { success: true };
    } catch (err) {
      console.error('❌ Lỗi cập nhật hồ sơ:', err);
      setError(err.message || 'Cập nhật hồ sơ thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
  };
};
