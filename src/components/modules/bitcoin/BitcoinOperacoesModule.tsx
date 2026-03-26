'use client';

import { useEffect, useState } from 'react';
import type { BitcoinMetrics, BitcoinEvolution, OperacoesData } from '@/src/types/energy';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BitcoinModule } from './BitcoinModule';
import { OperacoesModule } from './OperacoesModule';

interface BitcoinData {
  metrics: BitcoinMetrics;
  evolution: BitcoinEvolution[];
}

interface BitcoinOperacoesModuleProps {
  /** Modo TV: 0=Bitcoin, 1=Operações Estruturadas. Undefined = exibe todos. */
  tvSlide?: number;
}

export function BitcoinOperacoesModule({ tvSlide }: BitcoinOperacoesModuleProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [operacoesData, setOperacoesData] = useState<OperacoesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentTab = tvSlide !== undefined ? tvSlide : activeTab;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [btcRes, opsRes] = await Promise.all([
          fetch('/api/bitcoin'),
          fetch('/api/operacoes'),
        ]);

        const [btcJson, opsJson] = await Promise.all([
          btcRes.json(),
          opsRes.json(),
        ]);

        if (btcJson.success && opsJson.success) {
          setBitcoinData(btcJson.data);
          setOperacoesData(opsJson.data);
        } else {
          setError('Erro ao carregar dados');
        }
      } catch (err) {
        setError('Erro na requisição');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !bitcoinData || !operacoesData) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6 text-destructive">
          {error || 'Dados não disponíveis'}
        </CardContent>
      </Card>
    );
  }

  // Modo TV: renderiza somente o slide pedido em tela cheia
  if (tvSlide !== undefined) {
    return (
      <div className="h-full w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
        {tvSlide === 0 && (
          <div className="flex-1 overflow-hidden">
            <BitcoinModule metrics={bitcoinData.metrics} evolution={bitcoinData.evolution} />
          </div>
        )}
        {tvSlide === 1 && (
          <div className="flex-1 overflow-hidden">
            <OperacoesModule data={operacoesData} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Sub-navbar customizada */}
      <div className="flex bg-[#151B1C] p-1.5 gap-2 mb-4 rounded-xl justify-center max-w-fit mx-auto shadow-md border border-border mt-4">
        <button
          onClick={() => setActiveTab(0)}
          className={cn(
            'px-6 py-2 rounded-lg text-xs tracking-widest uppercase font-bold transition-all',
            currentTab === 0 ? 'bg-primary text-white shadow-sm' : 'text-white/50 hover:text-white'
          )}
        >
          Bitcoin
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={cn(
            'px-6 py-2 rounded-lg text-xs tracking-widest uppercase font-bold transition-all',
            currentTab === 1 ? 'bg-primary text-white shadow-sm' : 'text-white/50 hover:text-white'
          )}
        >
          Operações Estruturadas
        </button>
      </div>

      <div className="flex-1 overflow-auto animate-in fade-in duration-500">
        {currentTab === 0 && (
          <BitcoinModule metrics={bitcoinData.metrics} evolution={bitcoinData.evolution} />
        )}
        {currentTab === 1 && (
          <OperacoesModule data={operacoesData} />
        )}
      </div>
    </div>
  );
}
