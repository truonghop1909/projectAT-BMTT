import axiosClient from '@/lib/axios';
import type { User, UserCreateRequest, UserUpdateRequest } from '@/types';

export const userService = {
  getAll() {
    return axiosClient.get<User[]>('/api/admin/users');
  },

  getById(id: number | string) {
    return axiosClient.get<User>(`/api/admin/users/${id}`);
  },

  create(payload: UserCreateRequest) {
    return axiosClient.post<User>('/api/admin/users', payload);
  },

  update(id: number | string, payload: UserUpdateRequest) {
    return axiosClient.put<User>(`/api/admin/users/${id}`, payload);
  },

  resetPassword(id: number | string, newPassword: string) {
    return axiosClient.put(`/api/admin/users/${id}/reset-password`, {
      newPassword,
    });
  },

  delete(id: number | string) {
    return axiosClient.delete(`/api/admin/users/${id}`);
  },
};