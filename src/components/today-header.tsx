import { formatDatePtBR } from '@/lib/date';

export function TodayHeader({ date }: { date: string }) {
  return (
    <header className="space-y-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
        Hoje
      </p>
      <h1
        className="text-4xl sm:text-5xl font-semibold leading-[0.95] tracking-tight first-letter:capitalize text-balance"
        style={{ fontFamily: 'var(--font-fraunces), serif' }}
      >
        {formatDatePtBR(date)}
      </h1>
    </header>
  );
}
