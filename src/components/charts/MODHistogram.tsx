import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { EvolutionLabor } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MODHistogramProps {
  data: EvolutionLabor[];
}

export default function MODHistogram({ data }: MODHistogramProps) {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.semana).getTime() - new Date(b.semana).getTime(),
  );

  const labels = sortedData.map((d) => format(new Date(d.semana), 'dd/MM', { locale: ptBR }));
  const prevista = sortedData.map((d) => d.mod_prevista || 0);
  const real = sortedData.map((d) => d.mod_real || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'MOD Prevista',
        data: prevista,
        backgroundColor: '#a78bfa',
        borderColor: '#8b5cf6',
        borderWidth: 1,
      },
      {
        label: 'MOD Real',
        data: real,
        backgroundColor: '#34d399',
        borderColor: '#10b981',
        borderWidth: 1,
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
        grid: { color: 'rgba(107, 114, 128, 0.2)' },
        ticks: { color: '#9ca3af' },
      },
      x: {
        grid: { color: 'rgba(107, 114, 128, 0.2)' },
        ticks: { color: '#9ca3af' },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
