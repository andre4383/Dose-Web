import { Flame, Percent, Trophy } from 'lucide-react';
import { StatCard } from './stat-card';
import { Stats } from '@/lib/api';

export function StatsRow({ stats }: { stats?: Stats }) {
  const streak = stats?.currentStreak ?? 0;
  const best = stats?.longestStreak ?? 0;
  return (
    <section className="grid grid-cols-3 gap-3">
      <StatCard
        icon={<Flame className="size-4" />}
        label="Sequência"
        value={streak}
        suffix={streak === 1 ? 'dia' : 'dias'}
      />
      <StatCard
        icon={<Percent className="size-4" />}
        label="Adesão 30d"
        value={stats?.adherenceRate ?? 0}
        suffix="%"
      />
      <StatCard
        icon={<Trophy className="size-4" />}
        label="Melhor"
        value={best}
        suffix={best === 1 ? 'dia' : 'dias'}
      />
    </section>
  );
}
