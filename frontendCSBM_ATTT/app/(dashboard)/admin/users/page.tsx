'use client';

import { useEffect, useState } from 'react';

import { ROLES } from '@/lib/constants';
import { getErrorMessage } from '@/lib/utils';
import { userService } from '@/services/user.service';
import type { User, UserCreateRequest, UserUpdateRequest } from '@/types';
import ProtectedRoute from '@/app/components/auth/protected-route';
import PageTitle from '@/app/components/common/page-title';
import UserForm from '@/app/components/admin/user-form';
import Loading from '@/app/components/common/loading';
import UserTable from '@/app/components/admin/user-table';
import UserDetailCard from '@/app/components/admin/user-detail-card';
import ResetPasswordForm from '@/app/components/admin/user-reset-password-form';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [loadingList, setLoadingList] = useState(true);
  const [creating, setCreating] = useState(false);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    setLoadingList(true);
    setError('');

    try {
      const response = await userService.getAll();
      setUsers(response.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (payload: UserCreateRequest | UserUpdateRequest) => {
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      await userService.create(payload as UserCreateRequest);
      setSuccess('Tạo user thành công.');
      await fetchUsers();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setCreating(false);
    }
  };

  const handleSelectUser = async (userId: number) => {
    setLoadingSelected(true);
    setError('');
    setSuccess('');

    try {
      const response = await userService.getById(userId);
      setSelectedUser(response.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingSelected(false);
    }
  };

  const handleUpdate = async (payload: UserCreateRequest | UserUpdateRequest) => {
    if (!selectedUser?.id) return;

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await userService.update(
        selectedUser.id,
        payload as UserUpdateRequest
      );
      setSelectedUser(response.data);
      setSuccess('Cập nhật user thành công.');
      await fetchUsers();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!selectedUser?.id) return;

    setResetting(true);
    setError('');
    setSuccess('');

    try {
      await userService.resetPassword(selectedUser.id, newPassword);
      setSuccess('Reset password thành công.');
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async (userId: number) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa user #${userId} không?`);
    if (!confirmed) return;

    setDeletingId(userId);
    setError('');
    setSuccess('');

    try {
      await userService.delete(userId);
      setSuccess('Xóa user thành công.');

      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }

      await fetchUsers();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="space-y-6">
        <PageTitle
          title="Quản lý user"
          subtitle="Tạo, cập nhật, reset password và xóa user"
        />

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        <UserForm mode="create" loading={creating} onSubmit={handleCreate} />

        {loadingList ? (
          <Loading />
        ) : (
          <UserTable
            users={users}
            selectedUserId={selectedUser?.id}
            deletingId={deletingId}
            onSelect={handleSelectUser}
            onDelete={handleDelete}
          />
        )}

        {loadingSelected ? <Loading /> : null}

        {selectedUser ? (
          <div className="space-y-6">
            <UserDetailCard user={selectedUser} />

            <UserForm
              mode="update"
              initialData={selectedUser}
              loading={updating}
              onSubmit={handleUpdate}
            />

            <ResetPasswordForm
              loading={resetting}
              onSubmit={handleResetPassword}
            />
          </div>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}