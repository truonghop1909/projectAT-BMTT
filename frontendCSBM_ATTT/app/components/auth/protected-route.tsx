'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  getDefaultRouteByRole,
  hasRole,
} from '@/lib/auth';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (allowedRoles.length > 0 && !hasRole(user?.role, allowedRoles)) {
      router.replace(getDefaultRouteByRole(user?.role));
    }
  }, [loading, isAuthenticated, user, allowedRoles, router, pathname]);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (allowedRoles.length > 0 && !hasRole(user?.role, allowedRoles)) {
    return null;
  }

  return <>{children}</>;
}