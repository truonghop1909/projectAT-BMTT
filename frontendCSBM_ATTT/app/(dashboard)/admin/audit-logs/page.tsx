'use client';

import { useEffect, useState } from 'react';

import { ROLES } from '@/lib/constants';
import { getErrorMessage } from '@/lib/utils';
import { auditLogService } from '@/services/audit-log.service';
import type { AuditLog } from '@/types';
import ProtectedRoute from '@/app/components/auth/protected-route';
import PageTitle from '@/app/components/common/page-title';
import Loading from '@/app/components/common/loading';
import AuditLogTable from '@/app/components/admin/audit-log-table';
import AuditLogDetailCard from '@/app/components/admin/audit-log-detail-card';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingSelected, setLoadingSelected] = useState(false);

  const [error, setError] = useState('');

  const fetchLogs = async () => {
    setLoadingList(true);
    setError('');

    try {
      const response = await auditLogService.getAll();
      setLogs(response.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSelectLog = async (logId: number) => {
    setLoadingSelected(true);
    setError('');

    try {
      const response = await auditLogService.getById(logId);
      setSelectedLog(response.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingSelected(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="space-y-6">
        <PageTitle
          title="Audit Logs"
          subtitle="Xem toàn bộ lịch sử thao tác và chi tiết từng log"
        />

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {loadingList ? (
          <Loading />
        ) : (
          <AuditLogTable
            logs={logs}
            selectedLogId={selectedLog?.id}
            onSelect={handleSelectLog}
          />
        )}

        {loadingSelected ? <Loading /> : null}

        {selectedLog ? <AuditLogDetailCard log={selectedLog} /> : null}
      </div>
    </ProtectedRoute>
  );
}