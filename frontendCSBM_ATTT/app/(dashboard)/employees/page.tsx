'use client';

import { useEffect, useState } from 'react';
import PageTitle from '../../components/common/page-title';
import Loading from '../../components/common/loading';
import EmployeeSearchForm from '../../components/employee/employee-search-form';
import EmployeeTable from '../../components/employee/employee-table';
import { employeeService } from '@/services/employee.service';
import type { Employee, EmployeeSearchRequest } from '@/types';
import { getErrorMessage } from '@/lib/utils';
import { getDataPassword, setDataPassword } from '@/lib/auth';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [dataPasswordInput, setDataPasswordInput] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await employeeService.getAll();
      setEmployees(response.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = getDataPassword();
    if (saved) {
      setDataPasswordInput(saved);
    }
    fetchEmployees();
  }, []);

  const handleSearch = async (values: EmployeeSearchRequest) => {
    setSearching(true);
    setError('');

    try {
      const response = await employeeService.search(values);
      setEmployees(response.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSearching(false);
    }
  };

  const handleReset = async () => {
    fetchEmployees();
  };

  const handleSaveDataPassword = async () => {
    setDataPassword(dataPasswordInput);
    await fetchEmployees();
  };

  return (
    <div>
      <PageTitle
        title="Danh sách nhân viên"
        subtitle="Xem danh sách, tìm kiếm và mở chi tiết nhân viên"
      />

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">
              Data password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={dataPasswordInput}
              onChange={(e) => setDataPasswordInput(e.target.value)}
              placeholder="Nhập để giải che dữ liệu"
            />
          </div>

          <button
            onClick={handleSaveDataPassword}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Lưu data password
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Nếu data password đúng, backend có thể trả dữ liệu đã mở khóa
          và trường `unlocked` sẽ là true.
        </p>
      </div>

      <EmployeeSearchForm
        loading={searching}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {loading ? <Loading /> : <EmployeeTable data={employees} />}
    </div>
  );
}