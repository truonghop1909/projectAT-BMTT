'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '../../../components/common/page-title';
import EmployeeProfileForm from '../../../components/employee/employee-profile-form';
import { employeeService } from '@/services/employee.service';
import { getErrorMessage } from '@/lib/utils';
import { setDataPassword } from '@/lib/auth';
import type { EmployeeCreateRequest, EmployeeUpdateRequest } from '@/types';

export default function CreateEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (payload: EmployeeCreateRequest | EmployeeUpdateRequest) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const createPayload = payload as EmployeeCreateRequest;
      await employeeService.createMyProfile(createPayload);

      if (createPayload.dataPassword) {
        setDataPassword(createPayload.dataPassword);
      }

      setSuccess('Tạo hồ sơ thành công.');
      router.push('/settings');
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageTitle
        title="Tạo hồ sơ nhân viên"
        subtitle="Tạo hồ sơ cá nhân cho tài khoản đang đăng nhập"
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      <EmployeeProfileForm mode="create" loading={loading} onSubmit={handleSubmit} />
    </div>
  );
}