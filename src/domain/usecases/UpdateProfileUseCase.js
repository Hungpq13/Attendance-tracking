/**
 * UpdateProfileUseCase
 * Cập nhật thông tin hồ sơ người dùng - Layer Domain
 */
export class UpdateProfileUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Thực thi cập nhật hồ sơ
   * @param {Object} profileData - Dữ liệu hồ sơ cần cập nhật
   * @returns {Promise<void>}
   */
  async execute(profileData) {
    try {
      if (!profileData || typeof profileData !== 'object') {
        throw new Error('Dữ liệu hồ sơ không hợp lệ');
      }

      await this.userRepository.updateProfile(profileData);
    } catch (error) {
      throw error;
    }
  }
}
