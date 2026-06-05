import type { Metadata } from 'next';
import { DM_Serif_Display, Hanken_Grotesk } from 'next/font/google';
import './globals.css';

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NG Clean — Professional Cleaning Services in Perth',
  description: 'Reliable, detail-focused cleaning for homes and businesses across Perth. End of lease, deep cleaning, carpet, oven, window cleaning and more. Free quotes.',
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${dmSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
