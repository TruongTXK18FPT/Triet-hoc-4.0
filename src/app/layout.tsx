import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ChatbotWidget } from '@/components/layout/ChatbotWidget';
import { ClientProviders } from './ClientProviders';
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'Triết Học AI',
  description: 'Học Mác – Lênin dễ dàng hơn với AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ClientProviders>
          {children}
          <Toaster />
          <ChatbotWidget />
        </ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
