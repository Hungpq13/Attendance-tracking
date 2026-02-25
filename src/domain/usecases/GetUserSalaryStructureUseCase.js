/**
 * GetUserSalaryStructureUseCase
 * Lấy cơ cấu lương của người dùng
 */
import { PayrollRepository } from '../../data/repositories/PayrollRepository';

export class GetUserSalaryStructureUseCase {
  constructor() {
    this.payrollRepository = new PayrollRepository();
  }

  async execute(userId) {
    try {
      const salaryStructure = await this.payrollRepository.getUserSalaryStructure(userId);
      return salaryStructure;
    } catch (error) {
      throw error;
    }
  }
}
