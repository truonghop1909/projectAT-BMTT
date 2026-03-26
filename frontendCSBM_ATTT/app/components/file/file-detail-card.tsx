import type { FileItem } from '@/types';

type Props = {
  file: FileItem;
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-all text-sm text-slate-900">
        {value === true ? 'Có' : value === false ? 'Không' : value || '-'}
      </p>
    </div>
  );
}

export default function FileDetailCard({ file }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-900">Chi tiết file</h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="ID" value={file.id} />
        <DetailItem label="Original file name" value={file.originalFileName} />
        <DetailItem label="Stored file name" value={file.fileName} />
        <DetailItem label="Stored path" value={file.storedPath} />
        <DetailItem label="Is encrypted" value={file.isEncrypted} />
        <DetailItem label="Created at" value={file.createdAt} />
        <DetailItem label="Updated at" value={file.updatedAt} />
        <DetailItem label="Deleted at" value={file.deletedAt} />
        <DetailItem label="Employee ID" value={file.employee?.id} />
        <DetailItem label="Employee code" value={file.employee?.code} />
        <DetailItem label="Employee name" value={file.employee?.name} />
      </div>
    </div>
  );
}