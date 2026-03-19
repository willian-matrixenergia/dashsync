import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { ProgressoDTO } from '@dashsync/shared';

interface SpeedometerProps {
  label:    string;
  progresso: ProgressoDTO;
}

export const Speedometer = memo(function Speedometer({ label, progresso }: SpeedometerProps) {
  const option = useMemo(() => ({
    series: [{
      type: 'gauge',
      min: 0, max: 100,
      splitNumber: 5,
      radius: '90%',
      axisLine: {
        lineStyle: {
          width: 14,
          color: [[0.3, '#ea4335'], [0.7, '#fbbc04'], [1, '#34a853']],
        },
      },
      pointer: { itemStyle: { color: 'auto' } },
      axisTick: { distance: -14, length: 6, lineStyle: { color: '#fff', width: 1 } },
      splitLine: { distance: -14, length: 14, lineStyle: { color: '#fff', width: 2 } },
      axisLabel: { color: '#aaa', fontSize: 10, distance: 18 },
      anchor: { show: true, showAbove: true, size: 12, itemStyle: { borderColor: '#fff', borderWidth: 2 } },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        color: '#e0e0e0',
        fontSize: 18,
        fontWeight: 'bold',
        offsetCenter: [0, '60%'],
      },
      data: [{ value: progresso.realizado, name: label }],
      title: { show: false },
    }],
    graphic: [{
      type: 'text',
      left: 'center', bottom: 4,
      style: { text: `Meta: ${progresso.previsto}%`, fill: '#888', fontSize: 11 },
    }],
    backgroundColor: 'transparent',
  }), [progresso, label]);

  return (
    <div className="speedometer-wrap" aria-label={`${label}: ${progresso.realizado}% realizado`}>
      <span className="speedometer-label">{label}</span>
      <ReactECharts option={option} style={{ height: 160, width: '100%' }} />
    </div>
  );
});
