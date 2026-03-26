'use client';

import { useState } from 'react';

type Props = {
  loading?: boolean;
  onSubmit: (newPassword: string) => Promise<void> | void;
};

export default function ResetPasswordForm({ loading, onSubmit }: Props) {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newPassword);
    setNewPassword('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-5 text-lg font-semibold text-slate-900">Reset password</h2>

      <div className="max-w-md">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Mật khẩu mới
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Nhập mật khẩu mới"
        />
      </div>

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-60"
        >
          {loading ? 'Đang reset...' : 'Reset password'}
        </button>
      </div>
    </form>
  );
}