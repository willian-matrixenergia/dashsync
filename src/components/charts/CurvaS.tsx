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
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
      {
        label: '% Tendência',
        data: tendencia,
        borderColor: 'rgba(255, 74, 0, 0.4)',
        backgroundColor: 'rgba(255, 74, 0, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
      {
        label: '% Realizado',
        data: realizado,
        borderColor: '#FF4A00',
        backgroundColor: 'rgba(255, 74, 0, 0.1)',
        borderWidth: 4,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#FF4A00',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#151B1C',
        titleColor: '#FF4A00',
        bodyColor: '#F1F3F0',
        borderColor: 'rgba(255, 74, 0, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(241, 243, 240, 0.05)' },
        ticks: { color: 'rgba(241, 243, 240, 0.4)', font: { family: 'Lexend', size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(241, 243, 240, 0.4)', font: { family: 'Lexend', size: 10 } },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
