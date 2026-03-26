'use client';

import { useState } from 'react';

type Props = {
  loading?: boolean;
  defaultDataPassword?: string;
  onSubmit: (file: File, dataPassword: string) => Promise<void> | void;
};

const ALLOWED_EXTENSIONS = ['.txt', '.json', '.csv', '.xml', '.md'];

function hasAllowedExtension(fileName: string) {
  const lower = fileName.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export default function FileUploadForm({
  loading,
  defaultDataPassword = '',
  onSubmit,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataPassword, setDataPassword] = useState(defaultDataPassword);
  const [error, setError] = useState('');

  const handleFileChange = (file: File | null) => {
    setError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!hasAllowedExtension(file.name)) {
      setSelectedFile(null);
      setError('Chỉ được upload file .txt, .json, .csv, .xml, .md');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedFile) {
      setError('Vui lòng chọn file.');
      return;
    }

    if (!hasAllowedExtension(selectedFile.name)) {
      setError('Chỉ được upload file .txt, .json, .csv, .xml, .md');
      return;
    }

    if (!dataPassword) {
      setError('Vui lòng nhập data password.');
      return;
    }

    await onSubmit(selectedFile, dataPassword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-5 text-lg font-semibold text-slate-900">Upload file mã hóa</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Chọn file
          </label>
          <input
            type="file"
            accept=".txt,.json,.csv,.xml,.md,text/plain,application/json,text/csv,application/xml,text/xml,text/markdown"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <p className="mt-2 text-xs text-slate-500">
            Chỉ hỗ trợ: .txt, .json, .csv, .xml, .md
          </p>
          {selectedFile ? (
            <p className="mt-2 text-xs text-slate-500">{selectedFile.name}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Data password
          </label>
          <input
            type="password"
            value={dataPassword}
            onChange={(e) => setDataPassword(e.target.value)}
            placeholder="Nhập data password để mã hóa file"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Đang upload...' : 'Upload file'}
        </button>
      </div>
    </form>
  );
}