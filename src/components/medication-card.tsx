import { Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Medication } from '@/lib/api';
import { cn } from '@/lib/utils';

type Props = {
  med: Medication;
  colorIndex: number;
  isTaken: (medId: string, time: string) => boolean;
  onToggle: (medId: string, time: string) => void;
  onTakeNow: (medId: string) => void;
};

const PALETTE = [
  'bg-dose-yellow',
  'bg-dose-pink',
  'bg-dose-blue',
  'bg-dose-green',
];

export function MedicationCard({
  med,
  colorIndex,
  isTaken,
  onToggle,
  onTakeNow,
}: Props) {
  const bg = PALETTE[colorIndex % PALETTE.length];
  const sortedTimes = [...med.times].sort();
  const takenCount = sortedTimes.filter((t) => isTaken(med.id, t)).length;
  const total = sortedTimes.length;
  const allTaken = takenCount === total;

  return (
    <article
      className={cn(
        'rounded-[28px] p-6 sm:p-7 border border-black/[0.04] transition-shadow hover:shadow-md/40 animate-in fade-in slide-in-from-bottom-3 duration-500',
        bg,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3
            className="text-2xl sm:text-3xl font-semibold leading-[1.05] text-foreground tracking-tight"
            style={{ fontFamily: 'var(--font-fraunces), serif' }}
          >
            {med.name}
          </h3>
          <p className="text-sm text-foreground/60">{med.dosage}</p>
        </div>
        <span className="shrink-0 text-xs font-medium bg-background/70 text-foreground/70 rounded-full px-3 py-1 tabular-nums">
          {takenCount}/{total}
        </span>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        {sortedTimes.map((time) => {
          const taken = isTaken(med.id, time);
          return (
            <Button
              key={time}
              variant={taken ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onToggle(med.id, time)}
              className={cn(
                'min-w-[86px] rounded-full font-medium tabular-nums transition-all',
                !taken &&
                  'bg-background/70 hover:bg-background text-foreground shadow-none',
                taken && 'shadow-sm',
              )}
            >
              {taken && <Check className="size-3.5" />}
              {time}
            </Button>
          );
        })}
      </div>

      <Button
        onClick={() => onTakeNow(med.id)}
        disabled={allTaken}
        className="mt-5 w-full h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30 disabled:bg-foreground/30 font-medium"
      >
        <Zap className="size-4" />
        {allTaken ? 'Tudo tomado hoje' : 'Tomar agora'}
      </Button>
    </article>
  );
}
