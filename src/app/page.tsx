'use client';

import { useMemo } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, DoseLog, Medication } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Flame, Percent, Trophy } from 'lucide-react';

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDatePtBR(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function HomePage() {
  const today = todayISO();
  const qc = useQueryClient();

  const medsQuery = useQuery({
    queryKey: ['medications'],
    queryFn: () => api.medications.list(),
  });

  const statsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.stats(),
  });

  const meds = medsQuery.data ?? [];
  const activeMeds = useMemo(() => meds.filter((m) => m.active), [meds]);

  const logsQueries = useQueries({
    queries: activeMeds.map((m) => ({
      queryKey: ['logs', m.id, today],
      queryFn: () => api.medications.listLogs(m.id, today, today),
    })),
  });

  const logsByMed = useMemo(() => {
    const map: Record<string, DoseLog[]> = {};
    activeMeds.forEach((m, i) => {
      map[m.id] = logsQueries[i]?.data ?? [];
    });
    return map;
  }, [activeMeds, logsQueries]);

  const mark = useMutation({
    mutationFn: (v: { medId: string; time: string }) =>
      api.medications.markLog(v.medId, today, v.time),
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ['logs', v.medId, today] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Marcado');
    },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  const unmark = useMutation({
    mutationFn: (v: { medId: string; time: string }) =>
      api.medications.unmarkLog(v.medId, today, v.time),
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ['logs', v.medId, today] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Desmarcado');
    },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  const isTaken = (medId: string, time: string) =>
    (logsByMed[medId] ?? []).some((l) => l.time === time && l.takenAt);

  return (
    <main className="mx-auto w-full max-w-2xl p-6 space-y-6">
      <header className="space-y-1">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Hoje
        </p>
        <h1 className="text-3xl font-semibold capitalize">
          {formatDatePtBR(today)}
        </h1>
      </header>

      <section className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Flame className="size-4" />}
          label="Sequência"
          value={statsQuery.data?.currentStreak ?? 0}
          suffix={statsQuery.data?.currentStreak === 1 ? 'dia' : 'dias'}
        />
        <StatCard
          icon={<Percent className="size-4" />}
          label="Adesão 30d"
          value={statsQuery.data?.adherenceRate ?? 0}
          suffix="%"
        />
        <StatCard
          icon={<Trophy className="size-4" />}
          label="Melhor"
          value={statsQuery.data?.longestStreak ?? 0}
          suffix={statsQuery.data?.longestStreak === 1 ? 'dia' : 'dias'}
        />
      </section>

      <section className="space-y-3">
        {medsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        )}
        {medsQuery.error && (
          <p className="text-sm text-destructive">
            Erro ao carregar remédios. API rodando em `localhost:3000`?
          </p>
        )}
        {!medsQuery.isLoading && activeMeds.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum remédio cadastrado ainda.
            </CardContent>
          </Card>
        )}
        {activeMeds.map((m) => (
          <MedicationCard
            key={m.id}
            med={m}
            isTaken={isTaken}
            onToggle={(time) => {
              if (isTaken(m.id, time)) {
                unmark.mutate({ medId: m.id, time });
              } else {
                mark.mutate({ medId: m.id, time });
              }
            }}
          />
        ))}
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">
          {value}
          {suffix && (
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {suffix}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

function MedicationCard({
  med,
  isTaken,
  onToggle,
}: {
  med: Medication;
  isTaken: (medId: string, time: string) => boolean;
  onToggle: (time: string) => void;
}) {
  const sortedTimes = [...med.times].sort();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{med.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{med.dosage}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {sortedTimes.map((time) => {
            const taken = isTaken(med.id, time);
            return (
              <Button
                key={time}
                variant={taken ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggle(time)}
                className="min-w-[84px]"
              >
                {taken && <Check className="size-4" />}
                {time}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
