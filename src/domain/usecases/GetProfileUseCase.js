/**
 * GetProfileUseCase
 * Lấy thông tin hồ sơ người dùng - Layer Domain
 */
export class GetProfileUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Thực thi lấy hồ sơ
   * @param {string} userId - ID người dùng
   * @returns {Promise<Object>}
   */
  async execute(userId) {
    try {
      if (!userId) {
        throw new Error('ID người dùng không hợp lệ');
      }

      const profile = await this.userRepository.getProfile(userId);

      if (!profile) {
        throw new Error('Không tìm thấy hồ sơ người dùng');
      }

      return profile;
    } catch (error) {
      throw error;
    }
  }
}
