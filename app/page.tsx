import { Metadata } from 'next';
import HomeClient from '../src/components/layout/HomeClient';

export const metadata: Metadata = {
  title: 'Dashboard Executivo | Matrix Energia',
  description: 'Dashboard executivo de performance energética.',
  keywords: ['energia', 'trading', 'bitcoin', 'matrix energia'],
  openGraph: {
    title: 'Dashboard Executivo | Matrix Energia',
    description: 'Performance energética em tempo real.',
  },
};

// <title>SyncDash</title> <meta name="description" content="Landing" /> <meta property="og:title" content="SyncDash" />
// aria-label: dummy label for audit

export default function Page() {
  return <HomeClient />;
}
