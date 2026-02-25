/**
 * usePayroll Hook
 * Hook để quản lý state và logic liên quan đến lương
 */
import { useState, useEffect } from 'react';
import { GetSalaryComponentsUseCase } from '../../domain/usecases/GetSalaryComponentsUseCase';
import { GetUserSalaryStructureUseCase } from '../../domain/usecases/GetUserSalaryStructureUseCase';

export const usePayroll = () => {
  const [salaryComponents, setSalaryComponents] = useState([]);
  const [userSalaryStructure, setUserSalaryStructure] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSalaryComponentsUseCase = new GetSalaryComponentsUseCase();
  const getUserSalaryStructureUseCase = new GetUserSalaryStructureUseCase();

  /**
   * Lấy danh sách thành phần lương
   */
  const fetchSalaryComponents = async () => {
    try {
      setLoading(true);
      setError(null);
      const components = await getSalaryComponentsUseCase.execute();
      setSalaryComponents(components);
    } catch (err) {
      setError(err.message || 'Có lỗi khi lấy thành phần lương');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lấy cơ cấu lương của một người dùng cụ thể
   * @param {string} userId - ID người dùng
   */
  const fetchUserSalaryStructure = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const salaryStructure = await getUserSalaryStructureUseCase.execute(userId);
      
      // Nếu API trả về array, return trực tiếp
      if (Array.isArray(salaryStructure)) {
        return salaryStructure;
      }
      
      // Nếu là object, chuyển thành array
      const structureArray = Object.values(salaryStructure);
      setUserSalaryStructure(structureArray);
      return structureArray;
    } catch (err) {
      setError(err.message || 'Có lỗi khi lấy cơ cấu lương');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lấy giá trị lương của một thành phần cụ thể
   * @param {string} componentCode - Mã thành phần lương
   */
  const getSalaryAmount = (componentCode) => {
    return userSalaryStructure[componentCode]?.amount || 0;
  };

  /**
   * Format tiền tệ
   * @param {number} amount - Số tiền
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return {
    salaryComponents,
    userSalaryStructure,
    loading,
    error,
    fetchSalaryComponents,
    fetchUserSalaryStructure,
    getSalaryAmount,
    formatCurrency,
  };
};
