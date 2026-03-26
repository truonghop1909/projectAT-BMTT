'use client';

import { useEffect, useState } from 'react';
import { fileService } from '@/services/file.service';
import { getErrorMessage } from '@/lib/utils';
import { getDataPassword, setDataPassword } from '@/lib/auth';
import type { FileContentResponse, FileDecryptResponse, FileItem } from '@/types';
import PageTitle from '@/app/components/common/page-title';
import FileUploadForm from '@/app/components/file/file-upload-form';
import Loading from '@/app/components/common/loading';
import FileTable from '@/app/components/file/file-table';
import FileDetailCard from '@/app/components/file/file-detail-card';
import ViewFileContentForm from '@/app/components/file/file-content-form';
import FileContentViewer from '@/app/components/file/file-content-viewer';

function extractDownloadFileName(contentDisposition?: string | null) {
  if (!contentDisposition) return 'download.bin';

  const match =
    contentDisposition.match(/filename\*=UTF-8''([^;]+)/i) ||
    contentDisposition.match(/filename="([^"]+)"/i) ||
    contentDisposition.match(/filename=([^;]+)/i);

  if (!match) return 'download.bin';

  try {
    return decodeURIComponent(match[1].replace(/"/g, '').trim());
  } catch {
    return match[1].replace(/"/g, '').trim();
  }
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [decryptResult, setDecryptResult] = useState<FileDecryptResponse | null>(null);
  const [fileContent, setFileContent] = useState<FileContentResponse | null>(null);
  const [viewContentTarget, setViewContentTarget] = useState<FileItem | null>(null);

  const [loadingList, setLoadingList] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);
  const [loadingDecryptId, setLoadingDecryptId] = useState<number | null>(null);
  const [loadingViewContentId, setLoadingViewContentId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [dataPassword, setDataPasswordState] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchFiles = async () => {
    setLoadingList(true);
    setError('');

    try {
      const response = await fileService.getMyFiles();
      setFiles(response.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    const saved = getDataPassword();
    if (saved) {
      setDataPasswordState(saved);
    }
    fetchFiles();
  }, []);

  const ensureDataPassword = () => {
    const current = dataPassword || getDataPassword() || '';
    if (!current) {
      throw new Error('Vui lòng nhập data password trước.');
    }
    setDataPassword(current);
    return current;
  };

  const handleUpload = async (file: File, password: string) => {
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fileService.upload(file, password);
      setDataPassword(password);
      setDataPasswordState(password);

      setSuccess(response.data?.message || 'Upload file thành công.');
      setDecryptResult(null);
      setSelectedFile(null);
      setFileContent(null);
      await fetchFiles();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const handleViewDetail = async (fileId: number) => {
    setLoadingDetailId(fileId);
    setError('');
    setSuccess('');

    try {
      const response = await fileService.getById(fileId);
      setSelectedFile(response.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingDetailId(null);
    }
  };

  const handleOpenViewContent = (fileId: number) => {
    const target = files.find((item) => item.id === fileId) || null;
    setViewContentTarget(target);
    setFileContent(null);
    setError('');
    setSuccess('');
  };

  const handleSubmitViewContent = async (password: string) => {
    if (!viewContentTarget?.id) return;

    setLoadingViewContentId(viewContentTarget.id);
    setError('');
    setSuccess('');

    try {
      if (!password) {
        throw new Error('Vui lòng nhập data password để xem nội dung file.');
      }

      const response = await fileService.viewContent(viewContentTarget.id, password);
      setFileContent(response.data);
      setDataPassword(password);
      setDataPasswordState(password);
      setSuccess(response.data?.message || 'Xem nội dung file thành công.');
      setViewContentTarget(null);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingViewContentId(null);
    }
  };

  const handleDecrypt = async (fileId: number) => {
    setLoadingDecryptId(fileId);
    setError('');
    setSuccess('');

    try {
      const password = ensureDataPassword();
      const response = await fileService.decrypt(fileId, password);
      setDecryptResult(response.data);
      setSuccess(response.data?.message || 'Giải mã file thành công.');
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingDecryptId(null);
    }
  };

  const handleDownload = async (fileId: number) => {
    setDownloadingId(fileId);
    setError('');
    setSuccess('');

    try {
      const password = ensureDataPassword();
      const response = await fileService.download(fileId, password);

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const fileName = extractDownloadFileName(response.headers['content-disposition']);
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess('Tải file thành công.');
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (fileId: number) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa file #${fileId} không?`);
    if (!confirmed) return;

    setDeletingId(fileId);
    setError('');
    setSuccess('');

    try {
      const response = await fileService.delete(fileId);
      setSuccess(
        typeof response.data === 'string' ? response.data : 'Xóa file thành công.'
      );

      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
      if (fileContent?.fileId === fileId) {
        setFileContent(null);
      }
      if (viewContentTarget?.id === fileId) {
        setViewContentTarget(null);
      }

      setDecryptResult(null);
      await fetchFiles();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Quản lý tệp tin"
        subtitle="Upload, xem danh sách, xem nội dung, giải mã, tải xuống và xóa file của bạn"
      />

      {dataPassword ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Đang dùng data password đã lưu trên trình duyệt.
        </div>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Chưa có data password lưu trên trình duyệt. Upload, xem nội dung, decrypt và download sẽ cần nhập password này.
        </div>
      )}

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

      {decryptResult ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <p className="font-medium">{decryptResult.message || 'Decrypt success'}</p>
          <p className="mt-1 break-all">Output path: {decryptResult.outputPath}</p>
        </div>
      ) : null}

      <FileUploadForm
        loading={uploading}
        defaultDataPassword={dataPassword}
        onSubmit={handleUpload}
      />

      {loadingList ? (
        <Loading />
      ) : (
        <FileTable
          files={files}
          loadingDetailId={loadingDetailId}
          loadingDecryptId={loadingDecryptId}
          loadingViewContentId={loadingViewContentId}
          downloadingId={downloadingId}
          deletingId={deletingId}
          onViewDetail={handleViewDetail}
          onViewContent={handleOpenViewContent}
          onDecrypt={handleDecrypt}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      )}

      {viewContentTarget ? (
        <ViewFileContentForm
          fileId={viewContentTarget.id}
          fileName={viewContentTarget.originalFileName || viewContentTarget.fileName}
          loading={loadingViewContentId === viewContentTarget.id}
          onSubmit={handleSubmitViewContent}
          onCancel={() => setViewContentTarget(null)}
        />
      ) : null}

      {selectedFile ? <FileDetailCard file={selectedFile} /> : null}
      {fileContent ? <FileContentViewer data={fileContent} /> : null}
    </div>
  );
}