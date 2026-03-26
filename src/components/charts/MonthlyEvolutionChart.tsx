'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface MonthlyEvolutionChartProps {
  data: any[];
  realKey: string;
  budgetKey: string;
  realLabel?: string;
  budgetLabel?: string;
}

export function MonthlyEvolutionChart({
  data,
  realKey,
  budgetKey,
  realLabel = 'Real',
  budgetLabel = 'Budget',
}: MonthlyEvolutionChartProps) {
  const chartConfig = {
    [realKey]: {
      label: realLabel,
      color: 'var(--chart-1)',
    },
    [budgetKey]: {
      label: budgetLabel,
      color: 'var(--chart-3)',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={11} />
        <YAxis tickLine={false} axisLine={false} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey={realKey}
          stroke={`var(--color-${realKey})`}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey={budgetKey}
          stroke={`var(--color-${budgetKey})`}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 3 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
