'use client';

import { useState } from 'react';
import type { ChangeDataPasswordRequest } from '@/types';

type Props = {
  loading?: boolean;
  onSubmit: (payload: ChangeDataPasswordRequest) => Promise<void> | void;
};

export default function ChangeDataPasswordForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<ChangeDataPasswordRequest>({
    oldDataPassword: '',
    newDataPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    setForm({
      oldDataPassword: '',
      newDataPassword: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-900">Đổi data password</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Data password cũ
          </label>
          <input
            type="password"
            value={form.oldDataPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, oldDataPassword: e.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Data password mới
          </label>
          <input
            type="password"
            value={form.newDataPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, newDataPassword: e.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Đang đổi...' : 'Đổi data password'}
        </button>
      </div>
    </form>
  );
}