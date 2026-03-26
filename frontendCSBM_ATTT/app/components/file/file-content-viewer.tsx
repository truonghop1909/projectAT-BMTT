type FileContentResponse = {
  fileId: number;
  originalFileName: string;
  content: string;
  message: string;
};

type Props = {
  data: FileContentResponse;
};

export default function FileContentViewer({ data }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Nội dung file</h2>
        <p className="mt-1 text-sm text-slate-500">
          {data.originalFileName} (ID: {data.fileId})
        </p>
      </div>

      <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
        {data.message}
      </div>

      <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
        {data.content || '(file trống)'}
      </pre>
    </div>
  );
}