type Props = {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
};

const styles = {
  success: 'border-green-200 bg-green-50 text-green-700',
  error: 'border-red-200 bg-red-50 text-red-600',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
};

export default function StatusAlert({
  type = 'info',
  message,
}: Props) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}