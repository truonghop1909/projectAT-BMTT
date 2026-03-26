import type { AuditLog } from '@/types';

type Props = {
  log: AuditLog;
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-all text-sm text-slate-900">{value || '-'}</p>
    </div>
  );
}

export default function AuditLogDetailCard({ log }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-900">
        Chi tiết audit log
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="ID" value={log.id} />
        <DetailItem label="Username" value={log.username} />
        <DetailItem label="Action" value={log.action} />
        <DetailItem label="Entity name" value={log.entityName} />
        <DetailItem label="Entity ID" value={log.entityId} />
        <DetailItem label="Created at" value={log.createdAt} />
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Description
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-900">
          {log.description || '-'}
        </p>
      </div>
    </div>
  );
}