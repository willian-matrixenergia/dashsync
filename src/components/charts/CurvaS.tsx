import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { EvolutionLabor } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface CurvaSProps {
  data: EvolutionLabor[];
}

export default function CurvaS({ data }: CurvaSProps) {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.semana).getTime() - new Date(b.semana).getTime(),
  );

  const labels = sortedData.map((d) => format(new Date(d.semana), 'dd/MM', { locale: ptBR }));
  const planejado = sortedData.map((d) => d.pct_planejado_lb || 0);
  const tendencia = sortedData.map((d) => d.pct_tendencia || 0);
  const realizado = sortedData.map((d) => d.pct_realizado || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: '% Planejado',
        data: planejado,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
      },
      {
        label: '% Tendência',
        data: tendencia,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#f59e0b',
      },
      {
        label: '% Realizado',
        data: realizado,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#d1d5db',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#d1d5db',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(107, 114, 128, 0.2)' },
        ticks: { color: '#9ca3af' },
      },
      x: {
        grid: { color: 'rgba(107, 114, 128, 0.2)' },
        ticks: { color: '#9ca3af' },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
