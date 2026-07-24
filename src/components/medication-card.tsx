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
      data-anim="med-card"
      className={cn(
        'rounded-3xl p-5 sm:p-6 shadow-sm/40 border border-black/5',
        bg,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-xl sm:text-2xl font-semibold leading-tight text-foreground">
            {med.name}
          </h3>
          <p className="text-sm text-foreground/70">{med.dosage}</p>
        </div>
        <span className="shrink-0 text-xs font-medium bg-background/60 text-foreground/70 rounded-full px-2.5 py-1">
          {takenCount}/{total}
        </span>
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        {sortedTimes.map((time) => {
          const taken = isTaken(med.id, time);
          return (
            <Button
              key={time}
              variant={taken ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onToggle(med.id, time)}
              className={cn(
                'min-w-[90px] rounded-full font-medium',
                !taken && 'bg-background/70 hover:bg-background text-foreground',
              )}
            >
              {taken && <Check className="size-4" />}
              {time}
            </Button>
          );
        })}
      </div>

      <Button
        onClick={() => onTakeNow(med.id)}
        disabled={allTaken}
        className="mt-4 w-full rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40"
        size="lg"
      >
        <Zap className="size-4" />
        {allTaken ? 'Tudo tomado hoje' : 'Tomar agora'}
      </Button>
    </article>
  );
}
