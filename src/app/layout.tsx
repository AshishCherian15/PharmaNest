import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/app-providers';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Pharma Nest — Trusted Care, Delivered Fast',
  description: 'India\'s most trusted online pharmacy. Order prescription medicines, vitamins, and wellness products with same-day delivery.',
  icons: {
    icon:  '/modern-pharmacy-nest.png',
    apple: '/modern-pharmacy-nest.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${manrope.className} antialiased`}>
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
