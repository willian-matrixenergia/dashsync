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
      color: 'from-blue-600 to-blue-400',
    },
    {
      title: 'Total de Projetos',
      value: totalProjetos.toString(),
      color: 'from-purple-600 to-purple-400',
    },
    {
      title: 'Avanço Físico Médio',
      value: `${mediaFisico.toFixed(1)}%`,
      color: 'from-green-600 to-green-400',
    },
    {
      title: 'Avanço Financeiro Médio',
      value: `${mediaFinanceiro.toFixed(1)}%`,
      color: 'from-orange-600 to-orange-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${card.color} rounded-lg shadow-lg p-6 text-white`}
        >
          <p className="text-sm font-medium opacity-90">{card.title}</p>
          <p className="text-3xl font-bold mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
