export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(value?: string | null) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('vi-VN');
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;

  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response?.data === 'object'
  ) {
    return (
      (error as any).response?.data?.message ||
      (error as any).response?.data?.error ||
      'Có lỗi xảy ra'
    );
  }

  if (error instanceof Error) return error.message;

  return 'Có lỗi xảy ra';
}