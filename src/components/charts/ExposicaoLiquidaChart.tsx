'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { ExposicaoAnual } from '@/src/types/energy';

interface ExposicaoLiquidaChartProps {
  data: ExposicaoAnual[];
}

const chartConfig = {
  exposicaoGwh: {
    label: 'Exposição (GWh)',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function ExposicaoLiquidaChart({ data }: ExposicaoLiquidaChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="ano" tickLine={false} axisLine={false} fontSize={11} />
        <YAxis tickLine={false} axisLine={false} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="exposicaoGwh" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.exposicaoGwh >= 0 ? '#22C55E' : '#EF4444'}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
