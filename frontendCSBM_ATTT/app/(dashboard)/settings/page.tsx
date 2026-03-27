'use client';

import { useEffect, useState } from 'react';

import { employeeService } from '@/services/employee.service';
import { getErrorMessage } from '@/lib/utils';
import { getDataPassword, setDataPassword } from '@/lib/auth';
import type {
  ChangeDataPasswordRequest,
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
} from '@/types';
import PageTitle from '@/app/components/common/page-title';
import ChangeDataPasswordForm from '@/app/components/employee/change-data-password-form';
import EmployeeProfileForm from '@/app/components/employee/employee-profile-form';
import Loading from '@/app/components/common/loading';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Employee | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [unlockingProfile, setUnlockingProfile] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [dataPasswordInput, setDataPasswordInput] = useState('');
  const [currentDataPassword, setCurrentDataPassword] = useState('');

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
    const saved = getDataPassword() || '';
    setDataPasswordInput(saved);
    setCurrentDataPassword(saved);
    fetchProfile();
  }, []);

  const handleUnlockProfile = async () => {
    setUnlockingProfile(true);
    setError('');
    setSuccess('');

    try {
      if (!dataPasswordInput) {
        throw new Error('Vui lòng nhập data password.');
      }

      setDataPassword(dataPasswordInput);
      setCurrentDataPassword(dataPasswordInput);

      const response = await employeeService.getMyProfile();
      setProfile(response.data);
      setSuccess('Giải mã dữ liệu hồ sơ thành công.');
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setUnlockingProfile(false);
    }
  };

  const handleUpdateProfile = async (
    payload: EmployeeCreateRequest | EmployeeUpdateRequest
  ) => {
    setUpdatingProfile(true);
    setError('');
    setSuccess('');

    try {
      if (!currentDataPassword) {
        throw new Error('Vui lòng nhập key và bấm "Giải mã dữ liệu" trước khi cập nhật.');
      }

      const updatePayload = {
        ...(payload as EmployeeUpdateRequest),
        dataPassword: currentDataPassword,
      };

      await employeeService.updateMyProfile(updatePayload);

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
      setCurrentDataPassword(payload.newDataPassword);
      setDataPasswordInput(payload.newDataPassword);

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
        subtitle="Nhập key để giải mã hồ sơ, sau đó mới cập nhật dữ liệu cá nhân"
      />

      {!currentDataPassword ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Chưa có key giải mã đang dùng. Hồ sơ có thể đang hiển thị dạng ****.
        </div>
      ) : (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Đã có key giải mã trên trình duyệt. Bạn có thể bấm giải mã lại hồ sơ bất cứ lúc nào.
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

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Giải mã dữ liệu hồ sơ
        </h2>

        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="w-full max-w-md">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Data password
            </label>
            <input
              type="password"
              value={dataPasswordInput}
              onChange={(e) => setDataPasswordInput(e.target.value)}
              placeholder="Nhập key để hiển thị dữ liệu thật"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <button
            onClick={handleUnlockProfile}
            disabled={unlockingProfile}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {unlockingProfile ? 'Đang giải mã...' : 'Giải mã dữ liệu'}
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Nhập đúng key rồi bấm nút này để tải lại hồ sơ đã giải mã. Sau đó mới chỉnh sửa và cập nhật.
        </p>
      </div>

      {loadingProfile ? (
        <Loading />
      ) : profile ? (
        <div className="space-y-6">
          <EmployeeProfileForm
            mode="update"
            initialData={profile}
            loading={updatingProfile}
            currentDataPassword={currentDataPassword}
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