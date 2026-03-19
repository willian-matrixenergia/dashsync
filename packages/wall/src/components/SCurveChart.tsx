import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { SCurvePointDTO } from '@dashsync/shared';

interface SCurveChartProps {
  data: SCurvePointDTO[];
  height?: number;
}

export const SCurveChart = memo(function SCurveChart({ data, height = 280 }: SCurveChartProps) {
  const option = useMemo(() => {
    const semanas   = data.map(d => d.semana);
    const planejado = data.map(d => d.planejado);
    const realizado = data.map(d => d.realizado);
    const tendencia = data.map(d => d.tendencia);

    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', formatter: (params: unknown[]) => {
        const p = params as Array<{ seriesName: string; value: number; marker: string }>;
        return p.map(s => `${s.marker} ${s.seriesName}: <b>${s.value.toFixed(1)}%</b>`).join('<br/>');
      }},
      legend: { data: ['Planejado', 'Realizado', 'Tendência'], textStyle: { color: '#ccc' }, top: 4 },
      grid:   { left: 40, right: 16, top: 36, bottom: 36, containLabel: true },
      xAxis:  { type: 'category', data: semanas, axisLabel: { color: '#aaa', fontSize: 10, rotate: 45 } },
      yAxis:  { type: 'value', min: 0, max: 100, axisLabel: { color: '#aaa', formatter: '{value}%' } },
      series: [
        { name: 'Planejado',  type: 'line', smooth: true, data: planejado,
          lineStyle: { color: '#4a90e2', width: 2, type: 'dashed' },
          itemStyle: { color: '#4a90e2' } },
        { name: 'Realizado',  type: 'line', smooth: true, data: realizado,
          lineStyle: { color: '#34a853', width: 2.5 },
          itemStyle: { color: '#34a853' },
          areaStyle: { color: 'rgba(52,168,83,.1)' } },
        { name: 'Tendência',  type: 'line', smooth: true, data: tendencia,
          lineStyle: { color: '#fbbc04', width: 2, type: 'dotted' },
          itemStyle: { color: '#fbbc04' } },
      ],
    };
  }, [data]);

  return <ReactECharts option={option} style={{ height, width: '100%' }} />;
});
