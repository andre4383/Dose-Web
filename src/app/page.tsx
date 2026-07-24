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
    <main className="mx-auto w-full max-w-2xl px-5 sm:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
        <TodayHeader date={today} />
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
        <StatsRow stats={statsQuery.data} />
      </div>
      <div className="animate-in fade-in duration-500 delay-200 fill-mode-both">
        <MedicationsList
          meds={activeMeds}
          isLoading={medsQuery.isLoading}
          error={medsQuery.error}
          isTaken={isTaken}
          onToggle={toggle}
          onTakeNow={takeNow}
        />
      </div>
    </main>
  );
}
