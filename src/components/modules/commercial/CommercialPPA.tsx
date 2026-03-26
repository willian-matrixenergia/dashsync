"use client";

import { cn } from "@/lib/utils";

interface CommercialModuleProps {
  tvSlide?: number;
}

export function CommercialPPA({ tvSlide }: CommercialModuleProps) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden text-card-foreground font-sans">
      
      {/* Header section superior - Dark */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#151B1C] border-b-4 border-primary">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold uppercase text-white tracking-widest">COMERCIAL - PPA</h2>
          <span className="text-white/50 mx-2 text-xl font-light">|</span>
          <span className="text-white/80 text-sm tracking-wide">Semana 09Fev vs. Semana 02Fev</span>
        </div>
        <div className="text-primary font-bold tracking-widest text-sm">
          Fev - 2026
        </div>
      </div>
      
      {/* Faixa Cinza Subtítulo */}
      <div className="px-6 py-2 bg-[#F1F3F0] text-gray-800 font-bold text-xs tracking-widest border-b border-border dark:bg-muted dark:text-muted-foreground">
        Rentabilização dos Contratos - PPA (R$ mil)
      </div>

      <div className="flex-1 flex gap-4 p-4 lg:p-6 pb-8 bg-background overflow-hidden relative">
        
        {/* LEFT COLUMN: RENTABILIZAÇÃO DOS CONTRATOS - Forçado com Dark Base (Preto/Chumbo) */}
        <div className="w-[35%] min-w-[320px] max-w-[450px] flex flex-col h-full bg-[#0A0D0E] border-t-8 border-primary rounded-sm shadow-xl p-6 relative overflow-y-auto overflow-x-hidden scrollbar-hide">
          <h3 className="text-white font-bold uppercase tracking-widest text-[13px] mb-8">Rentabilização dos Contratos (R$ mil)</h3>
          
          <div className="flex justify-between items-end border-b border-white/20 pb-5 mb-6">
            <div>
              <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mb-1 font-bold">Atual</p>
              <p className="text-4xl lg:text-5xl font-bold text-primary tabular-nums break-all tracking-tighter">R$ 3,893 <span className="text-3xl lg:text-4xl">k</span></p>
            </div>
            <div className="text-right flex items-end gap-3 pb-1">
              <div>
                <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mb-1 font-bold">Vs. Última Semana</p>
                <p className="text-xl lg:text-2xl font-bold text-white tabular-nums tracking-tighter">-R$ 1,840k</p>
              </div>
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-red-600 mb-1" />
            </div>
          </div>

          <div className="mb-6 border-b border-white/20 pb-6 relative">
            <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mb-3 font-bold">Atingimento Mensal</p>
            <div className="flex flex-col mb-1 relative z-10">
               <div className="flex items-baseline gap-1">
                 <p className="text-3xl lg:text-4xl font-bold text-primary tabular-nums tracking-tighter">208%</p>
               </div>
               <p className="text-[10px] text-white/50 font-medium">de R$ 2,862 k</p>
            </div>
            {/* Progress bar and Badge container */}
            <div className="relative mt-2">
              <div className="absolute right-0 top-[-30px] z-20">
                <span className="bg-[#8CC63F] text-white px-8 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-bold shadow-md">
                   Confiante
                </span>
              </div>
              <div className="w-full h-4 bg-primary/20 rounded-none overflow-hidden relative z-10">
                <div className="h-full bg-primary w-full shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
              </div>
            </div>
          </div>

          <div className="mb-6 border-b border-white/20 pb-6">
            <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mb-3 font-bold">Evolução Semanal (Fevereiro)</p>
            <div className="h-28 w-full border border-white/20 bg-[#1A2224] rounded-xl p-4 relative flex items-end justify-center shadow-inner">
               <div className="absolute inset-x-6 bottom-8 border-b border-white/10" />
               <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 40" preserveAspectRatio="none">
                 <path d="M20,30 L80,15" stroke="#FF6B00" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                 <circle cx="20" cy="30" r="3" fill="#FF6B00" />
                 <circle cx="80" cy="15" r="3" fill="#FF6B00" />
               </svg>
               <div className="w-full flex justify-between px-4 pb-0 z-20">
                  <span className="text-[9px] text-white/40 font-bold">S1</span>
                  <span className="text-[9px] text-white/40 font-bold">S2</span>
               </div>
            </div>
          </div>

          <div>
            <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mb-3 font-bold">Atingimento Anual</p>
            <div className="flex items-start justify-between relative mb-1">
              <div className="flex flex-col">
                 <p className="text-3xl lg:text-4xl font-bold text-primary tabular-nums tracking-tighter">14%</p>
                 <p className="text-[10px] text-white/50 font-medium">de R$ 50,000k</p>
              </div>
              <div className="absolute left-[6%] top-[-8px] flex flex-col items-center">
                 <span className="text-[9px] text-primary font-bold mb-1">6%</span>
                 <div className="w-px h-8 border-l border-dashed border-primary" />
              </div>
            </div>
            <div className="w-full h-4 bg-[#2A3437] rounded-none relative mt-2">
              <div className="absolute left-[6%] top-[-4px] bottom-[-4px] w-0.5 bg-primary z-20 shadow-[0_0_5px_rgba(255,107,0,0.8)]" />
              <div className="h-full bg-primary relative z-10 shadow-[0_0_10px_rgba(255,107,0,0.5)]" style={{ width: '14%' }} />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 3 ROWS (Originação, Comissionamento, Renegociação) */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
          
          {/* Row 1: Originação */}
          <div className="flex-1 min-h-[140px] border-t-[6px] border-t-primary bg-white dark:bg-card border border-border border-t-0 rounded-sm shadow-md p-4 flex flex-col">
            <h3 className="font-extrabold text-primary uppercase tracking-widest text-[13px] mb-4">Originação</h3>
            <div className="flex-1 grid grid-cols-4 gap-4 lg:gap-8">
              {/* Col 1 */}
              <div className="flex flex-col justify-between h-full border-r border-border pr-4">
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-muted-foreground uppercase tracking-[0.2em] mb-1 font-bold">Atual</p>
                  <p className="text-2xl lg:text-3xl font-bold text-primary tabular-nums break-all tracking-tighter">R$ 39.6 k</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div>
                    <p className="text-[9px] text-gray-500 dark:text-muted-foreground uppercase tracking-[0.2em] mb-1 font-bold">Semana</p>
                    <p className="text-base lg:text-lg font-bold text-gray-900 dark:text-foreground tabular-nums tracking-tighter">-R$ 343 k</p>
                  </div>
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-red-600 mb-1" />
                </div>
              </div>
              {/* Col 2 */}
              <div className="flex flex-col justify-center h-full border-r border-border pr-4">
                <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-3 font-bold">Atingimento Mensal</p>
                <div className="flex items-baseline gap-1 justify-center mb-2">
                  <p className="text-xl lg:text-2xl font-bold text-primary tabular-nums">18%</p>
                  <p className="text-[9px] text-gray-500 dark:text-muted-foreground font-medium">de R$ 2,289 k</p>
                </div>
                <div className="w-full h-3.5 bg-gray-200 dark:bg-secondary rounded-none mb-2">
                  <div className="h-full bg-primary/80 w-[18%]" />
                </div>
                <p className="text-[9px] text-gray-400 dark:text-muted-foreground font-medium text-center">acumulado mês atual: R$ 422 k</p>
              </div>
              {/* Col 3 */}
              <div className="flex flex-col justify-center h-full border-r border-border pr-4">
                <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-2 font-bold">Evolução Semanal</p>
                <div className="h-16 w-full border border-primary/20 bg-orange-50/30 dark:bg-primary/5 rounded-xl p-2 relative flex items-end justify-center">
                   <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 40" preserveAspectRatio="none">
                     <path d="M20,10 L80,30" stroke="#FF6B00" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                     <circle cx="20" cy="10" r="3" fill="#FF6B00" />
                     <circle cx="80" cy="30" r="3" fill="#FF6B00" />
                   </svg>
                   <div className="w-full flex justify-between px-2 pb-0 z-20">
                      <span className="text-[8px] text-gray-400 dark:text-muted-foreground font-bold">S2</span>
                      <span className="text-[8px] text-gray-400 dark:text-muted-foreground font-bold">S3</span>
                   </div>
                </div>
              </div>
              {/* Col 4 */}
              <div className="flex flex-col justify-center h-full">
                <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-3 font-bold">Atingimento Anual</p>
                <div className="flex items-baseline gap-1 justify-center mb-2">
                  <p className="text-xl lg:text-2xl font-bold text-primary tabular-nums">1%</p>
                  <p className="text-[9px] text-gray-500 dark:text-muted-foreground font-medium">de R$ 40,000 k</p>
                </div>
                <div className="w-full h-3.5 bg-gray-200 dark:bg-secondary rounded-none mb-2">
                  <div className="h-full bg-primary/80 w-[1%]" />
                </div>
                <p className="text-[9px] text-gray-400 dark:text-muted-foreground font-medium text-center">acumulado ano: R$ 543 k</p>
              </div>
            </div>
          </div>

          {/* Row 2: Comissionamento */}
          <div className="flex-1 min-h-[140px] border-t-[6px] border-t-primary bg-white dark:bg-card border border-border border-t-0 rounded-sm shadow-md p-4 flex flex-col">
            <h3 className="font-extrabold text-primary uppercase tracking-widest text-[13px] mb-4">Comissionamento</h3>
            <div className="flex-1 grid grid-cols-4 gap-4 lg:gap-8">
              {/* Col 1 */}
              <div className="flex flex-col justify-between h-full border-r border-border pr-4">
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-muted-foreground uppercase tracking-[0.2em] mb-1 font-bold">Atual</p>
                  <p className="text-2xl lg:text-3xl font-bold text-primary tabular-nums break-all tracking-tighter">-</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div>
                    <p className="text-[9px] text-gray-500 dark:text-muted-foreground uppercase tracking-[0.2em] mb-1 font-bold">Semana</p>
                    <p className="text-base lg:text-lg font-bold text-gray-900 dark:text-foreground tabular-nums tracking-tighter">+R$ 68.2 k</p>
                  </div>
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-[#8CC63F] mb-1" />
                </div>
              </div>
              {/* Col 2 */}
              <div className="flex flex-col justify-center h-full border-r border-border pr-4">
                <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-3 font-bold">Atingimento Mensal</p>
                <div className="flex items-baseline gap-1 justify-center mb-2">
                  <p className="text-xl lg:text-2xl font-bold text-primary tabular-nums">24%</p>
                  <p className="text-[9px] text-gray-500 dark:text-muted-foreground font-medium">De -R$ 286 k</p>
                </div>
                <div className="w-full h-3.5 bg-gray-200 dark:bg-secondary rounded-none mb-2">
                  <div className="h-full bg-primary/80 w-[24%]" />
                </div>
                <p className="text-[9px] text-gray-400 dark:text-muted-foreground font-medium text-center">acumulado mês atual: -R$ 68.2 k</p>
              </div>
              {/* Col 3 */}
              <div className="flex flex-col justify-center h-full border-r border-border pr-4">
                <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-2 font-bold">Evolução Semanal</p>
                <div className="h-16 w-full border border-primary/20 bg-orange-50/30 dark:bg-primary/5 rounded-xl p-2 relative flex items-end justify-center">
                   <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 40" preserveAspectRatio="none">
                     <path d="M20,30 L80,10" stroke="#FF6B00" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                     <circle cx="20" cy="30" r="3" fill="#FF6B00" />
                     <circle cx="80" cy="10" r="3" fill="#FF6B00" />
                   </svg>
                   <div className="w-full flex justify-between px-2 pb-0 z-20">
                      <span className="text-[8px] text-gray-400 dark:text-muted-foreground font-bold">S1</span>
                      <span className="text-[8px] text-gray-400 dark:text-muted-foreground font-bold">S2</span>
                   </div>
                </div>
              </div>
              {/* Col 4 */}
              <div className="flex flex-col justify-center h-full">
                <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-3 font-bold">Atingimento Anual</p>
                <div className="flex items-baseline gap-1 justify-center mb-2">
                  <p className="text-xl lg:text-2xl font-bold text-primary tabular-nums">2%</p>
                  <p className="text-[9px] text-gray-500 dark:text-muted-foreground font-medium">de R$ 5,000 k</p>
                </div>
                <div className="w-full h-3.5 bg-gray-200 dark:bg-secondary rounded-none mb-2">
                  <div className="h-full bg-primary/80 w-[2%]" />
                </div>
                <p className="text-[9px] text-gray-400 dark:text-muted-foreground font-medium text-center">acumulado ano: -R$ 101 k</p>
              </div>
            </div>
          </div>

          {/* Row 3: Renegociação */}
          <div className="flex-1 min-h-[140px] border-t-[6px] border-t-primary bg-white dark:bg-card border border-border border-t-0 rounded-sm shadow-md p-4 flex flex-col">
            <h3 className="font-extrabold text-primary uppercase tracking-widest text-[13px] mb-4">Renegociação</h3>
            <div className="flex-1 grid grid-cols-4 gap-4 lg:gap-8">
              {/* Col 1 */}
              <div className="flex flex-col justify-between h-full border-r border-border pr-4">
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-muted-foreground uppercase tracking-[0.2em] mb-1 font-bold">Atual</p>
                  <p className="text-2xl lg:text-3xl font-bold text-primary tabular-nums break-all tracking-tighter">R$ 3,893 k</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div>
                    <p className="text-[9px] text-gray-500 dark:text-muted-foreground uppercase tracking-[0.2em] mb-1 font-bold">Semana</p>
                    <p className="text-base lg:text-lg font-bold text-gray-900 dark:text-foreground tabular-nums tracking-tighter">+R$ 1,840 k</p>
                  </div>
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-[#8CC63F] mb-1" />
                </div>
              </div>
              {/* Col 2 */}
              <div className="flex flex-col justify-center h-full border-r border-border pr-4">
                <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-3 font-bold">Atingimento Mensal</p>
                <div className="flex items-baseline gap-1 justify-center mb-2">
                  <p className="text-xl lg:text-2xl font-bold text-primary tabular-nums">693%</p>
                  <p className="text-[9px] text-gray-500 dark:text-muted-foreground font-medium">de R$ 859 k</p>
                </div>
                <div className="w-full h-3.5 bg-gray-200 dark:bg-secondary rounded-none mb-2 overflow-hidden">
                  <div className="h-full bg-primary w-full" />
                </div>
                <p className="text-[9px] text-gray-400 dark:text-muted-foreground font-medium text-center">acumulado mês atual: R$ 5,946 k</p>
              </div>
              {/* Col 3 */}
              <div className="flex flex-col justify-center h-full border-r border-border pr-4">
                <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-2 font-bold">Evolução Semanal</p>
                <div className="h-16 w-full border border-primary/20 bg-orange-50/30 dark:bg-primary/5 rounded-xl p-2 relative flex items-end justify-center">
                   <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 40" preserveAspectRatio="none">
                     <path d="M20,30 L80,15" stroke="#FF6B00" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                     <circle cx="20" cy="30" r="3" fill="#FF6B00" />
                     <circle cx="80" cy="15" r="3" fill="#FF6B00" />
                   </svg>
                   <div className="w-full flex justify-between px-2 pb-0 z-20">
                      <span className="text-[8px] text-gray-400 dark:text-muted-foreground font-bold">S1</span>
                      <span className="text-[8px] text-gray-400 dark:text-muted-foreground font-bold">S2</span>
                   </div>
                </div>
              </div>
              {/* Col 4 */}
              <div className="flex flex-col justify-center h-full">
                <p className="text-[9px] text-primary uppercase tracking-[0.2em] text-center mb-3 font-bold">Atingimento Anual</p>
                <div className="flex items-baseline gap-1 justify-center mb-2">
                  <p className="text-xl lg:text-2xl font-bold text-primary tabular-nums">46%</p>
                  <p className="text-[9px] text-gray-500 dark:text-muted-foreground font-medium">de R$ 15,000 k</p>
                </div>
                <div className="w-full h-3.5 bg-gray-200 dark:bg-secondary rounded-none mb-2">
                  <div className="h-full bg-primary/80 w-[46%]" />
                </div>
                <p className="text-[9px] text-gray-400 dark:text-muted-foreground font-medium text-center">acumulado mês atual: R$ 6,945 k</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
