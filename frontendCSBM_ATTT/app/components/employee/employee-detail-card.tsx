'use client';

import type { Employee } from '@/types';
import { formatDate } from '@/lib/utils';

type Props = {
  employee: Employee;
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm text-slate-900">
        {value !== undefined && value !== null && value !== ''
          ? String(value)
          : '-'}
      </p>
    </div>
  );
}

export default function EmployeeDetailCard({ employee }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <DetailItem label="ID" value={employee.id} />
      <DetailItem label="Mã nhân viên" value={employee.code} />
      <DetailItem label="Họ tên" value={employee.name} />
      <DetailItem label="Giới tính" value={employee.gender} />
      <DetailItem label="Ngày sinh" value={formatDate(employee.dateOfBirth)} />
      <DetailItem
        label="Ngày bắt đầu thử việc"
        value={formatDate(employee.probationaryStartDate)}
      />
      <DetailItem
        label="Ngày kết thúc thử việc"
        value={formatDate(employee.probationaryEndDate)}
      />
      <DetailItem
        label="Ngày vào chính thức"
        value={formatDate(employee.officialStartDate)}
      />
      <DetailItem label="Loại nhân viên" value={employee.type} />
      <DetailItem label="Level" value={employee.level} />
      <DetailItem label="Năm tốt nghiệp" value={employee.graduationYear} />
      <DetailItem label="Học vấn" value={employee.education} />
      <DetailItem label="Email công ty" value={employee.email} />
      <DetailItem label="Email cá nhân" value={employee.personalEmail} />
      <DetailItem label="Số điện thoại" value={employee.phoneNumber} />
      <DetailItem label="Mã số thuế" value={employee.taxCode} />
      <DetailItem label="Mã BHXH" value={employee.socialInsuranceCode} />
      <DetailItem label="CCCD" value={employee.citizenIdentificationCode} />
      <DetailItem label="Nơi sinh" value={employee.birthplace} />
      <DetailItem label="Địa chỉ hiện tại" value={employee.currentAddress} />
      <DetailItem label="Địa chỉ thường trú" value={employee.permanentAddress} />
      <DetailItem label="Ngân hàng" value={employee.bankName} />
      <DetailItem label="Số tài khoản" value={employee.bankAccountNumber} />
      <DetailItem
        label="Trạng thái mở khóa"
        value={employee.unlocked ? 'Đã mở' : 'Đang khóa'}
      />
    </div>
  );
}