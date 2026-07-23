'use client';

import { useToday } from '@/hooks/use-today';
import { TodayHeader } from '@/components/today-header';
import { StatsRow } from '@/components/stats-row';
import { MedicationsList } from '@/components/medications-list';

export default function HomePage() {
  const { today, medsQuery, statsQuery, activeMeds, isTaken, toggle } =
    useToday();

  return (
    <main className="mx-auto w-full max-w-2xl p-6 space-y-6">
      <TodayHeader date={today} />
      <StatsRow stats={statsQuery.data} />
      <MedicationsList
        meds={activeMeds}
        isLoading={medsQuery.isLoading}
        error={medsQuery.error}
        isTaken={isTaken}
        onToggle={toggle}
      />
    </main>
  );
}
