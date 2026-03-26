"use client";

import { cn } from "@/lib/utils";

export function CommercialBESS() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden text-card-foreground font-sans bg-background pb-8">
      {/* Header section superior - Dark */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#151B1C] border-b-4 border-primary">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold uppercase text-white tracking-widest">COMERCIAL – BESS</h2>
          <span className="text-white/50 mx-2 text-xl font-light">|</span>
          <span className="text-white/80 text-sm tracking-wide">Report Mensal Janeiro 2026</span>
        </div>
        <div className="text-primary font-bold tracking-widest text-sm">
          Fev - 2026
        </div>
      </div>
      
      {/* Faixa Cinza Subtítulo */}
      <div className="px-6 py-2 bg-[#F1F3F0] text-gray-800 font-bold text-xs tracking-widest border-b border-border dark:bg-muted dark:text-muted-foreground border-t border-primary">
        Rentabilização dos Contratos - BESS
      </div>

      <div className="flex-1 p-4 lg:p-6 pb-8 bg-background overflow-hidden relative">
        <div className="flex flex-col h-full bg-white dark:bg-card border border-border rounded-sm shadow-md overflow-hidden relative min-w-[1200px] overflow-x-auto">
          
          {/* Header das Colunas */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_2fr_1.5fr] items-center py-3 border-b-2 border-[#FF6B00] bg-white dark:bg-card">
              <div className="text-[10px] text-[#C6651E] font-black tracking-widest uppercase text-center px-4">INDICADOR</div>
              <div className="text-[10px] text-[#C6651E] font-black tracking-widest uppercase text-center px-4">VALOR ATUAL</div>
              <div className="text-[10px] text-[#C6651E] font-black tracking-widest uppercase text-center px-4">VS MÊS<br/>ANTERIOR</div>
              <div className="text-[10px] text-[#C6651E] font-black tracking-widest uppercase text-center px-4">ATINGIMENTO MENSAL</div>
              <div className="text-[10px] text-[#C6651E] font-black tracking-widest uppercase text-center px-4">EVOLUÇÃO 2026</div>
              <div className="text-[10px] text-[#C6651E] font-black tracking-widest uppercase text-center px-4">ATINGIMENTO ANUAL</div>
          </div>

          <div className="flex flex-col gap-2 p-3 overflow-y-auto">
             
             {/* Row 1 */}
             <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_2fr_1.5fr] border border-border min-h-[160px] relative bg-white dark:bg-card shadow-sm">
                {/* Pilar de Borda */}
                <div className="absolute left-0 top-2 bottom-2 w-2 bg-[#FF6B00]" />
                
                {/* Indicador */}
                <div className="pl-6 pr-4 py-4 flex flex-col justify-center border-r border-border/40">
                  <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-200 leading-tight mb-4">Capacidade Instalada Faturando</h3>
                  <div className="border border-[#FF6B00] rounded-md py-1 border-opacity-40 text-center xl:w-2/3">
                    <span className="text-[#FF6B00] font-bold text-xs">MWh</span>
                  </div>
                </div>

                {/* Valor Atual */}
                <div className="flex flex-col items-center justify-center border-r border-border/40">
                  <span className="text-5xl font-black text-[#FF6B00] tabular-nums mt-4">86.4</span>
                  <span className="text-[10px] text-gray-400 mt-6">mês anterior: -</span>
                </div>

                {/* VS Mês Anterior */}
                <div className="flex items-center justify-center border-r border-border/40">
                   <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-muted shadow-sm mt-[-10px]">
                     <span className="text-xs font-bold text-gray-600 dark:text-gray-300">No Data</span>
                   </div>
                </div>

                {/* Atingimento Mensal */}
                <div className="flex flex-col justify-center px-6 relative border-r border-border/40 pb-4">
                   <div className="flex items-end gap-3 w-full">
                     <div className="flex flex-col">
                        <span className="text-4xl font-black text-[#FF6B00]">105%</span>
                        <span className="text-[10px] text-gray-400">de 82.5 MWh</span>
                     </div>
                     <div className="h-6 flex-1 bg-gray-200 dark:bg-gray-700/50 mb-4 relative z-0 min-w-[100px]">
                        <div className="h-full bg-[#FF6B00] absolute inset-0 z-10 -right-4 shadow-sm" />
                     </div>
                   </div>
                   <div className="absolute bottom-4 right-4 z-20">
                     <span className="bg-[#8CC63F] text-white px-4 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-bold shadow-sm">
                       Confiante
                     </span>
                   </div>
                </div>

                {/* Evolução 2026 */}
                <div className="flex items-center justify-center px-6 border-r border-border/40 py-3">
                   <div className="w-full h-full border border-orange-200/60 dark:border-primary/30 bg-orange-50/10 dark:bg-primary/5 rounded-xl p-3 flex flex-col justify-between shadow-inner relative">
                     <div className="flex-1 relative mb-2 w-full mx-auto">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                           <path d="M5,30 L15,28 L30,15 L50,15 L95,13" fill="none" stroke="#666" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
                        </svg>
                        <span className="absolute left-0 bottom-1 text-[9px] font-bold text-[#FF6B00]">82.5</span>
                        <span className="absolute left-[8%] bottom-6 text-[9px] font-bold text-[#FF6B00]">86.4</span>
                        <span className="absolute right-0 top-0 text-[10px] font-bold text-gray-700 dark:text-gray-300">160.4</span>
                     </div>
                     <div className="flex justify-between w-full text-[8px] text-gray-400 font-bold uppercase border-t border-gray-200 pt-1">
                        <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
                     </div>
                   </div>
                </div>

                {/* Atingimento Anual */}
                <div className="flex flex-col items-center justify-center px-6 relative">
                   <div className="flex items-end gap-2 w-full mb-1">
                     <div className="flex flex-col">
                        <span className="text-3xl font-black text-gray-400">54%</span>
                     </div>
                     <div className="h-4 flex-1 bg-gray-200 dark:bg-gray-700/50 mb-2 relative min-w-[80px]">
                        <div className="h-full bg-[#FF6B00] absolute left-0" style={{width: '54%'}} />
                        <div className="absolute top-0 bottom-0 left-[54%] border-l border-dashed border-gray-500 z-20 h-8 -mt-2" />
                        <span className="absolute left-[56%] -top-4 text-[10px] font-bold text-gray-500 z-20">54%</span>
                     </div>
                   </div>
                   <div className="w-full text-left max-w-[200px]">
                      <span className="text-[9px] text-gray-400 block mb-6 px-1">de 160.4 MWh</span>
                   </div>
                   <span className="text-[10px] font-medium text-gray-400 italic absolute bottom-4">Ano</span>
                </div>
             </div>

             {/* Row 2 */}
             <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_2fr_1.5fr] border border-border min-h-[160px] relative bg-white dark:bg-card shadow-sm">
                <div className="absolute left-0 top-2 bottom-2 w-2 bg-[#D2691E]" />
                
                <div className="pl-6 pr-4 py-4 flex flex-col justify-center border-r border-border/40">
                  <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-200 leading-tight mb-4">MWh Médio por Projeto</h3>
                  <div className="border border-[#D2691E] rounded-md py-1 border-opacity-40 text-center xl:w-2/3">
                    <span className="text-[#D2691E] font-bold text-[10px]">R$ mil / MWh</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-r border-border/40">
                  <span className="text-5xl font-black text-[#D2691E] tabular-nums mt-4">16.9</span>
                  <span className="text-[10px] text-gray-400 mt-6">mês anterior: -</span>
                </div>

                <div className="flex items-center justify-center border-r border-border/40">
                   <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-muted shadow-sm mt-[-10px]">
                     <span className="text-xs font-bold text-gray-600 dark:text-gray-300">No Data</span>
                   </div>
                </div>

                <div className="flex flex-col justify-center px-6 relative border-r border-border/40 pb-4">
                   <div className="flex items-end gap-3 w-full">
                     <div className="flex flex-col">
                        <span className="text-4xl font-black text-[#D2691E]">94%</span>
                        <span className="text-[10px] text-gray-400">de 17.9 R$ mil / MWh</span>
                     </div>
                     <div className="h-6 flex-1 bg-gray-200 dark:bg-gray-700/50 mb-4 relative z-0 min-w-[100px]">
                        <div className="h-full bg-[#D2691E]" style={{width: '94%'}} />
                     </div>
                   </div>
                   <div className="absolute bottom-4 right-4 z-20">
                     <span className="bg-[#8CC63F] text-white px-4 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-bold shadow-sm">
                       Confiante
                     </span>
                   </div>
                </div>

                <div className="flex items-center justify-center px-6 border-r border-border/40 py-3">
                   <div className="w-full h-full border border-orange-200/60 dark:border-primary/30 bg-orange-50/10 dark:bg-primary/5 rounded-xl p-3 flex flex-col justify-between shadow-inner relative">
                     <div className="flex-1 relative mb-2 w-full mx-auto">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                           <path d="M5,25 L15,22 L30,12 L50,12 L95,12" fill="none" stroke="#666" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
                        </svg>
                        <span className="absolute left-0 bottom-4 text-[9px] font-bold text-[#D2691E]">16.9</span>
                        <span className="absolute left-[8%] bottom-[50%] text-[9px] font-bold text-[#D2691E]">17.9</span>
                        <span className="absolute right-0 top-0 text-[10px] font-bold text-gray-700 dark:text-gray-300">21.8</span>
                     </div>
                     <div className="flex justify-between w-full text-[8px] text-gray-400 font-bold uppercase border-t border-gray-200 pt-1">
                        <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
                     </div>
                   </div>
                </div>

                <div className="flex flex-col items-center justify-center px-6 relative">
                   <div className="flex items-end gap-2 w-full mb-1">
                     <div className="flex flex-col">
                        <span className="text-3xl font-black text-gray-400">78%</span>
                     </div>
                     <div className="h-4 flex-1 bg-gray-200 dark:bg-gray-700/50 mb-2 relative min-w-[80px]">
                        <div className="h-full bg-[#D2691E] absolute left-0" style={{width: '78%'}} />
                        <div className="absolute top-0 bottom-0 left-[82%] border-l border-dashed border-[#D2691E] z-20 h-8 -mt-2" />
                        <span className="absolute left-[84%] -top-4 text-[10px] font-bold text-gray-500 z-20">82%</span>
                     </div>
                   </div>
                   <div className="w-full text-left max-w-[200px]">
                      <span className="text-[9px] text-gray-400 block mb-6 px-1">de 21.8 R$ mil / MWh</span>
                   </div>
                   <span className="text-[10px] font-medium text-gray-400 italic absolute bottom-4">Ano</span>
                </div>
             </div>

             {/* Row 3 */}
             <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_2fr_1.5fr] border border-border min-h-[160px] relative bg-white dark:bg-card shadow-sm opacity-95">
                <div className="absolute left-0 top-2 bottom-2 w-2 bg-[#8B4513]" />
                
                <div className="pl-6 pr-4 py-4 flex flex-col justify-center border-r border-border/40">
                  <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-200 leading-tight mb-4">Faturamento Total</h3>
                  <div className="border border-[#8B4513] rounded-md py-1 border-opacity-40 text-center xl:w-2/3 bg-orange-50/30 dark:bg-transparent">
                    <span className="text-[#8B4513] font-bold text-xs">R$ mil</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-r border-border/40">
                  <span className="text-5xl font-black text-[#8B4513] tabular-nums mt-4 tracking-tighter">1,610</span>
                  <span className="text-[10px] text-gray-400 mt-6">mês anterior: -</span>
                </div>

                <div className="flex items-center justify-center border-r border-border/40">
                   <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-muted shadow-sm mt-[-10px]">
                     <span className="text-xs font-bold text-gray-600 dark:text-gray-300">No Data</span>
                   </div>
                </div>

                <div className="flex flex-col justify-center px-6 relative border-r border-border/40 pb-4">
                   <div className="flex items-end gap-3 w-full">
                     <div className="flex flex-col">
                        <span className="text-4xl font-black text-[#8B4513]">106%</span>
                        <span className="text-[10px] text-gray-400">de 1,515.0 R$ mil</span>
                     </div>
                     <div className="h-6 flex-1 bg-gray-200 dark:bg-gray-700/50 mb-4 relative z-0 min-w-[100px]">
                        <div className="h-full bg-[#8B4513] absolute inset-0 z-10 -right-4 shadow-sm" />
                     </div>
                   </div>
                   <div className="absolute bottom-4 right-4 z-20">
                     <span className="bg-[#8CC63F] text-white px-4 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-bold shadow-sm">
                       Confiante
                     </span>
                   </div>
                </div>

                <div className="flex items-center justify-center px-6 border-r border-border/40 py-3">
                   <div className="w-full h-full border border-orange-200/60 dark:border-primary/30 bg-orange-50/10 dark:bg-primary/5 rounded-xl p-3 flex flex-col justify-between shadow-inner relative">
                     <div className="flex-1 relative mb-2 w-full mx-auto">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                           <path d="M5,35 L15,25 L30,5 L50,5 L95,5" fill="none" stroke="#666" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
                        </svg>
                        <span className="absolute left-0 bottom-0 text-[9px] font-bold text-[#8B4513]">1,515</span>
                        <span className="absolute left-[8%] bottom-6 text-[9px] font-bold text-[#8B4513]">1,610</span>
                        <span className="absolute right-0 -top-1 text-[10px] font-bold text-gray-700 dark:text-gray-300">3,574</span>
                     </div>
                     <div className="flex justify-between w-full text-[8px] text-gray-400 font-bold uppercase border-t border-gray-200 pt-1">
                        <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
                     </div>
                   </div>
                </div>

                <div className="flex flex-col items-center justify-center px-6 relative">
                   <div className="flex items-end gap-2 w-full mb-1">
                     <div className="flex flex-col">
                        <span className="text-3xl font-black text-gray-400">4%</span>
                     </div>
                     <div className="h-4 flex-1 bg-gray-200 dark:bg-gray-700/50 mb-2 relative min-w-[80px]">
                        <div className="h-full bg-[#8B4513] absolute left-0" style={{width: '4%'}} />
                        <div className="absolute top-0 bottom-0 left-[4%] border-l border-dashed border-[#8B4513] z-20 h-8 -mt-2" />
                        <span className="absolute left-[8%] -top-4 text-[10px] font-bold text-gray-500 z-20">4%</span>
                     </div>
                   </div>
                   <div className="w-full text-left max-w-[200px]">
                      <span className="text-[8px] text-gray-400 block mb-6 px-1">de 36,577.0 R$ mil</span>
                   </div>
                   <span className="text-[10px] font-medium text-gray-400 italic absolute bottom-4">Ano</span>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}
