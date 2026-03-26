import axiosClient from '@/lib/axios';
import type {
  FileContentResponse,
  FileDecryptResponse,
  FileItem,
  FileUploadResponse,
} from '@/types';

export const fileService = {
  upload(file: File, dataPassword: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataPassword', dataPassword);

    return axiosClient.post<FileUploadResponse>('/api/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getMyFiles() {
    return axiosClient.get<FileItem[]>('/api/files/my-files');
  },

  getById(fileId: number | string) {
    return axiosClient.get<FileItem>(`/api/files/${fileId}`);
  },

  decrypt(fileId: number | string, dataPassword: string) {
    const formData = new FormData();
    formData.append('dataPassword', dataPassword);

    return axiosClient.post<FileDecryptResponse>(`/api/files/decrypt/${fileId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  download(fileId: number | string, dataPassword: string) {
    return axiosClient.get(`/api/files/download/${fileId}`, {
      params: { dataPassword },
      responseType: 'blob',
    });
  },

  viewContent(fileId: number | string, dataPassword: string) {
    return axiosClient.get<FileContentResponse>(`/api/files/view-content/${fileId}`, {
      params: { dataPassword },
    });
  },

  delete(fileId: number | string) {
    return axiosClient.delete(`/api/files/${fileId}`);
  },
};