'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, DoseLogWithMed } from '@/lib/api';
import { todayISO } from '@/lib/date';
import { Clock } from 'lucide-react';

function formatDayLabel(iso: string) {
  const today = todayISO();
  if (iso === today) return 'Hoje';
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(today);
  const day = new Date(y, m - 1, d);
  const diff = Math.round((t.getTime() - day.getTime()) / 86400000);
  if (diff === 1) return 'Ontem';
  return day.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatExactTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function HistoricoPage() {
  const logsQuery = useQuery({
    queryKey: ['logs-all'],
    queryFn: () => api.logs.list(),
  });

  const groups = useMemo(() => {
    const logs = logsQuery.data ?? [];
    const withTaken = logs.filter((l) => l.takenAt);
    const map = new Map<string, DoseLogWithMed[]>();
    for (const l of withTaken) {
      const key = l.date.slice(0, 10);
      const arr = map.get(key) ?? [];
      arr.push(l);
      map.set(key, arr);
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [logsQuery.data]);

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-2xl px-5 sm:px-6 py-8 sm:py-12 space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Registro
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.05]">
          Histórico
        </h1>
      </header>

      {logsQuery.isLoading && (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      )}
      {logsQuery.error && (
        <p className="text-sm text-destructive">
          Erro ao carregar. API rodando em <code>localhost:3000</code>?
        </p>
      )}
      {!logsQuery.isLoading && groups.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhuma dose registrada ainda.
        </div>
      )}

      <div className="space-y-8">
        {groups.map(([date, items]) => (
          <section key={date} className="space-y-3">
            <h2 className="text-lg font-semibold capitalize">
              {formatDayLabel(date)}
            </h2>
            <ul className="space-y-2">
              {items.map((log) => (
                <li
                  key={log.id}
                  className="rounded-2xl bg-card border border-border/60 p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {log.medication.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.medication.dosage} · agendado {log.time}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 text-sm font-medium bg-muted rounded-full px-3 py-1.5">
                    <Clock className="size-3.5" />
                    {log.takenAt ? formatExactTime(log.takenAt) : '—'}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
