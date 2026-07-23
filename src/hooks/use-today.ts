'use client';

import { useMemo } from 'react';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, DoseLog } from '@/lib/api';
import { todayISO } from '@/lib/date';

export function useToday() {
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

  const activeMeds = useMemo(
    () => (medsQuery.data ?? []).filter((m) => m.active),
    [medsQuery.data],
  );

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

  const isTaken = (medId: string, time: string) =>
    (logsByMed[medId] ?? []).some((l) => l.time === time && l.takenAt);

  const invalidate = (medId: string) => {
    qc.invalidateQueries({ queryKey: ['logs', medId, today] });
    qc.invalidateQueries({ queryKey: ['stats'] });
  };

  const mark = useMutation({
    mutationFn: (v: { medId: string; time: string }) =>
      api.medications.markLog(v.medId, today, v.time),
    onSuccess: (_, v) => {
      invalidate(v.medId);
      toast.success('Marcado');
    },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  const unmark = useMutation({
    mutationFn: (v: { medId: string; time: string }) =>
      api.medications.unmarkLog(v.medId, today, v.time),
    onSuccess: (_, v) => {
      invalidate(v.medId);
      toast.success('Desmarcado');
    },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  const toggle = (medId: string, time: string) => {
    if (isTaken(medId, time)) unmark.mutate({ medId, time });
    else mark.mutate({ medId, time });
  };

  const takeNow = (medId: string) => {
    const med = activeMeds.find((m) => m.id === medId);
    if (!med) return;
    const sortedTimes = [...med.times].sort();
    const pending = sortedTimes.find((t) => !isTaken(medId, t));
    if (!pending) {
      toast.info('Todos os horários de hoje já foram marcados');
      return;
    }
    mark.mutate({ medId, time: pending });
  };

  return {
    today,
    medsQuery,
    statsQuery,
    activeMeds,
    isTaken,
    toggle,
    takeNow,
  };
}
