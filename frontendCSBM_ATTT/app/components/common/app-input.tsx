import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function AppInput({ label, ...props }: Props) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
      />
    </div>
  );
}