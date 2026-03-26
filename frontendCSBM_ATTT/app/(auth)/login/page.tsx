'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import {
  buildUserFromToken,
  getDefaultRouteByRole,
  getToken,
  isAuthenticated,
  setCurrentUser,
  setToken,
} from '@/lib/auth';
import { getErrorMessage } from '@/lib/utils';
import PageTitle from '@/app/components/common/page-title';

function extractToken(data: any): string {
  return data?.token || data?.accessToken || data?.jwt || '';
}

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    if (token && isAuthenticated()) {
      const user = buildUserFromToken(token);
      router.replace(getDefaultRouteByRole(user.role));
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await authService.login({
        username,
        password,
      });

      const token = extractToken(response.data);

      if (!token) {
        throw new Error('API login không trả token');
      }

      setToken(token);

      const tokenUser = buildUserFromToken(token);
      const mergedUser = {
        username: response.data?.username || tokenUser.username || username,
        role: response.data?.role || tokenUser.role || '',
      };

      setCurrentUser(mergedUser);

      router.replace(getDefaultRouteByRole(mergedUser.role));
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
        <PageTitle title="Đăng nhập" subtitle="Đăng nhập vào hệ thống" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
          >
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}