import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSBM & ATTT',
  description: 'Frontend quản lý nhân viên và file',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}