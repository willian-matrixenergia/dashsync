import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { StressTestScenario } from '@/src/types/energy';

interface StressTestHeatmapProps {
  data: StressTestScenario[];
}

function getCellColor(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 80) return 'bg-destructive/30 text-destructive';
  if (abs >= 30) return 'bg-warning/30 text-warning';
  if (abs >= 10) return 'bg-warning/10 text-warning';
  return 'bg-muted text-muted-foreground';
}

const YEARS = [2026, 2027, 2028, 2029, 2030, 2031] as const;

export function StressTestHeatmap({ data }: StressTestHeatmapProps) {
  return (
    <div className="border border-white/5 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.02]">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-xs font-bold text-muted-foreground uppercase">
              ΔP PLD (R$/MWh)
            </TableHead>
            {YEARS.map((year) => (
              <TableHead key={year} className="text-xs font-bold text-muted-foreground uppercase text-right">
                {year}
              </TableHead>
            ))}
            <TableHead className="text-xs font-bold text-muted-foreground uppercase text-right">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.deltaPlD} className="border-white/5 hover:bg-white/[0.02]">
              <TableCell className="text-sm font-medium text-textMain">
                R$ {row.deltaPlD}/MWh
              </TableCell>
              {YEARS.map((year) => {
                const key = `ano${year}` as keyof StressTestScenario;
                const value = row[key] as number;
                return (
                  <TableCell key={year} className="text-sm text-right">
                    <span className={cn('px-2 py-0.5 rounded text-xs font-mono', getCellColor(value))}>
                      {value.toFixed(1)}
                    </span>
                  </TableCell>
                );
              })}
              <TableCell className="text-sm text-right">
                <span className={cn('px-2 py-0.5 rounded text-xs font-bold font-mono', getCellColor(row.total))}>
                  {row.total.toFixed(1)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
