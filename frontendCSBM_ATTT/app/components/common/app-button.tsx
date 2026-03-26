import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary: 'bg-slate-900 text-white hover:opacity-90',
  secondary: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50',
  danger: 'border border-red-300 text-red-600 bg-white hover:bg-red-50',
};

export default function AppButton({
  children,
  className,
  variant = 'primary',
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        'rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-60',
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}