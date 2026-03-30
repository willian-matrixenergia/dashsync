'use client';

import { useEffect, useState } from 'react';
import type {
  TradingMetrics,
  CashGenMonth,
  ExposicaoAnual,
  MtmAnual,
  PldAtual,
  KpiSemanalRow,
  StressTestScenario,
  TradingGasMetrics,
} from '@/src/types/energy';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TradingEnergiaModule } from './TradingEnergiaModule';
import { TradingEnergiaVisaoContabilModule } from './TradingEnergiaVisaoContabilModule';
import { TradingGasModule } from './TradingGasModule';

interface TradingData {
  energia: {
    metrics: TradingMetrics;
    cashGen: CashGenMonth[];
    exposicaoMmR: MtmAnual[];
    exposicaoGwh: ExposicaoAnual[];
    pldAtual: PldAtual[];
    kpiSemanal: KpiSemanalRow[];
    stressTest: StressTestScenario[];
  };
  gas: TradingGasMetrics;
}

interface TradingModuleProps {
  /** Modo TV: 0=Trading Energia, 1=Trading Gás. Undefined = exibe todos. */
  tvSlide?: number;
}

const TABS = [
  { label: 'Visão Contábil' },
  { label: 'Exposição Líquida' },
  { label: 'Trading Gás' },
];

export function TradingModule({ tvSlide }: TradingModuleProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<TradingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentTab = tvSlide !== undefined ? tvSlide : activeTab;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/trading');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError('Erro ao carregar dados de trading');
        }
      } catch (err) {
        setError('Erro na requisição');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !data) {
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
            <TradingEnergiaVisaoContabilModule
              cashGen={data.energia.cashGen}
              exposicaoMmR={data.energia.exposicaoMmR}
              pldAtual={data.energia.pldAtual}
            />
          </div>
        )}
        {tvSlide === 1 && (
          <div className="flex-1 overflow-hidden">
            <TradingEnergiaModule
              exposicaoGwh={data.energia.exposicaoGwh}
              kpiSemanal={data.energia.kpiSemanal}
              stressTest={data.energia.stressTest}
            />
          </div>
        )}
        {tvSlide === 2 && (
          <div className="flex-1 overflow-hidden">
            <TradingGasModule data={data.gas} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Sub-navbar */}
      <div className="flex bg-[#151B1C] p-1.5 gap-2 mb-4 rounded-xl justify-center max-w-fit mx-auto shadow-md border border-border mt-4">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={cn(
              'px-6 py-2 rounded-lg text-xs tracking-widest uppercase font-bold transition-all',
              currentTab === i
                ? 'bg-primary text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto animate-in fade-in duration-500">
        {currentTab === 0 && (
          <TradingEnergiaVisaoContabilModule
            cashGen={data.energia.cashGen}
            exposicaoMmR={data.energia.exposicaoMmR}
            pldAtual={data.energia.pldAtual}
          />
        )}
        {currentTab === 1 && (
          <TradingEnergiaModule
            exposicaoGwh={data.energia.exposicaoGwh}
            kpiSemanal={data.energia.kpiSemanal}
            stressTest={data.energia.stressTest}
          />
        )}
        {currentTab === 2 && (
          <TradingGasModule data={data.gas} />
        )}
      </div>
    </div>
  );
}
