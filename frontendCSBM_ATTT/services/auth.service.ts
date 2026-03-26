import axiosClient from '@/lib/axios';
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@/types';

export const authService = {
  login(payload: LoginRequest) {
    return axiosClient.post<LoginResponse>('/api/auth/login', payload);
  },

  register(payload: RegisterRequest) {
    return axiosClient.post('/api/auth/register', payload);
  },

  changePassword(payload: ChangePasswordRequest) {
    return axiosClient.put('/api/auth/change-password', payload);
  },
};