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
              <th className="px-4 py-3 whitespace-nowrap">ID</th>
              <th className="px-4 py-3 whitespace-nowrap">Mã NV</th>
              <th className="px-4 py-3 whitespace-nowrap">Tên</th>
              <th className="px-4 py-3 whitespace-nowrap">Giới tính</th>
              <th className="px-4 py-3 whitespace-nowrap">Số điện thoại</th>
              <th className="px-4 py-3 whitespace-nowrap">Email</th>
              <th className="px-4 py-3 whitespace-nowrap">Loại</th>
              <th className="px-4 py-3 whitespace-nowrap">Level</th>
              <th className="px-4 py-3 whitespace-nowrap">Ngày vào chính thức</th>
              <th className="px-4 py-3 whitespace-nowrap">Mở khóa</th>
              <th className="px-4 py-3 whitespace-nowrap">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {data.map((employee) => (
              <tr key={employee.id} className="border-t border-slate-200">
                <td className="px-4 py-3 whitespace-nowrap">{employee.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">{employee.code || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{employee.name || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{employee.gender || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{employee.phoneNumber || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{employee.email || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{employee.type || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{employee.level || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(employee.officialStartDate)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {employee.unlocked ? 'Đã mở' : 'Đang khóa'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/employees/${employee.id}`}
                    className="inline-flex whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
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