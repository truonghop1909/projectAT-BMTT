'use client';

import { useState } from 'react';

type Props = {
  fileId: number;
  fileName?: string;
  loading?: boolean;
  onSubmit: (dataPassword: string) => Promise<void> | void;
  onCancel: () => void;
};

export default function ViewFileContentForm({
  fileId,
  fileName,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const [dataPassword, setDataPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(dataPassword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-2 text-lg font-semibold text-slate-900">Xem nội dung file</h2>
      <p className="mb-5 text-sm text-slate-500">
        File: {fileName || `#${fileId}`}
      </p>

      <div className="max-w-md">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Data password
        </label>
        <input
          type="password"
          value={dataPassword}
          onChange={(e) => setDataPassword(e.target.value)}
          placeholder="Nhập data password để xem nội dung file"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Đang xem...' : 'Xem nội dung'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}