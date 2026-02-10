/**
 * IAuthRepository Interface
 * Định nghĩa các method cho Auth - Layer Domain
 */
export class IAuthRepository {
  /**
   * Đăng nhập người dùng
   * @param {string} username - Tên đăng nhập
   * @param {string} password - Mật khẩu
   * @returns {Promise<{accessToken, message}>}
   */
  async login(username, password) {
    throw new Error('login() không được implement');
  }

  /**
   * Đăng xuất người dùng
   * 💡 Browser sẽ tự động gửi refreshToken từ HTTP-only Cookie
   * @returns {Promise<void>}
   */
  async logout() {
    throw new Error('logout() không được implement');
  }

  /**
   * Thay đổi mật khẩu
   * @param {string} oldPassword - Mật khẩu cũ
   * @param {string} newPassword - Mật khẩu mới
   * @param {string} confirmPassword - Xác nhận mật khẩu
   * @returns {Promise<void>}
   */
  async changePassword(oldPassword, newPassword, confirmPassword) {
    throw new Error('changePassword() không được implement');
  }
}
