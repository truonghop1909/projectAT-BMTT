'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Shield,
  History,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, ROLES } from '@/lib/constants';
import { getCurrentUser } from '@/lib/auth';

const menu = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Nhân viên', href: ROUTES.EMPLOYEES, icon: Users },
  { label: 'Tạo hồ sơ', href: ROUTES.EMPLOYEE_CREATE, icon: UserPlus },
  { label: 'Tệp tin', href: ROUTES.FILES, icon: FileText },
  { label: 'Cài đặt', href: ROUTES.SETTINGS, icon: Settings },
];

const adminMenu = [
  { label: 'Admin Users', href: ROUTES.ADMIN_USERS, icon: Shield },
  { label: 'Audit Logs', href: ROUTES.AUDIT_LOGS, icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = getCurrentUser();
  const isAdmin = user?.role === ROLES.ADMIN;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white xl:block">
      <div className="border-b border-slate-200 px-5 py-5">
        <h2 className="text-xl font-bold text-slate-900">CSBM & ATTT</h2>
        <p className="mt-1 text-sm text-slate-500">Management System</p>
      </div>

      <div className="p-4">
        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition',
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {isAdmin ? (
            <>
              <div className="my-4 border-t border-slate-200" />
              <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Admin
              </p>

              {adminMenu.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition',
                      active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </>
          ) : null}
        </nav>
      </div>
    </aside>
  );
}