'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { getCurrentUser } from '@/lib/auth';
import { ROLES } from '@/lib/constants';
import PageTitle from '@/app/components/common/page-title';
import AppCard from '@/app/components/common/app-card';

const shortcuts = [
  {
    title: 'Nhân viên',
    description: 'Xem danh sách và tìm kiếm hồ sơ nhân viên.',
    href: '/employees',
    adminOnly: false,
  },
  {
    title: 'Tạo hồ sơ',
    description: 'Tạo hồ sơ cá nhân cho user hiện tại.',
    href: '/employees/create',
    adminOnly: false,
  },
  {
    title: 'Tệp tin',
    description: 'Upload, decrypt, download và xóa file.',
    href: '/files',
    adminOnly: false,
  },
  {
    title: 'Cài đặt',
    description: 'Cập nhật hồ sơ và đổi data password.',
    href: '/settings',
    adminOnly: false,
  },
  {
    title: 'Admin Users',
    description: 'Tạo, sửa, reset password và xóa user.',
    href: '/admin/users',
    adminOnly: true,
  },
  {
    title: 'Audit Logs',
    description: 'Xem lịch sử thao tác trong hệ thống.',
    href: '/admin/audit-logs',
    adminOnly: true,
  },
];

export default function DashboardPage() {
  const user = getCurrentUser();
  const isAdmin = user?.role === ROLES.ADMIN;

  const visibleShortcuts = useMemo(() => {
    return shortcuts.filter((item) => !item.adminOnly || isAdmin);
  }, [isAdmin]);

  return (
    <div>
      <PageTitle
        title="Dashboard"
        subtitle="Tổng quan hệ thống quản lý nhân viên, file và admin"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleShortcuts.map((item) => (
          <AppCard key={item.href} title={item.title} subtitle={item.description}>
            <Link
              href={item.href}
              className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Mở trang
            </Link>
          </AppCard>
        ))}
      </div>
    </div>
  );
}