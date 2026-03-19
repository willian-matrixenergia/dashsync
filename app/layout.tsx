import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DashSync',
  description: 'Monitorização de Portfólio de Infraestrutura',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
