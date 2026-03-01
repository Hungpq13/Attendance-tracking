/**
 * Config - Constants
 * Chứa các giá trị cấu hình dự án
 */

// API Configuration
 //const API_BASE_URL = '/api';
// Sẽ được proxy qua Vite dev server đến: 
export const API_BASE_URL ='https://100.96.18.81:7085/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  CHANGE_PASSWORD: '/auth/change-password',
  CHANGE_INITIAL_PASSWORD: '/auth/change-initial-password',
  
  // User
  GET_PROFILE: '/userProfile',

  UPDATE_PROFILE_ME: '/userProfile/me',
  
  // Payroll
  GET_SALARY_COMPONENTS: '/payroll/salary-structure/components',
  GET_USER_SALARY_STRUCTURE: '/payroll/salary-structure/user',
};

// Error Message Translations
export const ERROR_MESSAGE_TRANSLATIONS = {
  'Network error': 'Lỗi kết nối mạng',
  'network error': 'Lỗi kết nối mạng',
  'Unsupported protocol': 'URL không hợp lệ',
  'Failed to fetch': 'Lỗi kết nối tới máy chủ',
  'Unauthorized - Token expired': 'Phiên làm việc đã hết hạn',
  'token expired': 'Phiên làm việc đã hết hạn',
  '401': 'Không có quyền truy cập',
  '400': 'Dữ liệu không hợp lệ',
  '403': 'Bạn không có quyền truy cập',
  '404': 'Không tìm thấy dữ liệu',
  '500': 'Lỗi máy chủ',
  '503': 'Dịch vụ tạm không khả dụng',
};

// Function to translate error messages
export const translateErrorMessage = (error) => {
  if (!error) return 'Lỗi hệ thống. Vui lòng thử lại sau.';
  
  const errorString = error.toString ? error.toString() : String(error);
  const errorMessage = error.message ? error.message : errorString;
  
  // Check for specific error patterns
  for (const [key, translation] of Object.entries(ERROR_MESSAGE_TRANSLATIONS)) {
    if (errorString.includes(key) || errorMessage.includes(key)) {
      return `${translation}: ${errorMessage}`;
    }
  }
  
  // Return original message if no translation found
  return errorMessage || 'Lỗi hệ thống. Vui lòng thử lại sau.';
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  REFRESH_TOKEN: 'refreshToken',
};

// Direct exports for backward compatibility
export const STORAGE_TOKEN = STORAGE_KEYS.TOKEN;
export const STORAGE_USER = STORAGE_KEYS.USER;
export const STORAGE_REFRESH_TOKEN = STORAGE_KEYS.REFRESH_TOKEN;

// Permissions
export const PERMISSIONS = {
  HR_TIMEKEEPING_READ: 'HR_TIMEKEEPING.Read',
  HR_TIMEKEEPING_WRITE: 'HR_TIMEKEEPING.Write',
  SYSTEM_USERS_READ: 'SYSTEM_USERS.Read',
  SYSTEM_USERS_WRITE: 'SYSTEM_USERS.Write',
  SYSTEM_USERS_DELETE: 'SYSTEM_USERS.Delete',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'Quản trị viên',
  HR: 'Quản lý nhân sự',
  USER: 'Nhân viên',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

//Routes
export const ROUTES = {
  LOGIN:  '/' ,
  MAIN: '/main',  
  CHANGE_PASSWORD: '/change-password',
  ERROR : '/error',
};
