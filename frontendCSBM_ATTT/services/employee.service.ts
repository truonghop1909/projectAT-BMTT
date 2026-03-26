import axiosClient from '@/lib/axios';
import type {
  ChangeDataPasswordRequest,
  Employee,
  EmployeeCreateRequest,
  EmployeeProfileRequest,
  EmployeeSearchRequest,
  EmployeeUpdateRequest,
} from '@/types';

export const employeeService = {
  getMyProfile() {
    return axiosClient.get<Employee>('/api/employees/me');
  },

  createMyProfile(payload: EmployeeCreateRequest | EmployeeProfileRequest) {
    return axiosClient.post<Employee>('/api/employees/me', payload);
  },

  updateMyProfile(payload: EmployeeUpdateRequest) {
    return axiosClient.put<Employee>('/api/employees/me', payload);
  },

  deleteMyProfile() {
    return axiosClient.delete('/api/employees/me');
  },

  getAll() {
    return axiosClient.get<Employee[]>('/api/employees');
  },

  getById(id: number | string) {
    return axiosClient.get<Employee>(`/api/employees/${id}`);
  },

  search(payload: EmployeeSearchRequest) {
    return axiosClient.post<Employee[]>('/api/employees/search', payload);
  },

  changeDataPassword(payload: ChangeDataPasswordRequest) {
    return axiosClient.put('/api/employees/me/change-data-password', payload);
  },
};