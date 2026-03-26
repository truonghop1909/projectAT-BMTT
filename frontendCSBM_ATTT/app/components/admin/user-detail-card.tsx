import type { User } from '@/types';

type Props = {
  user: User;
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

export default function UserDetailCard({ user }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-900">Chi tiết user</h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="ID" value={user.id} />
        <DetailItem label="Username" value={user.username} />
        <DetailItem label="Role" value={user.role} />
        <DetailItem label="Active" value={user.active} />
      </div>
    </div>
  );
}