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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'MOD Real',
        data: real,
        backgroundColor: '#FF4A00',
        borderColor: '#FF4A00',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: 'rgba(241, 243, 240, 0.6)',
          font: { family: 'Lexend', size: 10, weight: 'bold' as const },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#151B1C',
        titleColor: '#FF4A00',
        bodyColor: '#F1F3F0',
        borderColor: 'rgba(255, 74, 0, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(241, 243, 240, 0.05)' },
        ticks: { color: 'rgba(241, 243, 240, 0.4)', font: { family: 'Lexend', size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(241, 243, 240, 0.4)', font: { family: 'Lexend', size: 10 } },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
