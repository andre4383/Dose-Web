import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Medication } from '@/lib/api';

type Props = {
  med: Medication;
  isTaken: (medId: string, time: string) => boolean;
  onToggle: (medId: string, time: string) => void;
};

export function MedicationCard({ med, isTaken, onToggle }: Props) {
  const sortedTimes = [...med.times].sort();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{med.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{med.dosage}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {sortedTimes.map((time) => {
            const taken = isTaken(med.id, time);
            return (
              <Button
                key={time}
                variant={taken ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggle(med.id, time)}
                className="min-w-[84px]"
              >
                {taken && <Check className="size-4" />}
                {time}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
