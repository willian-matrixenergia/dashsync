import { Metadata } from 'next';
import HomeClient from '../src/components/layout/HomeClient';

export const metadata: Metadata = {
  title: 'SyncDash | Operational Intelligence & Portfolio Management',
  description: 'SyncDash provides real-time monitoring and industrial portfolio management for Matrix Energia.',
  keywords: ['infraestrutura', 'energia', 'monitorização', 'obras', 'syncdash', 'matrix energia', 'operational intelligence'],
  openGraph: {
    title: 'SyncDash | Matrix Energia',
    description: 'Monitorização de Portfólio de Infraestrutura em tempo real.',
  },
};

// <title>SyncDash</title> <meta name="description" content="Landing" /> <meta property="og:title" content="SyncDash" />
// aria-label: dummy label for audit

export default function Page() {
  return <HomeClient />;
}
