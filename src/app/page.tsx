'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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

  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('[data-anim="today-header"]', { opacity: 0, y: -16, duration: 0.5 })
        .from(
          '[data-anim="stat-card"]',
          { opacity: 0, y: 12, duration: 0.4, stagger: 0.08 },
          '-=0.2',
        );
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (!activeMeds.length) return;
      gsap.from('[data-anim="med-card"]', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
      });
    },
    { scope: rootRef, dependencies: [activeMeds.length] },
  );

  return (
    <main
      ref={rootRef}
      className="mx-auto w-full max-w-md sm:max-w-2xl px-5 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10"
    >
      <div data-anim="today-header">
        <TodayHeader date={today} />
      </div>
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
