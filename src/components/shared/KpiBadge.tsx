import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'warning' | 'destructive';

interface KpiBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function KpiBadge({ variant, children, className }: KpiBadgeProps) {
  const variantClasses = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <Badge className={cn(variantClasses[variant], 'border', className)}>
      {children}
    </Badge>
  );
}
