import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export const metadata: Metadata = {
  title: 'SyncDash | Matrix Energia — Inteligência Operacional',
  description: 'Monitoramento em tempo real e gestão de portfólio industrial para Matrix Energia.',
  keywords: ['infraestrutura', 'energia', 'monitoramento', 'obras', 'syncdash', 'matrix energia', 'inteligência operacional'],
  openGraph: {
    title: 'SyncDash | Matrix Energia',
    description: 'Monitoramento de Portfólio de Infraestrutura em tempo real.',
    images: [{ url: '/logo-matrix.svg' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SyncDash | Matrix Energia',
    description: 'Monitoramento de Portfólio de Infraestrutura em tempo real.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={cn("font-sans", lexend.variable)}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
