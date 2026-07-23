import { formatDatePtBR } from '@/lib/date';

export function TodayHeader({ date }: { date: string }) {
  return (
    <header className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Hoje
      </p>
      <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.05] first-letter:capitalize">
        {formatDatePtBR(date)}
      </h1>
    </header>
  );
}
