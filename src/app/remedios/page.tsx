'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicationForm } from '@/components/medication-form';
import { useMedications, MedicationInput } from '@/hooks/use-medications';
import { Medication } from '@/lib/api';

export default function RemediosPage() {
  const { listQuery, create, update, remove } = useMedications();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);

  const meds = listQuery.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (med: Medication) => {
    setEditing(med);
    setFormOpen(true);
  };

  const handleSubmit = (data: MedicationInput) => {
    if (editing) {
      update.mutate(
        { id: editing.id, data },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      create.mutate(data, { onSuccess: () => setFormOpen(false) });
    }
  };

  const handleRemove = (med: Medication) => {
    if (!confirm(`Remover "${med.name}"? Esta ação não pode ser desfeita.`))
      return;
    remove.mutate(med.id);
  };

  const isSubmitting = create.isPending || update.isPending;

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-2xl px-5 sm:px-6 py-8 sm:py-12 space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Cadastro
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.05]">
            Remédios
          </h1>
        </div>
        <Button onClick={openCreate} className="rounded-full" size="lg">
          <Plus /> Novo
        </Button>
      </header>

      {listQuery.isLoading && (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      )}
      {listQuery.error && (
        <p className="text-sm text-destructive">
          Erro ao carregar. API rodando em <code>localhost:3000</code>?
        </p>
      )}
      {!listQuery.isLoading && meds.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhum remédio cadastrado ainda.
        </div>
      )}

      <ul className="space-y-3">
        {meds.map((med) => (
          <li
            key={med.id}
            className="rounded-2xl bg-card border border-border/60 p-4 flex items-start justify-between gap-3"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground truncate">
                  {med.name}
                </p>
                {!med.active && (
                  <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                    Inativo
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {med.dosage} · {[...med.times].sort().join(', ')}
              </p>
              {med.notes && (
                <p className="text-xs text-muted-foreground italic truncate">
                  {med.notes}
                </p>
              )}
            </div>
            <div className="shrink-0 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => openEdit(med)}
                aria-label="Editar"
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleRemove(med)}
                disabled={remove.isPending}
                aria-label="Remover"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <MedicationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        med={editing}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
