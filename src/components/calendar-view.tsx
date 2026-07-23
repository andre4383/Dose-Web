'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarDay, DayStatus } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useCalendar } from '@/hooks/use-calendar';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const STATUS_STYLES: Record<DayStatus, string> = {
  complete: 'bg-dose-green text-foreground',
  partial: 'bg-dose-yellow text-foreground',
  none: 'bg-dose-pink text-foreground',
  'none-scheduled': 'bg-muted text-muted-foreground',
  future: 'bg-transparent text-muted-foreground/60 border border-border/40',
};

const STATUS_LABEL: Record<DayStatus, string> = {
  complete: 'Tudo tomado',
  partial: 'Parcial',
  none: 'Nenhum tomado',
  'none-scheduled': 'Sem remédios',
  future: 'Ainda por vir',
};

export function CalendarView() {
  const { month, prev, next, goToCurrent, isCurrent, query } = useCalendar();
  const [year, monthIdx] = month.split('-').map((s, i) => (i === 1 ? Number(s) - 1 : Number(s)));
  const monthLabel = MONTH_NAMES[monthIdx];

  const first = new Date(year, monthIdx, 1);
  const leadingBlanks = first.getDay();

  const days = query.data?.days ?? [];
  const daysMap = new Map(days.map((d) => [d.date, d]));

  const cells: (CalendarDay | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (const d of days) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Calendário
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
            {monthLabel} <span className="text-muted-foreground">{year}</span>
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={prev} className="rounded-full">
            <ChevronLeft className="size-4" />
          </Button>
          {!isCurrent && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToCurrent}
              className="rounded-full text-xs"
            >
              Hoje
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={next} className="rounded-full">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-[10px] sm:text-xs text-center font-medium uppercase tracking-wider text-muted-foreground pb-1"
          >
            {w}
          </div>
        ))}
        {cells.map((cell, i) => (
          <DayCell key={i} day={cell} />
        ))}
      </div>

      <Legend />

      {query.error && (
        <p className="text-sm text-destructive">
          Erro ao carregar calendário.
        </p>
      )}
    </div>
  );
}

function DayCell({ day }: { day: CalendarDay | null }) {
  if (!day) return <div className="aspect-square" />;
  const dayNum = Number(day.date.slice(-2));
  const style = STATUS_STYLES[day.status];
  return (
    <div
      title={`${day.date} · ${STATUS_LABEL[day.status]} (${day.taken}/${day.expected})`}
      className={cn(
        'aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-1',
        style,
      )}
    >
      <span className="text-sm sm:text-base font-semibold leading-none">
        {dayNum}
      </span>
      {day.expected > 0 && day.status !== 'future' && (
        <span className="text-[9px] sm:text-[10px] font-medium opacity-70 mt-0.5">
          {day.taken}/{day.expected}
        </span>
      )}
    </div>
  );
}

function Legend() {
  const items: { status: DayStatus; label: string }[] = [
    { status: 'complete', label: 'Tudo tomado' },
    { status: 'partial', label: 'Parcial' },
    { status: 'none', label: 'Nada tomado' },
    { status: 'none-scheduled', label: 'Sem remédio' },
    { status: 'future', label: 'Futuro' },
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-border/40">
      {items.map(({ status, label }) => (
        <div key={status} className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              'inline-block size-3 rounded-md',
              STATUS_STYLES[status],
            )}
          />
          <span className="text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
