import { formatDate } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  date?: Date;
}

export function SectionHeader({ title, date = new Date() }: SectionHeaderProps) {
  return (
    <div className="border-b border-white/5 pb-4 mb-6">
      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <p className="text-xs text-muted-foreground mt-1">
        {formatDate(date, 'dd/MM/yyyy')}
      </p>
    </div>
  );
}
