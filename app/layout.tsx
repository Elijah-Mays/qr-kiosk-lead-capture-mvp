import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'QR Kiosk Lead Capture MVP',
  description: 'Lean pilot app for capturing leads from a kiosk QR code.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
