'use client';

import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Medication } from '@/lib/api';
import { MedicationInput } from '@/hooks/use-medications';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  med?: Medication | null;
  onSubmit: (data: MedicationInput) => void;
  isSubmitting?: boolean;
};

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function MedicationForm({
  open,
  onOpenChange,
  med,
  onSubmit,
  isSubmitting,
}: Props) {
  const editing = !!med;
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    if (med) {
      setName(med.name);
      setDosage(med.dosage);
      setTimes(med.times.length ? [...med.times].sort() : ['08:00']);
      setStartDate(med.startDate?.slice(0, 10) ?? '');
      setEndDate(med.endDate?.slice(0, 10) ?? '');
      setNotes(med.notes ?? '');
      setActive(med.active);
    } else {
      setName('');
      setDosage('');
      setTimes(['08:00']);
      setStartDate('');
      setEndDate('');
      setNotes('');
      setActive(true);
    }
    setErrors([]);
  }, [open, med]);

  const setTime = (i: number, v: string) => {
    setTimes((prev) => prev.map((t, idx) => (idx === i ? v : t)));
  };
  const addTime = () => setTimes((prev) => [...prev, '12:00']);
  const removeTime = (i: number) =>
    setTimes((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!name.trim()) errs.push('Nome obrigatório');
    if (!dosage.trim()) errs.push('Dosagem obrigatória');
    const cleanTimes = times.map((t) => t.trim()).filter(Boolean);
    if (cleanTimes.length === 0) errs.push('Ao menos um horário');
    if (cleanTimes.some((t) => !TIME_RE.test(t)))
      errs.push('Horários no formato HH:MM');
    if (endDate && startDate && endDate < startDate)
      errs.push('Data fim antes do início');
    if (errs.length) {
      setErrors(errs);
      return;
    }
    onSubmit({
      name: name.trim(),
      dosage: dosage.trim(),
      times: Array.from(new Set(cleanTimes)).sort(),
      startDate: startDate || undefined,
      endDate: endDate || null,
      notes: notes.trim() || null,
      active,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Editar remédio' : 'Cadastrar remédio'}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? 'Atualize os dados do remédio.'
              : 'Preencha os dados para cadastrar um novo remédio.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="med-name">Nome</Label>
            <Input
              id="med-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Paracetamol"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="med-dosage">Dosagem</Label>
            <Input
              id="med-dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Ex: 500mg"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Horários</Label>
            <div className="space-y-2">
              {times.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={t}
                    onChange={(e) => setTime(i, e.target.value)}
                    className="flex-1"
                  />
                  {times.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeTime(i)}
                      aria-label="Remover horário"
                    >
                      <X />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTime}
              >
                <Plus /> Adicionar horário
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="med-start">Início</Label>
              <Input
                id="med-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="med-end">Fim (opcional)</Label>
              <Input
                id="med-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="med-notes">Notas (opcional)</Label>
            <Input
              id="med-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: tomar após refeição"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="size-4 rounded border-input"
            />
            Ativo
          </label>

          {errors.length > 0 && (
            <ul className="text-sm text-destructive space-y-0.5">
              {errors.map((err) => (
                <li key={err}>• {err}</li>
              ))}
            </ul>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando…' : editing ? 'Salvar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
