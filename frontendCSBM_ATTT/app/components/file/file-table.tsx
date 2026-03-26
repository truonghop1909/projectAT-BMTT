'use client';

import type { FileItem } from '@/types';
import EmptyState from '../common/empty-state';

type Props = {
  files: FileItem[];
  loadingDetailId?: number | null;
  loadingDecryptId?: number | null;
  loadingViewContentId?: number | null;
  downloadingId?: number | null;
  deletingId?: number | null;
  onViewDetail: (fileId: number) => void;
  onViewContent: (fileId: number) => void;
  onDecrypt: (fileId: number) => void;
  onDownload: (fileId: number) => void;
  onDelete: (fileId: number) => void;
};

function getDisplayName(file: FileItem) {
  return file.originalFileName || file.fileName || `File #${file.id}`;
}

export default function FileTable({
  files,
  loadingDetailId,
  loadingDecryptId,
  loadingViewContentId,
  downloadingId,
  deletingId,
  onViewDetail,
  onViewContent,
  onDecrypt,
  onDownload,
  onDelete,
}: Props) {
  if (!files.length) {
    return (
      <EmptyState
        title="Chưa có file"
        description="Bạn chưa upload file nào hoặc danh sách đang trống."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên file gốc</th>
              <th className="px-4 py-3">Tên file lưu</th>
              <th className="px-4 py-3">Đường dẫn lưu</th>
              <th className="px-4 py-3">Đã mã hóa</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="border-t border-slate-200 align-top">
                <td className="px-4 py-3">{file.id}</td>
                <td className="px-4 py-3">{getDisplayName(file)}</td>
                <td className="px-4 py-3">{file.fileName || '-'}</td>
                <td className="px-4 py-3 break-all text-xs text-slate-600">
                  {file.storedPath || '-'}
                </td>
                <td className="px-4 py-3">{file.isEncrypted ? 'Có' : 'Không'}</td>
                <td className="px-4 py-3">{file.createdAt || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onViewDetail(file.id)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                    >
                      {loadingDetailId === file.id ? 'Đang tải...' : 'Chi tiết'}
                    </button>

                    <button
                      onClick={() => onViewContent(file.id)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                    >
                      {loadingViewContentId === file.id ? 'Đang xem...' : 'Xem nội dung'}
                    </button>

                    <button
                      onClick={() => onDecrypt(file.id)}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white"
                    >
                      {loadingDecryptId === file.id ? 'Đang giải mã...' : 'Decrypt'}
                    </button>

                    <button
                      onClick={() => onDownload(file.id)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                    >
                      {downloadingId === file.id ? 'Đang tải...' : 'Download'}
                    </button>

                    <button
                      onClick={() => onDelete(file.id)}
                      className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600"
                    >
                      {deletingId === file.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}