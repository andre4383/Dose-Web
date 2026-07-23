import { formatDatePtBR } from '@/lib/date';

export function TodayHeader({ date }: { date: string }) {
  return (
    <header className="space-y-1">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        Hoje
      </p>
      <h1 className="text-3xl font-semibold capitalize">
        {formatDatePtBR(date)}
      </h1>
    </header>
  );
}
