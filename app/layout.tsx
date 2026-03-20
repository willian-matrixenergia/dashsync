import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export const metadata: Metadata = {
  title: 'DashSync | Matrix Energia - Monitorização de Infraestrutura',
  description: 'Plataforma DashSync para monitorização em tempo real de portfólio de obras e infraestrutura da Matrix Energia.',
  keywords: ['infraestrutura', 'energia', 'monitorização', 'obras', 'dashsync', 'matrix energia'],
  openGraph: {
    title: 'DashSync | Matrix Energia',
    description: 'Monitorização de Portfólio de Infraestrutura em tempo real.',
    images: [{ url: '/logo-full.png' }], // Assuming there's a logo or default image
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={lexend.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
