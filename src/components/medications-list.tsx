import { Sun, Sunset, Moon, Check } from 'lucide-react';
import { Medication } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  meds: Medication[];
  isLoading: boolean;
  error: Error | null;
  isTaken: (medId: string, time: string) => boolean;
  onToggle: (medId: string, time: string) => void;
};

type Period = {
  key: 'manha' | 'tarde' | 'noite';
  label: string;
  icon: typeof Sun;
  bg: string;
  matches: (hour: number) => boolean;
};

const PERIODS: Period[] = [
  {
    key: 'manha',
    label: 'Manhã',
    icon: Sun,
    bg: 'bg-dose-yellow',
    matches: (h) => h >= 5 && h < 12,
  },
  {
    key: 'tarde',
    label: 'Tarde',
    icon: Sunset,
    bg: 'bg-dose-pink',
    matches: (h) => h >= 12 && h < 18,
  },
  {
    key: 'noite',
    label: 'Noite',
    icon: Moon,
    bg: 'bg-dose-blue',
    matches: (h) => h >= 18 || h < 5,
  },
];

type Dose = { med: Medication; time: string };

function bucketDoses(meds: Medication[]) {
  const buckets: Record<Period['key'], Dose[]> = {
    manha: [],
    tarde: [],
    noite: [],
  };
  for (const med of meds) {
    for (const time of med.times) {
      const hour = parseInt(time.slice(0, 2), 10);
      const period = PERIODS.find((p) => p.matches(hour));
      if (period) buckets[period.key].push({ med, time });
    }
  }
  for (const key of Object.keys(buckets) as Period['key'][]) {
    buckets[key].sort((a, b) => a.time.localeCompare(b.time));
  }
  return buckets;
}

export function MedicationsList({
  meds,
  isLoading,
  error,
  isTaken,
  onToggle,
}: Props) {
  const buckets = bucketDoses(meds);

  return (
    <section className="space-y-6">
      <h2
        className="text-2xl sm:text-3xl font-semibold tracking-tight"
        style={{ fontFamily: 'var(--font-fraunces), serif' }}
      >
        Remédios de hoje
      </h2>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      )}

      {error && (
        <p className="text-sm text-destructive">
          Erro ao carregar. API rodando em <code>localhost:3000</code>?
        </p>
      )}

      {!isLoading && !error && meds.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhum remédio cadastrado ainda.
        </div>
      )}

      <div className="space-y-8">
        {PERIODS.map((period) => {
          const doses = buckets[period.key];
          if (doses.length === 0) return null;
          const total = doses.length;
          const takenCount = doses.filter((d) =>
            isTaken(d.med.id, d.time),
          ).length;
          const Icon = period.icon;

          return (
            <section key={period.key} className="space-y-3">
              <header className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-foreground/60" />
                  <h3
                    className="text-lg font-semibold tracking-tight"
                    style={{ fontFamily: 'var(--font-fraunces), serif' }}
                  >
                    {period.label}
                  </h3>
                </div>
                <span className="text-xs font-medium text-muted-foreground tabular-nums">
                  {takenCount}/{total}
                </span>
              </header>

              <ul className={cn('rounded-3xl border border-black/[0.04] divide-y divide-black/[0.05] overflow-hidden', period.bg)}>
                {doses.map((d) => {
                  const taken = isTaken(d.med.id, d.time);
                  return (
                    <li
                      key={`${d.med.id}-${d.time}`}
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      <span className="text-sm font-semibold text-foreground tabular-nums w-14 shrink-0">
                        {d.time}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'font-medium truncate transition-all',
                            taken
                              ? 'text-foreground/50 line-through decoration-foreground/40'
                              : 'text-foreground',
                          )}
                        >
                          {d.med.name}
                        </p>
                        <p className="text-xs text-foreground/60 truncate">
                          {d.med.dosage}
                        </p>
                      </div>
                      <Button
                        onClick={() => onToggle(d.med.id, d.time)}
                        variant={taken ? 'default' : 'secondary'}
                        size="icon-sm"
                        aria-label={taken ? 'Desmarcar' : 'Marcar como tomado'}
                        className={cn(
                          'rounded-full transition-all',
                          !taken &&
                            'bg-background/70 hover:bg-background text-foreground',
                          taken && 'shadow-sm',
                        )}
                      >
                        {taken && <Check className="size-3.5" />}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
