type SparklineVariant = 'success' | 'warning' | 'destructive';

interface TrendSparklineProps {
  data: number[];
  variant: SparklineVariant;
  className?: string;
}

const variantColors = {
  success: '#22C55E',
  warning: '#EAB308',
  destructive: '#EF4444',
};

export function TrendSparkline({ data, variant, className }: TrendSparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 18 - ((value - min) / range) * 16;
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox="0 0 60 20"
      className={className}
      style={{ width: '100%', height: '20px' }}
    >
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={variantColors[variant]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
