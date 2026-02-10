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
      console.log('📤 Gọi API logout (Browser sẽ tự động gửi refreshToken từ Cookie)...');
      await this.authRepository.logout();
      console.log('✅ Backend logout thành công');
    } catch (error) {
      console.error('❌ LogoutUseCase error:', error);
      // Tiếp tục logout cục bộ dù có lỗi API
    }
  }
}
