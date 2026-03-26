'use client';

import { useState } from 'react';
import type { User, UserCreateRequest, UserUpdateRequest } from '@/types';

type Props = {
  mode: 'create' | 'update';
  initialData?: User | null;
  loading?: boolean;
  onSubmit: (payload: UserCreateRequest | UserUpdateRequest) => Promise<void> | void;
};

const ROLE_OPTIONS = ['ADMIN', 'EMPLOYEE', 'USER'];

export default function UserForm({
  mode,
  initialData,
  loading,
  onSubmit,
}: Props) {
  const [username, setUsername] = useState(initialData?.username || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialData?.role || 'USER');
  const [active, setActive] = useState<boolean>(initialData?.active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      const payload: UserCreateRequest = {
        username,
        password,
        role,
      };
      await onSubmit(payload);
      return;
    }

    const payload: UserUpdateRequest = {
      username,
      role,
      active,
    };
    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-5 text-lg font-semibold text-slate-900">
        {mode === 'create' ? 'Tạo user mới' : 'Cập nhật user'}
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Nhập username"
          />
        </div>

        {mode === 'create' ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Nhập password"
            />
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {ROLE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {mode === 'update' ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Trạng thái
            </label>
            <select
              value={active ? 'true' : 'false'}
              onChange={(e) => setActive(e.target.value === 'true')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        ) : null}
      </div>

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading
            ? 'Đang xử lý...'
            : mode === 'create'
            ? 'Tạo user'
            : 'Cập nhật user'}
        </button>
      </div>
    </form>
  );
}