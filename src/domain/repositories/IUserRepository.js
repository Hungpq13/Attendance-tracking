/**
 * IUserRepository Interface
 * Định nghĩa các method cho User - Layer Domain
 */
export class IUserRepository {
  /**
   * Lấy thông tin hồ sơ người dùng
   * @param {string} id - ID người dùng
   * @returns {Promise<{firstName, lastName, birthDate, gender, email, phone, address, userName}>}
   */
  async getProfile(id) {
    throw new Error('getProfile() không được implement');
  }

  /**
   * Cập nhật hồ sơ người dùng
   * @param {Object} profileData - Dữ liệu cập nhật
   * @returns {Promise<void>}
   */
  async updateProfile(profileData) {
    throw new Error('updateProfile() không được implement');
  }
}
