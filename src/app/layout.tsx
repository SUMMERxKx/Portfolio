import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

import NavBar from '@/components/navigation/NavBar';
import SiteFooter from '@/components/layout/SiteFooter';

const bodyFont = Inter({ subsets: ['latin'], variable: '--font-inter' });
const headingFont = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Samar Khajuria Portfolio',
  description:
    'Full-stack developer focused on AI-driven products, machine learning projects, and clear, practical design.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable} antialiased`}>
        <div className="room-gradient fireplace-glow flex min-h-screen flex-col">
          <NavBar />
          <main className="flex-1 pt-24">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}