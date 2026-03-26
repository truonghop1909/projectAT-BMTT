import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function SectionActions({ children }: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      {children}
    </div>
  );
}