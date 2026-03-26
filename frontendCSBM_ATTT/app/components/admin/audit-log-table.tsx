'use client';

import type { AuditLog } from '@/types';
import EmptyState from '../common/empty-state';

type Props = {
  logs: AuditLog[];
  selectedLogId?: number | null;
  onSelect: (logId: number) => void;
};

export default function AuditLogTable({
  logs,
  selectedLogId,
  onSelect,
}: Props) {
  if (!logs.length) {
    return (
      <EmptyState
        title="Chưa có audit log"
        description="Danh sách audit log hiện đang trống."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Entity ID</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className={`border-t border-slate-200 ${
                  selectedLogId === log.id ? 'bg-slate-50' : ''
                }`}
              >
                <td className="px-4 py-3">{log.id}</td>
                <td className="px-4 py-3">{log.username || '-'}</td>
                <td className="px-4 py-3">{log.action || '-'}</td>
                <td className="px-4 py-3">{log.entityName || '-'}</td>
                <td className="px-4 py-3">{log.entityId ?? '-'}</td>
                <td className="px-4 py-3">{log.createdAt || '-'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onSelect(log.id)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}