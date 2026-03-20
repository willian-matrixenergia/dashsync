import { PortfolioMaster } from '../types';

interface KPICardsProps {
  projects: PortfolioMaster[];
}

export default function KPICards({ projects }: KPICardsProps) {
  const totalPotencia = projects.reduce((sum, p) => sum + (p.potencia_mw || 0), 0);
  const totalProjetos = projects.length;
  const mediaFisico =
    projects.reduce((sum, p) => sum + (p.avanco_fisico_real || 0), 0) / (projects.length || 1);
  const mediaFinanceiro =
    projects.reduce((sum, p) => sum + (p.avanco_financeiro_real || 0), 0) / (projects.length || 1);

  const cards = [
    {
      title: 'Potência Total',
      value: `${totalPotencia.toFixed(0)} MW`,
      icon: '⚡',
    },
    {
      title: 'Total de Projetos',
      value: totalProjetos.toString(),
      icon: '📁',
    },
    {
      title: 'Avanço Físico Médio',
      value: `${mediaFisico.toFixed(1)}%`,
      icon: '🏗️',
    },
    {
      title: 'Avanço Financeiro Médio',
      value: `${mediaFinanceiro.toFixed(1)}%`,
      icon: '💰',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-matrix-graphite border border-white/10 rounded-xl shadow-2xl p-6 transition-all hover:border-matrix-orange/50 group"
        >
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-matrix-offwhite/60 uppercase tracking-widest">{card.title}</p>
            <span className="text-xl group-hover:scale-110 transition-transform">{card.icon}</span>
          </div>
          <p className="text-3xl font-bold mt-4 text-white group-hover:text-matrix-orange transition-colors">{card.value}</p>
          <div className="h-1 w-0 bg-matrix-orange mt-4 transition-all group-hover:w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}
