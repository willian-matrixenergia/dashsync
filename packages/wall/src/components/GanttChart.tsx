import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { ProjetoSummaryDTO } from '@dashsync/shared';

const CRITICIDADE_COLOR: Record<string, string> = {
  alto:  '#ea4335',
  medio: '#fbbc04',
  baixo: '#34a853',
};

interface GanttChartProps {
  projetos: ProjetoSummaryDTO[];
  height?: number;
}

export const GanttChart = memo(function GanttChart({ projetos, height = 360 }: GanttChartProps) {
  const option = useMemo(() => {
    const sortedByStart = [...projetos].sort(
      (a, b) => new Date(a.codPrevisto).getTime() - new Date(b.codPrevisto).getTime(),
    );

    const yData  = sortedByStart.map(p => p.nome);
    const series = sortedByStart.map((p, idx) => {
      const start = new Date(p.codPrevisto);
      const endMs = start.getTime() + (p.progressoFisico.previsto > 0
        ? (100 / p.progressoFisico.previsto) * 30 * 24 * 3_600_000
        : 180 * 24 * 3_600_000);
      return {
        type: 'custom',
        renderItem: (_params: unknown, api: { value: (i: number) => number; coord: (v: number[]) => number[]; size: (v: number[]) => number[]; style: () => unknown }) => {
          const x1 = api.coord([api.value(0), idx]);
          const x2 = api.coord([api.value(1), idx]);
          const barHeight = api.size([0, 1])[1]! * 0.5;
          return {
            type: 'rect',
            shape: { x: x1[0]!, y: x1[1]! - barHeight / 2, width: x2[0]! - x1[0]!, height: barHeight },
            style: api.style(),
          };
        },
        encode: { x: [0, 1], y: 2 },
        data: [[start.getTime(), endMs, idx]],
        itemStyle: { color: CRITICIDADE_COLOR[p.criticidade] ?? '#aaa', opacity: 0.8 },
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        formatter: (params: { dataIndex: number }) => {
          const p = sortedByStart[params.dataIndex];
          if (!p) return '';
          return `<b>${p.nome}</b><br/>COD: ${new Date(p.codPrevisto).toLocaleDateString('pt-BR')}<br/>
                  Físico: ${p.progressoFisico.realizado.toFixed(1)}% / ${p.progressoFisico.previsto.toFixed(1)}%`;
        },
      },
      grid: { left: 160, right: 20, top: 16, bottom: 40 },
      xAxis: {
        type: 'time',
        axisLabel: { color: '#aaa', formatter: (v: number) => new Date(v).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }) },
      },
      yAxis: { data: yData, axisLabel: { color: '#ccc', fontSize: 11, width: 150, overflow: 'truncate' } },
      series,
    };
  }, [projetos]);

  return <ReactECharts option={option} style={{ height, width: '100%' }} />;
});
