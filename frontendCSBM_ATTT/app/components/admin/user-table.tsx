'use client';

import type { User } from '@/types';
import EmptyState from '../common/empty-state';

type Props = {
  users: User[];
  selectedUserId?: number | null;
  deletingId?: number | null;
  onSelect: (userId: number) => void;
  onDelete: (userId: number) => void;
};

export default function UserTable({
  users,
  selectedUserId,
  deletingId,
  onSelect,
  onDelete,
}: Props) {
  if (!users.length) {
    return (
      <EmptyState
        title="Chưa có user"
        description="Danh sách user hiện đang trống."
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
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`border-t border-slate-200 ${
                  selectedUserId === user.id ? 'bg-slate-50' : ''
                }`}
              >
                <td className="px-4 py-3">{user.id}</td>
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3">{user.role || '-'}</td>
                <td className="px-4 py-3">{user.active ? 'Có' : 'Không'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onSelect(user.id)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                    >
                      Chi tiết / Sửa
                    </button>

                    <button
                      onClick={() => onDelete(user.id)}
                      className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600"
                    >
                      {deletingId === user.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}