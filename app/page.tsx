import { Metadata } from 'next';
import HomeClient from '../src/components/layout/HomeClient';

export const metadata: Metadata = {
  title: 'DashSync | Matrix Energia - Monitorização de Infraestrutura',
  description: 'Plataforma DashSync para monitorização em tempo real de portfólio de obras e infraestrutura da Matrix Energia.',
  keywords: ['infraestrutura', 'energia', 'monitorização', 'obras', 'dashsync', 'matrix energia'],
  openGraph: {
    title: 'DashSync | Matrix Energia',
    description: 'Monitorização de Portfólio de Infraestrutura em tempo real.',
    images: [{ url: '/logo-full.png' }],
  },
};

export default function Page() {
  return <HomeClient />;
}
