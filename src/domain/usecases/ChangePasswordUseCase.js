/**
 * ChangePasswordUseCase
 * Thay đổi mật khẩu người dùng - Layer Domain
 */
export class ChangePasswordUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  /**
   * Thực thi thay đổi mật khẩu
   * @param {string} oldPassword - Mật khẩu cũ
   * @param {string} newPassword - Mật khẩu mới
   * @param {string} confirmPassword - Xác nhận mật khẩu
   * @returns {Promise<void>}
   */
  async execute(oldPassword, newPassword, confirmPassword) {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!oldPassword || !newPassword || !confirmPassword) {
        throw new Error('Vui lòng nhập đầy đủ mật khẩu');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Mật khẩu mới không khớp');
      }

      if (newPassword.length < 6) {
        throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
      }

      console.log('🔒 Thay đổi mật khẩu...');
      await this.authRepository.changePassword(oldPassword, newPassword, confirmPassword);
      console.log('✅ Thay đổi mật khẩu thành công');
    } catch (error) {
      console.error('❌ ChangePasswordUseCase error:', error);
      throw error;
    }
  }
}
