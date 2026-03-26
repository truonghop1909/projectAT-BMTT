import axios from 'axios';
import { API_URL } from '@/lib/constants';
import { clearAuth, getDataPassword, getToken } from '@/lib/auth';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  const dataPassword = getDataPassword();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (dataPassword && !config.headers['X-Data-Password']) {
    config.headers['X-Data-Password'] = dataPassword;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;