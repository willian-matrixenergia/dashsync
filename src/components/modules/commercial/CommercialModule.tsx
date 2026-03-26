"use client";

import { useState, useEffect } from "react";
import { PPAModule } from "./PPAModule";
import { EnergiaFacilModule } from "./EnergiaFacilModule";
import { BESSModule } from "./BESSModule";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface CommercialModuleProps {
  tvSlide?: number;
}

export function CommercialModule({ tvSlide }: CommercialModuleProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Se estiver no modo TV, tvSlide determina a aba via prop herdada.
  // Caso contrário, renderiza botões internos nativos para alternar na mão.
  const currentTab = tvSlide !== undefined ? tvSlide : activeTab;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [resPpa, resEf, resBess] = await Promise.all([
          fetch('/api/commercial/ppa'),
          fetch('/api/commercial/energia-facil'),
          fetch('/api/commercial/bess')
        ]);

        if (!resPpa.ok || !resEf.ok || !resBess.ok) {
          throw new Error('Erro ao carregar os dados comerciais.');
        }

        const [ppaData, efData, bessData] = await Promise.all([
          resPpa.json(),
          resEf.json(),
          resBess.json()
        ]);

        setData({
          ppa: ppaData.data,
          energiaFacil: efData.data,
          bess: bessData.data
        });
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full space-y-4">
        <Skeleton className="h-12 w-64 mx-auto rounded-xl" />
        <Skeleton className="flex-1 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardContent className="pt-6">
          <p className="text-destructive font-bold text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden text-card-foreground font-sans bg-background pb-8">
      {/* Sub-navbar customizada - Oculta no modo TV, visível em manual */}
      {tvSlide === undefined && (
        <div className="flex bg-[#151B1C] p-1.5 gap-2 mb-4 rounded-xl justify-center max-w-fit mx-auto shadow-md border border-border mt-4">
          <button 
            onClick={() => setActiveTab(0)}
            className={cn("px-6 py-2 rounded-lg text-xs tracking-widest uppercase font-bold transition-all", currentTab === 0 ? "bg-primary text-white shadow-sm" : "text-white/50 hover:text-white")}
          >
            PPA
          </button>
          <button 
            onClick={() => setActiveTab(1)}
            className={cn("px-6 py-2 rounded-lg text-xs tracking-widest uppercase font-bold transition-all", currentTab === 1 ? "bg-[#FF6B00] text-white shadow-sm" : "text-white/50 hover:text-white")}
          >
            Energia Fácil
          </button>
          <button 
            onClick={() => setActiveTab(2)}
            className={cn("px-6 py-2 rounded-lg text-xs tracking-widest uppercase font-bold transition-all", currentTab === 2 ? "bg-white/10 text-white" : "text-white/50 hover:text-white")}
          >
            BESS
          </button>
        </div>
      )}

      {/* Header section superior - Dark */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#151B1C] border-b-4 border-primary">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold uppercase text-white tracking-widest">
            {currentTab === 0 && "COMERCIAL - PPA"}
            {currentTab === 1 && "COMERCIAL – ENERGIA FÁCIL"}
            {currentTab === 2 && "COMERCIAL – BESS"}
          </h2>
          <span className="text-white/50 mx-2 text-xl font-light">|</span>
          <span className="text-white/80 text-sm tracking-wide">
            {currentTab === 2 ? "Report Mensal Janeiro 2026" : "Semana 09Fev vs. Semana 02Fev"}
          </span>
        </div>
        <div className="text-primary font-bold tracking-widest text-sm">
          Fev - 2026
        </div>
      </div>
      
      {/* Faixa Cinza Subtítulo */}
      <div className={cn(
        "px-6 py-2 font-bold text-xs tracking-widest border-b border-border dark:bg-muted dark:text-muted-foreground",
        currentTab === 0 ? "bg-[#F1F3F0] text-gray-800" : "bg-[#F1F3F0] text-gray-800 border-t border-primary"
      )}>
        {currentTab === 0 && "Rentabilização dos Contratos - PPA (R$ mil)"}
        {currentTab === 1 && "Funil de Vendas (# e R$ mil)"}
        {currentTab === 2 && "Rentabilização dos Contratos - BESS"}
      </div>

      <div className="flex-1 p-4 lg:p-6 pb-4 bg-background overflow-hidden relative animate-in fade-in duration-500">
        {currentTab === 0 && <PPAModule data={data.ppa} />}
        {currentTab === 1 && <EnergiaFacilModule data={data.energiaFacil} />}
        {currentTab === 2 && <BESSModule data={data.bess} />}
      </div>
    </div>
  );
}