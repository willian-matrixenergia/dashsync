import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { SessionProvider } from '@/src/components/providers/SessionProvider';
import { ThemeProvider } from '@/src/components/providers/theme-provider';

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sync-dash.vercel.app'),
  title: 'Dashboard Executivo | Matrix Energia',
  description: 'Dashboard executivo de performance energética com indicadores de GD, Comercial, Trading e Bitcoin.',
  keywords: ['energia', 'trading', 'bitcoin', 'dashboard', 'matrix energia'],
  openGraph: {
    title: 'Dashboard Executivo | Matrix Energia',
    description: 'Performance energética em tempo real.',
    images: [{ url: '/logo-matrix.svg' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard Executivo | Matrix Energia',
    description: 'Performance energética em tempo real.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={cn("font-sans", lexend.variable)}>
      <body className="font-sans">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
