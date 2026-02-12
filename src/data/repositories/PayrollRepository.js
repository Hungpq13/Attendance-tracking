/**
 * PayrollRepository
 * Implementation của IPayrollRepository - Layer Data
 */
import { PayrollDataSource } from '../datasources/PayrollDataSource';

export class PayrollRepository {
  constructor() {
    this.dataSource = new PayrollDataSource();
  }

  /**
   * Lấy danh sách các thành phần lương
   * @returns {Promise<Array>}
   */
  async getSalaryComponents() {
    return this.dataSource.getSalaryComponents();
  }

  /**
   * Lấy cơ cấu lương của người dùng
   * @param {string} userId - ID người dùng
   * @returns {Promise<Array>}
   */
  async getUserSalaryStructure(userId) {
    return this.dataSource.getUserSalaryStructure(userId);
  }
}
