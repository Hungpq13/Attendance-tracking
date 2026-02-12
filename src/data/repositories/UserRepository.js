/**
 * UserRepository
 * Implementation của IUserRepository - Layer Data
 */
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserDataSource } from '../datasources/UserDataSource';

export class UserRepository extends IUserRepository {
  constructor() {
    super();
    this.dataSource = new UserDataSource();
  }

  /**
   * Lấy thông tin hồ sơ người dùng
   * @param {string} id - ID người dùng
   * @returns {Promise<Object>}
   */
  async getProfile(id) {
    return this.dataSource.getProfile(id);
  }

  /**
   * Cập nhật hồ sơ người dùng
   * @param {Object} profileData - Dữ liệu hồ sơ cần cập nhật
   * @returns {Promise<void>}
   */
  async updateProfile(profileData) {
    return this.dataSource.updateProfile(profileData);
  }

  /**
   * Lấy danh sách tất cả người dùng
   * @returns {Promise<Array>}
   */
  async getAllUsers() {
    return this.dataSource.getAllUsers();
  }
}
