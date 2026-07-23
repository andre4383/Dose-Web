import { Card, CardContent } from '@/components/ui/card';
import { Medication } from '@/lib/api';
import { MedicationCard } from './medication-card';

type Props = {
  meds: Medication[];
  isLoading: boolean;
  error: Error | null;
  isTaken: (medId: string, time: string) => boolean;
  onToggle: (medId: string, time: string) => void;
};

export function MedicationsList({
  meds,
  isLoading,
  error,
  isTaken,
  onToggle,
}: Props) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando…</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-destructive">
        Erro ao carregar remédios. API rodando em `localhost:3000`?
      </p>
    );
  }
  if (meds.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhum remédio cadastrado ainda.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      {meds.map((m) => (
        <MedicationCard
          key={m.id}
          med={m}
          isTaken={isTaken}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
