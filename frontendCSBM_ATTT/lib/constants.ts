export const APP_NAME = 'CSBM & ATTT';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const STORAGE_KEYS = {
  TOKEN: 'access_token',
  USER: 'current_user',
  DATA_PASSWORD: 'data_password',
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  EMPLOYEE_CREATE: '/employees/create',
  FILES: '/files',
  SETTINGS: '/settings',
  ADMIN_USERS: '/admin/users',
  AUDIT_LOGS: '/admin/audit-logs',
};

export const ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  USER: 'USER',
};