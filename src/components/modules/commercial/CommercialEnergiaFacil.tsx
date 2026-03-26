"use client";

import { cn } from "@/lib/utils";

export function CommercialEnergiaFacil() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden text-card-foreground font-sans bg-background pb-8">
      {/* Header section superior - Dark */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#151B1C] border-b-4 border-primary">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold uppercase text-white tracking-widest">COMERCIAL – ENERGIA FÁCIL</h2>
          <span className="text-white/50 mx-2 text-xl font-light">|</span>
          <span className="text-white/80 text-sm tracking-wide">Semana 09Fev vs. Semana 02Fev</span>
        </div>
        <div className="text-primary font-bold tracking-widest text-sm">
          Fev - 2026
        </div>
      </div>
      
      {/* Faixa Cinza Subtítulo */}
      <div className="px-6 py-2 bg-[#F1F3F0] text-gray-800 font-bold text-xs tracking-widest border-b border-border dark:bg-muted dark:text-muted-foreground border-t border-primary">
        Funil de Vendas (# e R$ mil)
      </div>

      <div className="flex-1 p-4 lg:p-6 pb-8 bg-background overflow-hidden relative">
        <div className="grid grid-cols-3 gap-6 h-full">
           
           {/* Card 1: Originação */}
           <div className="flex flex-col bg-white dark:bg-card border border-border rounded-sm shadow-md overflow-hidden relative">
              <div className="bg-[#FF6B00] py-3 px-4 flex justify-between items-center relative z-10 border-b-2 border-orange-200/20 shadow-sm">
                <h3 className="text-white font-extrabold tracking-widest text-lg">01 ORIGINAÇÃO</h3>
                <span className="text-white font-bold opacity-80">#</span>
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-white/20" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-gray-500 italic mb-4">Originação de novos clientes</p>
                <div className="w-full h-px bg-gray-200 dark:bg-border mb-6" />

                <div className="flex justify-between items-start mb-6 relative">
                   <div>
                     <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Atual</p>
                     <p className="text-6xl font-black text-[#FF6B00] tabular-nums leading-none">86</p>
                     <p className="text-xs text-gray-400 mt-2"># clientes</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Semana</p>
                     <p className="text-4xl font-black text-gray-800 dark:text-gray-200 tabular-nums leading-none">+9</p>
                     <div className="flex items-center justify-end gap-1 mt-2">
                       <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-[#8CC63F]" />
                       <span className="text-xs font-bold text-[#8CC63F]">alta</span>
                     </div>
                   </div>
                   <div className="absolute right-0 top-16">
                     <span className="bg-[#8CC63F] text-white px-8 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-bold shadow-sm">
                       Confiante
                     </span>
                   </div>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] text-[#FF6B00] font-bold tracking-widest uppercase mb-2">Atingimento Mensal</p>
                  <p className="text-[11px] text-gray-400 font-medium">*Meta mensal com início em Abril de 2026</p>
                </div>

                <div className="mb-6 flex-1">
                  <p className="text-[10px] text-[#FF6B00] font-bold tracking-widest uppercase mb-3">Evolução Semanal</p>
                  <div className="h-28 w-full border border-orange-200/50 dark:border-primary/20 bg-orange-50/20 dark:bg-primary/5 rounded-xl p-4 relative flex items-end justify-center shadow-inner">
                     <div className="absolute inset-x-6 bottom-8 border-b border-gray-200 dark:border-gray-700" />
                     <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 40" preserveAspectRatio="none">
                       <path d="M20,25 L80,15" stroke="#FF6B00" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                       <circle cx="20" cy="25" r="4" fill="#FF6B00" />
                       <circle cx="80" cy="15" r="4" fill="#FF6B00" />
                     </svg>
                     <div className="w-full flex justify-between px-6 pb-0 z-20">
                        <span className="text-[10px] text-gray-400 font-bold">S1</span>
                        <span className="text-[10px] text-gray-400 font-bold">S2</span>
                     </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Atingimento Anual</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-base font-black text-gray-800 dark:text-gray-200">1%</span>
                    <span className="text-[10px] text-gray-400">de 21,923 contratos</span>
                  </div>
                  <div className="w-full h-3.5 bg-gray-200 dark:bg-secondary rounded-none">
                    <div className="h-full bg-gray-300 w-[1%]" />
                  </div>
                </div>

              </div>
           </div>

           {/* Card 2: Fechamento */}
           <div className="flex flex-col bg-white dark:bg-card border border-border rounded-sm shadow-md overflow-hidden relative">
              <div className="bg-[#C6651E] py-3 px-4 flex justify-between items-center relative z-10 border-b-2 border-orange-200/10 shadow-sm">
                <h3 className="text-white font-extrabold tracking-widest text-lg">02 FECHAMENTO</h3>
                <span className="text-white font-bold opacity-80">#</span>
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-white/20" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-gray-500 italic mb-4">Formalização e assinatura do novo contrato</p>
                <div className="w-full h-px bg-gray-200 dark:bg-border mb-6" />

                <div className="flex justify-between items-start mb-6 relative">
                   <div>
                     <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Atual</p>
                     <p className="text-6xl font-black text-[#C6651E] tabular-nums leading-none">9</p>
                     <p className="text-xs text-gray-400 mt-2"># clientes</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Semana</p>
                     <p className="text-4xl font-black text-gray-800 dark:text-gray-200 tabular-nums leading-none">+6</p>
                     <div className="flex items-center justify-end gap-1 mt-2">
                       <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-[#8CC63F]" />
                       <span className="text-xs font-bold text-[#8CC63F]">alta</span>
                     </div>
                   </div>
                   <div className="absolute right-0 top-16">
                     <span className="bg-[#8CC63F] text-white px-8 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-bold shadow-sm">
                       Confiante
                     </span>
                   </div>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] text-[#C6651E] font-bold tracking-widest uppercase mb-2">Atingimento Mensal</p>
                  <p className="text-[11px] text-gray-400 font-medium">*Meta mensal com início em Abril de 2026</p>
                </div>

                <div className="mb-6 flex-1">
                  <p className="text-[10px] text-[#C6651E] font-bold tracking-widest uppercase mb-3">Evolução Semanal</p>
                  <div className="h-28 w-full border border-orange-200/30 dark:border-primary/20 bg-orange-50/10 dark:bg-primary/5 rounded-xl p-4 relative flex items-end justify-center shadow-inner">
                     <div className="absolute inset-x-6 bottom-8 border-b border-gray-200 dark:border-gray-700" />
                     <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 40" preserveAspectRatio="none">
                       <path d="M20,28 L80,10" stroke="#C6651E" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                       <circle cx="20" cy="28" r="4" fill="#C6651E" />
                       <circle cx="80" cy="10" r="4" fill="#C6651E" />
                     </svg>
                     <div className="w-full flex justify-between px-6 pb-0 z-20">
                        <span className="text-[10px] text-gray-400 font-bold">S1</span>
                        <span className="text-[10px] text-gray-400 font-bold">S2</span>
                     </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Atingimento Anual</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-base font-black text-gray-800 dark:text-gray-200">1%</span>
                    <span className="text-[10px] text-gray-400">de 2,850 contratos</span>
                  </div>
                  <div className="w-full h-3.5 bg-gray-200 dark:bg-secondary rounded-none">
                     <div className="h-full bg-gray-300 w-[1%]" />
                  </div>
                </div>

              </div>
           </div>

           {/* Card 3: Faturamento */}
           <div className="flex flex-col bg-white dark:bg-card border border-border rounded-sm shadow-md overflow-hidden relative opacity-90">
              <div className="bg-[#8A4B1D] py-3 px-4 flex justify-between items-center relative z-10 shadow-sm">
                <h3 className="text-white font-extrabold tracking-widest text-lg">03 FATURAMENTO</h3>
                <span className="text-white font-bold opacity-80 text-sm">R$ MM</span>
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-white/10" />
              </div>
              <div className="p-5 flex-1 flex flex-col relative">
                <p className="text-xs text-gray-400 italic mb-4 opacity-70">Formalização e assinatura do novo contrato</p>
                <div className="w-full h-px bg-gray-200 dark:bg-border mb-6" />

                <div className="flex justify-between items-start mb-6">
                   <div className="opacity-50">
                     <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Atual</p>
                     <p className="text-6xl font-black text-gray-300 dark:text-gray-600 tabular-nums leading-none">-</p>
                     <p className="text-xs text-gray-400 mt-2">contratos</p>
                   </div>
                   <div className="text-right opacity-50">
                     <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Semana</p>
                     <p className="text-4xl font-black text-gray-300 dark:text-gray-600 tabular-nums leading-none">-</p>
                   </div>
                </div>

                <div className="mb-8 relative z-20">
                  <p className="text-[10px] text-gray-300 dark:text-gray-600 font-bold tracking-widest uppercase mb-2">Atingimento Mensal</p>
                  <p className="text-[11px] text-gray-300 dark:text-gray-600 font-medium">*Meta mensal com início em Abril de 2026</p>
                  <div className="w-full h-px bg-transparent my-1" />
                  <p className="font-extrabold text-[#8A4B1D] text-lg text-center bg-white/80 dark:bg-card/80 absolute top-8 left-0 right-0 z-30">
                    Faturamento de projetos ainda não iniciado
                  </p>
                </div>

                <div className="mb-6 flex-1 mt-6">
                  <p className="text-[10px] text-gray-300 dark:text-gray-600 font-bold tracking-widest uppercase mb-3">Evolução Semanal</p>
                  <div className="h-28 w-full border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-4" />
                </div>

                <div className="opacity-70">
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Atingimento Anual</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-base font-black text-gray-800 dark:text-gray-400">0%</span>
                    <span className="text-[10px] text-gray-400">de R$ 44,8 MM em contratos</span>
                  </div>
                  <div className="w-full h-3.5 bg-gray-100 dark:bg-secondary rounded-none" />
                </div>

              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
