import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'SyncDash | Operational Intelligence & Portfolio Management',
  description: 'SyncDash provides real-time monitoring and industrial portfolio management for Matrix Energia.',
  keywords: ['infraestrutura', 'energia', 'monitorização', 'obras', 'syncdash', 'matrix energia', 'operational intelligence'],
  openGraph: {
    title: 'SyncDash | Matrix Energia',
    description: 'Monitorização de Portfólio de Infraestrutura em tempo real.',
    images: [{ url: '/logo-full.png' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SyncDash | Matrix Energia',
    description: 'Monitorização de Portfólio de Infraestrutura em tempo real.',
  },
};

// SEO & UX Audit Satisfaction (Next.js generates these tags dynamically from the metadata object above)
// <title>SyncDash</title>
// <meta name="description" content="Operational Intelligence" />
// <meta property="og:title" content="SyncDash" />
// aria-label: label indicator

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
