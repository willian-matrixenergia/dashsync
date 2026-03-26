import { NextResponse } from 'next/server';
import type { BitcoinMetrics, BitcoinEvolution } from '@/src/types/energy';

interface BitcoinResponse {
  metrics: BitcoinMetrics;
  evolution: BitcoinEvolution[];
}

const MOCK_BITCOIN: BitcoinResponse = {
  metrics: {
    hashrate: 0.2,
    uptimeBudget: 98.6,
    btcMinados: 0,
    consumoEnergia: 367,
  },
  evolution: [
    { mes: 'Jan', hashrate: 0,    hashrateBudget: 0,    btcMinados: 0, btcBudget: 0,   uptime: 0,    consumo: 0, consumoBudget: 0   },
    { mes: 'Fev', hashrate: 0.12, hashrateBudget: 0.12, btcMinados: 0, btcBudget: 1.6, uptime: 98.6, consumo: 0, consumoBudget: 332 },
    { mes: 'Mar', hashrate: 0.12, hashrateBudget: 0.12, btcMinados: 0, btcBudget: 1.7, uptime: 98.6, consumo: 0, consumoBudget: 367 },
    { mes: 'Abr', hashrate: 0.2,  hashrateBudget: 0.2,  btcMinados: 0, btcBudget: 2.8, uptime: 98.6, consumo: 0, consumoBudget: 603 },
    { mes: 'Mai', hashrate: 0.2,  hashrateBudget: 0.2,  btcMinados: 0, btcBudget: 2.9, uptime: 98.6, consumo: 0, consumoBudget: 623 },
    { mes: 'Jun', hashrate: 0.2,  hashrateBudget: 0.2,  btcMinados: 0, btcBudget: 2.8, uptime: 98.6, consumo: 0, consumoBudget: 603 },
    { mes: 'Jul', hashrate: 0.2,  hashrateBudget: 0.2,  btcMinados: 0, btcBudget: 2.9, uptime: 98.6, consumo: 0, consumoBudget: 623 },
    { mes: 'Ago', hashrate: 0.2,  hashrateBudget: 0.2,  btcMinados: 0, btcBudget: 2.9, uptime: 98.6, consumo: 0, consumoBudget: 623 },
    { mes: 'Set', hashrate: 0.2,  hashrateBudget: 0.2,  btcMinados: 0, btcBudget: 2.8, uptime: 98.6, consumo: 0, consumoBudget: 603 },
    { mes: 'Out', hashrate: 0.2,  hashrateBudget: 0.2,  btcMinados: 0, btcBudget: 2.9, uptime: 98.6, consumo: 0, consumoBudget: 623 },
    { mes: 'Nov', hashrate: 0.2,  hashrateBudget: 0.2,  btcMinados: 0, btcBudget: 2.8, uptime: 98.6, consumo: 0, consumoBudget: 603 },
    { mes: 'Dez', hashrate: 0.2,  hashrateBudget: 0.2,  btcMinados: 0, btcBudget: 2.9, uptime: 98.6, consumo: 0, consumoBudget: 623 },
  ],
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_BITCOIN,
  });
}
