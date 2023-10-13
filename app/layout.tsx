import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roller Coaster Maker',
  description: 'A roller coaster maker built with three.js and inspired by RollerCoaster Tycoon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
