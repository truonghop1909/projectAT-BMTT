export default function Loading() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        <span className="text-sm text-slate-600">Đang tải dữ liệu...</span>
      </div>
    </div>
  );
}