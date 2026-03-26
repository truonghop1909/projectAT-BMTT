export type AuditLog = {
  id: number;
  username?: string;
  action?: string;
  entityName?: string;
  entityId?: number;
  description?: string;
  createdAt?: string;
};