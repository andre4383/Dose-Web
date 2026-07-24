import { Medication } from '@/lib/api';
import { MedicationCard } from './medication-card';

type Props = {
  meds: Medication[];
  isLoading: boolean;
  error: Error | null;
  isTaken: (medId: string, time: string) => boolean;
  onToggle: (medId: string, time: string) => void;
  onTakeNow: (medId: string) => void;
};

export function MedicationsList({
  meds,
  isLoading,
  error,
  isTaken,
  onToggle,
  onTakeNow,
}: Props) {
  return (
    <section className="space-y-4">
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

      <div className="space-y-3">
        {meds.map((m, i) => (
          <MedicationCard
            key={m.id}
            med={m}
            colorIndex={i}
            isTaken={isTaken}
            onToggle={onToggle}
            onTakeNow={onTakeNow}
          />
        ))}
      </div>
    </section>
  );
}
