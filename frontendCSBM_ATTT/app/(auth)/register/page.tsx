'use client';

import Link from 'next/link';
import { useState } from 'react';
import { authService } from '@/services/auth.service';
import PageTitle from '../../components/common/page-title';
import { getErrorMessage } from '@/lib/utils';

const ROLE_OPTIONS = ['USER', 'EMPLOYEE', 'ADMIN'];

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!form.username.trim()) {
        throw new Error('Vui lòng nhập username.');
      }

      if (!form.password) {
        throw new Error('Vui lòng nhập password.');
      }

      if (form.password !== form.confirmPassword) {
        throw new Error('Mật khẩu xác nhận không khớp.');
      }

      setLoading(true);

      await authService.register({
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      });

      setSuccess('Đăng ký thành công. Bạn có thể chuyển sang trang đăng nhập.');
      setForm({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'USER',
      });
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
        <PageTitle title="Đăng ký" subtitle="Tạo tài khoản mới" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <input
              value={form.username}
              onChange={(e) => setField('username', e.target.value)}
              placeholder="Nhập username"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder="Nhập password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Xác nhận password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setField('confirmPassword', e.target.value)}
              placeholder="Nhập lại password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            />
          </div>
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-600">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-medium text-slate-900 underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}