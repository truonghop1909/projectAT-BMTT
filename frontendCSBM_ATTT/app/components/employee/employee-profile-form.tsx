'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
} from '@/types';

type Props = {
  mode: 'create' | 'update';
  initialData?: Employee | null;
  loading?: boolean;
  currentDataPassword?: string;
  onSubmit: (payload: EmployeeCreateRequest | EmployeeUpdateRequest) => Promise<void> | void;
};

type FormState = {
  code: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  probationaryStartDate: string;
  probationaryEndDate: string;
  officialStartDate: string;
  type: string;
  level: string;
  graduationYear: string;
  education: string;
  email: string;
  taxCode: string;
  socialInsuranceCode: string;
  phoneNumber: string;
  citizenIdentificationCode: string;
  personalEmail: string;
  birthplace: string;
  currentAddress: string;
  permanentAddress: string;
  bankName: string;
  bankAccountNumber: string;
  dataPassword: string;
};

function buildInitialState(initialData?: Employee | null): FormState {
  return {
    code: initialData?.code || '',
    name: initialData?.name || '',
    gender: initialData?.gender || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    probationaryStartDate: initialData?.probationaryStartDate || '',
    probationaryEndDate: initialData?.probationaryEndDate || '',
    officialStartDate: initialData?.officialStartDate || '',
    type: initialData?.type || '',
    level: initialData?.level || '',
    graduationYear: initialData?.graduationYear || '',
    education: initialData?.education || '',
    email: initialData?.email || '',
    taxCode: initialData?.taxCode || '',
    socialInsuranceCode: initialData?.socialInsuranceCode || '',
    phoneNumber: initialData?.phoneNumber || '',
    citizenIdentificationCode: initialData?.citizenIdentificationCode || '',
    personalEmail: initialData?.personalEmail || '',
    birthplace: initialData?.birthplace || '',
    currentAddress: initialData?.currentAddress || '',
    permanentAddress: initialData?.permanentAddress || '',
    bankName: initialData?.bankName || '',
    bankAccountNumber: initialData?.bankAccountNumber || '',
    dataPassword: '',
  };
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
      />
    </div>
  );
}

export default function EmployeeProfileForm({
  mode,
  initialData,
  loading,
  currentDataPassword = '',
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(initialData));

  useEffect(() => {
    setForm(buildInitialState(initialData));
  }, [initialData]);

  const title = useMemo(
    () => (mode === 'create' ? 'Tạo hồ sơ cá nhân' : 'Cập nhật hồ sơ cá nhân'),
    [mode]
  );

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      const payload: EmployeeCreateRequest = {
        name: form.name,
        gender: form.gender || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        probationaryStartDate: form.probationaryStartDate || undefined,
        probationaryEndDate: form.probationaryEndDate || undefined,
        officialStartDate: form.officialStartDate || undefined,
        type: form.type || undefined,
        level: form.level || undefined,
        graduationYear: form.graduationYear || undefined,
        education: form.education || undefined,
        email: form.email || undefined,
        taxCode: form.taxCode || undefined,
        socialInsuranceCode: form.socialInsuranceCode || undefined,
        phoneNumber: form.phoneNumber || undefined,
        citizenIdentificationCode: form.citizenIdentificationCode || undefined,
        personalEmail: form.personalEmail || undefined,
        birthplace: form.birthplace || undefined,
        currentAddress: form.currentAddress || undefined,
        permanentAddress: form.permanentAddress || undefined,
        bankName: form.bankName || undefined,
        bankAccountNumber: form.bankAccountNumber || undefined,
        dataPassword: form.dataPassword,
      };

      await onSubmit(payload);
      return;
    }

    const payload: EmployeeUpdateRequest = {
      code: form.code || undefined,
      name: form.name || undefined,
      gender: form.gender || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
      probationaryStartDate: form.probationaryStartDate || undefined,
      probationaryEndDate: form.probationaryEndDate || undefined,
      officialStartDate: form.officialStartDate || undefined,
      type: form.type || undefined,
      level: form.level || undefined,
      graduationYear: form.graduationYear || undefined,
      education: form.education || undefined,
      email: form.email || undefined,
      taxCode: form.taxCode || undefined,
      socialInsuranceCode: form.socialInsuranceCode || undefined,
      phoneNumber: form.phoneNumber || undefined,
      citizenIdentificationCode: form.citizenIdentificationCode || undefined,
      personalEmail: form.personalEmail || undefined,
      birthplace: form.birthplace || undefined,
      currentAddress: form.currentAddress || undefined,
      permanentAddress: form.permanentAddress || undefined,
      bankName: form.bankName || undefined,
      bankAccountNumber: form.bankAccountNumber || undefined,
      dataPassword: currentDataPassword || undefined,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-900">{title}</h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field
          label="Mã nhân viên"
          value={form.code}
          onChange={(v) => setField('code', v)}
          placeholder="Nếu backend tự sinh có thể để trống"
          disabled={mode === 'create'}
        />
        <Field label="Họ tên" value={form.name} onChange={(v) => setField('name', v)} />
        <Field label="Giới tính" value={form.gender} onChange={(v) => setField('gender', v)} />
        <Field label="Ngày sinh" value={form.dateOfBirth} onChange={(v) => setField('dateOfBirth', v)} placeholder="YYYY-MM-DD" />
        <Field
          label="Probationary start"
          value={form.probationaryStartDate}
          onChange={(v) => setField('probationaryStartDate', v)}
          placeholder="YYYY-MM-DD"
        />
        <Field
          label="Probationary end"
          value={form.probationaryEndDate}
          onChange={(v) => setField('probationaryEndDate', v)}
          placeholder="YYYY-MM-DD"
        />
        <Field
          label="Official start"
          value={form.officialStartDate}
          onChange={(v) => setField('officialStartDate', v)}
          placeholder="YYYY-MM-DD"
        />
        <Field label="Loại" value={form.type} onChange={(v) => setField('type', v)} />
        <Field label="Level" value={form.level} onChange={(v) => setField('level', v)} />
        <Field label="Năm tốt nghiệp" value={form.graduationYear} onChange={(v) => setField('graduationYear', v)} />
        <Field label="Học vấn" value={form.education} onChange={(v) => setField('education', v)} />
        <Field label="Email công ty" value={form.email} onChange={(v) => setField('email', v)} />
        <Field label="Mã số thuế" value={form.taxCode} onChange={(v) => setField('taxCode', v)} />
        <Field label="Mã BHXH" value={form.socialInsuranceCode} onChange={(v) => setField('socialInsuranceCode', v)} />
        <Field label="Số điện thoại" value={form.phoneNumber} onChange={(v) => setField('phoneNumber', v)} />
        <Field
          label="CCCD"
          value={form.citizenIdentificationCode}
          onChange={(v) => setField('citizenIdentificationCode', v)}
        />
        <Field label="Email cá nhân" value={form.personalEmail} onChange={(v) => setField('personalEmail', v)} />
        <Field label="Nơi sinh" value={form.birthplace} onChange={(v) => setField('birthplace', v)} />
        <Field label="Địa chỉ hiện tại" value={form.currentAddress} onChange={(v) => setField('currentAddress', v)} />
        <Field label="Địa chỉ thường trú" value={form.permanentAddress} onChange={(v) => setField('permanentAddress', v)} />
        <Field label="Ngân hàng" value={form.bankName} onChange={(v) => setField('bankName', v)} />
        <Field label="Số tài khoản" value={form.bankAccountNumber} onChange={(v) => setField('bankAccountNumber', v)} />

        {mode === 'create' ? (
          <Field
            label="Data password"
            type="password"
            value={form.dataPassword}
            onChange={(v) => setField('dataPassword', v)}
            placeholder="Bắt buộc khi tạo hồ sơ"
          />
        ) : null}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo hồ sơ' : 'Cập nhật hồ sơ'}
        </button>
      </div>
    </form>
  );
}