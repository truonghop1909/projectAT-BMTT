import axiosClient from '@/lib/axios';
import type { AuditLog } from '@/types';

export const auditLogService = {
  getAll() {
    return axiosClient.get<AuditLog[]>('/api/admin/audit-logs');
  },

  getById(id: number | string) {
    return axiosClient.get<AuditLog>(`/api/admin/audit-logs/${id}`);
  },
};