/**
 * GetSalaryComponentsUseCase
 * Lấy danh sách thành phần lương
 */
import { PayrollRepository } from '../../data/repositories/PayrollRepository';

export class GetSalaryComponentsUseCase {
  constructor() {
    this.payrollRepository = new PayrollRepository();
  }

  async execute() {
    try {
      const components = await this.payrollRepository.getSalaryComponents();
      return components;
    } catch (error) {
      throw error;
    }
  }
}
