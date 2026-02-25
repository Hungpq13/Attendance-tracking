/**
 * LogoutUseCase
 * Xử lý logic đăng xuất - Layer Domain
 */
export class LogoutUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  /**
   * Thực thi đăng xuất
   * 💡 RefreshToken được lưu trong HTTP-only Cookie của Browser
   * Browser sẽ tự động gửi nó khi withCredentials: true được set
   * @returns {Promise<void>}
   */
  async execute() {
    try {
      await this.authRepository.logout();
    } catch (error) {
      // Tiếp tục logout cục bộ dù có lỗi API
    }
  }
}
