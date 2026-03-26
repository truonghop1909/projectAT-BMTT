'use client';

import Link from 'next/link';
import type { Employee } from '@/types';
import { formatDate } from '@/lib/utils';
import EmptyState from '../common/empty-state';

type Props = {
  data: Employee[];
};

export default function EmployeeTable({ data }: Props) {
  if (!data.length) {
    return (
      <EmptyState
        title="Không có nhân viên"
        description="Danh sách hiện đang trống hoặc không có kết quả phù hợp."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Mã NV</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Giới tính</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Ngày vào chính thức</th>
              <th className="px-4 py-3">Mở khóa</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {data.map((employee) => (
              <tr key={employee.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{employee.id}</td>
                <td className="px-4 py-3">{employee.code || '-'}</td>
                <td className="px-4 py-3">{employee.name || '-'}</td>
                <td className="px-4 py-3">{employee.gender || '-'}</td>
                <td className="px-4 py-3">{employee.phoneNumber || '-'}</td>
                <td className="px-4 py-3">{employee.email || '-'}</td>
                <td className="px-4 py-3">{employee.type || '-'}</td>
                <td className="px-4 py-3">{employee.level || '-'}</td>
                <td className="px-4 py-3">
                  {formatDate(employee.officialStartDate)}
                </td>
                <td className="px-4 py-3">
                  {employee.unlocked ? 'Đã mở' : 'Đang khóa'}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/employees/${employee.id}`}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white"
                  >
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}