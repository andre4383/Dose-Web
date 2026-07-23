'use client';

import { useToday } from '@/hooks/use-today';
import { TodayHeader } from '@/components/today-header';
import { StatsRow } from '@/components/stats-row';
import { MedicationsList } from '@/components/medications-list';

export default function HomePage() {
  const {
    today,
    medsQuery,
    statsQuery,
    activeMeds,
    isTaken,
    toggle,
    takeNow,
  } = useToday();

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-2xl px-5 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10">
      <TodayHeader date={today} />
      <StatsRow stats={statsQuery.data} />
      <MedicationsList
        meds={activeMeds}
        isLoading={medsQuery.isLoading}
        error={medsQuery.error}
        isTaken={isTaken}
        onToggle={toggle}
        onTakeNow={takeNow}
      />
    </main>
  );
}
