'use client';

import { useState } from 'react';
import type { EmployeeSearchRequest } from '@/types';

type Props = {
  loading?: boolean;
  onSearch: (values: EmployeeSearchRequest) => void;
  onReset: () => void;
};

const initialValues: EmployeeSearchRequest = {
  code: '',
  name: '',
  gender: '',
  type: '',
  level: '',
  education: '',
  graduationYear: '',
};

export default function EmployeeSearchForm({
  loading,
  onSearch,
  onReset,
}: Props) {
  const [form, setForm] = useState<EmployeeSearchRequest>(initialValues);

  const handleChange = (key: keyof EmployeeSearchRequest, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleaned: EmployeeSearchRequest = {};
    Object.entries(form).forEach(([key, value]) => {
      if (value && String(value).trim() !== '') {
        cleaned[key as keyof EmployeeSearchRequest] = value;
      }
    });

    onSearch(cleaned);
  };

  const handleReset = () => {
    setForm(initialValues);
    onReset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Mã nhân viên</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.code || ''}
            onChange={(e) => handleChange('code', e.target.value)}
            placeholder="VD: NV001"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tên</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nhập tên"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Giới tính</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            placeholder="Nam / Nữ"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Loại</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            placeholder="Intern / Official..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Level</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.level || ''}
            onChange={(e) => handleChange('level', e.target.value)}
            placeholder="Junior / Senior..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Học vấn</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.education || ''}
            onChange={(e) => handleChange('education', e.target.value)}
            placeholder="Đại học..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Năm tốt nghiệp</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.graduationYear || ''}
            onChange={(e) => handleChange('graduationYear', e.target.value)}
            placeholder="2024"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Đặt lại
        </button>
      </div>
    </form>
  );
}