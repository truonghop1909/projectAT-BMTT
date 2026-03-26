export type FileEmployeeRef = {
  id: number;
  code?: string;
  name?: string;
};

export type FileItem = {
  id: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  fileName?: string;
  storedPath?: string;
  originalFileName?: string;
  isEncrypted?: boolean;
  employee?: FileEmployeeRef;
};

export type FileUploadResponse = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  fileName?: string;
  storedPath?: string;
  originalFileName?: string;
  isEncrypted?: boolean;
  employee?: FileEmployeeRef;
  message?: string;
};

export type FileDecryptResponse = {
  outputPath: string;
  message: string;
};

export type FileContentResponse = {
  fileId: number;
  originalFileName: string;
  content: string;
  message: string;
};