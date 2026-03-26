'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { CashGenMonth } from '@/src/types/energy';

interface CashGenChartProps {
  data: CashGenMonth[];
}

const chartConfig = {
  esperado: {
    label: 'Esperado',
    color: 'var(--chart-1)',
  },
  realizado: {
    label: 'Realizado',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function CashGenChart({ data }: CashGenChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data} barGap={2}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={11} />
        <YAxis tickLine={false} axisLine={false} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="esperado" fill="var(--color-esperado)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="realizado" fill="var(--color-realizado)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
