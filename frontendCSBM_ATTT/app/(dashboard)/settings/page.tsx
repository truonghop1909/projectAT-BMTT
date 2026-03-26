'use client';

import { useEffect, useState } from 'react';
import PageTitle from '../../components/common/page-title';
import EmployeeProfileForm from '../../components/employee/employee-profile-form';
import { employeeService } from '@/services/employee.service';
import { getErrorMessage } from '@/lib/utils';
import { getDataPassword, setDataPassword } from '@/lib/auth';
import type {
  ChangeDataPasswordRequest,
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
} from '@/types';
import Loading from '@/app/components/common/loading';
import ChangeDataPasswordForm from '@/app/components/employee/change-data-password-form';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Employee | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    setLoadingProfile(true);
    setError('');

    try {
      const response = await employeeService.getMyProfile();
      setProfile(response.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (
    payload: EmployeeCreateRequest | EmployeeUpdateRequest
  ) => {
    setUpdatingProfile(true);
    setError('');
    setSuccess('');

    try {
      const updatePayload = payload as EmployeeUpdateRequest;
      await employeeService.updateMyProfile(updatePayload);

      if (updatePayload.dataPassword) {
        setDataPassword(updatePayload.dataPassword);
      }

      setSuccess('Cập nhật hồ sơ thành công.');
      await fetchProfile();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangeDataPassword = async (payload: ChangeDataPasswordRequest) => {
    setChangingPassword(true);
    setError('');
    setSuccess('');

    try {
      await employeeService.changeDataPassword(payload);

      setDataPassword(payload.newDataPassword);
      setSuccess('Đổi data password thành công.');

      await fetchProfile();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div>
      <PageTitle
        title="Cài đặt"
        subtitle="Quản lý hồ sơ cá nhân và đổi data password"
      />

      {getDataPassword() ? (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Đang có data password được lưu trên trình duyệt.
        </div>
      ) : (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Chưa có data password lưu trên trình duyệt. Một số dữ liệu có thể đang bị che.
        </div>
      )}

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

      {loadingProfile ? (
        <Loading />
      ) : profile ? (
        <div className="space-y-6">
          <EmployeeProfileForm
            mode="update"
            initialData={profile}
            loading={updatingProfile}
            onSubmit={handleUpdateProfile}
          />

          <ChangeDataPasswordForm
            loading={changingPassword}
            onSubmit={handleChangeDataPassword}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">
            Tài khoản này chưa có hồ sơ cá nhân. Hãy vào trang tạo hồ sơ trước.
          </p>
          <a
            href="/employees/create"
            className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Tạo hồ sơ ngay
          </a>
        </div>
      )}
    </div>
  );
}