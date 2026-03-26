'use client';

import { useRouter } from 'next/navigation';
import { clearAuth, getCurrentUser } from '@/lib/auth';

export default function Header() {
  const router = useRouter();
  const user = getCurrentUser();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-sm text-slate-500">Xin chào</p>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-lg font-semibold text-slate-900">
            {user?.username || 'User'}
          </h1>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {user?.role || 'UNKNOWN'}
          </span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Đăng xuất
      </button>
    </header>
  );
}