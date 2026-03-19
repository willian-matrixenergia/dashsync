import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { LaborPointDTO } from '@dashsync/shared';

interface LaborHistogramProps {
  data: LaborPointDTO[];
  height?: number;
}

export const LaborHistogram = memo(function LaborHistogram({ data, height = 240 }: LaborHistogramProps) {
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['MOD Prevista', 'MOD Realizada'], textStyle: { color: '#ccc' }, top: 4 },
    grid:   { left: 40, right: 16, top: 36, bottom: 36, containLabel: true },
    xAxis:  { type: 'category', data: data.map(d => d.semana),
              axisLabel: { color: '#aaa', fontSize: 10, rotate: 45 } },
    yAxis:  { type: 'value', name: 'Pessoas', axisLabel: { color: '#aaa' } },
    series: [
      { name: 'MOD Prevista',  type: 'bar', data: data.map(d => d.modPrevista),
        itemStyle: { color: 'rgba(74,144,226,.6)' } },
      { name: 'MOD Realizada', type: 'bar', data: data.map(d => d.modRealizada),
        itemStyle: { color: '#34a853' } },
    ],
  }), [data]);

  return <ReactECharts option={option} style={{ height, width: '100%' }} />;
});
