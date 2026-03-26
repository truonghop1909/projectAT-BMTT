import { ReactNode } from 'react';

type Props = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
};

export default function AppCard({
  title,
  subtitle,
  children,
  rightSlot,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {(title || subtitle || rightSlot) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? (
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            ) : null}
          </div>

          {rightSlot ? <div>{rightSlot}</div> : null}
        </div>
      )}

      {children}
    </div>
  );
}