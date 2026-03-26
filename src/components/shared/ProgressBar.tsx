import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type ProgressVariant = 'success' | 'warning' | 'destructive';

interface ProgressBarProps {
  value: number; // 0-100
  variant: ProgressVariant;
  showLabel?: boolean;
  className?: string;
}

const variantClasses = {
  success: '[&_[data-slot=progress-indicator]]:bg-success',
  warning: '[&_[data-slot=progress-indicator]]:bg-warning',
  destructive: '[&_[data-slot=progress-indicator]]:bg-destructive',
};

export function ProgressBar({
  value,
  variant,
  showLabel = false,
  className,
}: ProgressBarProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Progress value={value} className={cn("h-2", variantClasses[variant])} />
      {showLabel && (
        <p className="text-xs text-muted-foreground text-right">{value}%</p>
      )}
    </div>
  );
}
