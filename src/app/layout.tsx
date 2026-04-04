import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/app-providers';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Pharma Nest — Trusted Care, Delivered Fast',
  description: 'India\'s most trusted online pharmacy. Order prescription medicines, vitamins, and wellness products with same-day delivery.',
  icons: {
    icon:  '/PharmaNest.png',
    apple: '/PharmaNest.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <body className={`${manrope.className} antialiased`}>
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
