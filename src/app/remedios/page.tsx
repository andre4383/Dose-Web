'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicationForm } from '@/components/medication-form';
import { useMedications, MedicationInput } from '@/hooks/use-medications';
import { Medication } from '@/lib/api';
import { cn } from '@/lib/utils';

const PALETTE = [
  'bg-dose-yellow',
  'bg-dose-pink',
  'bg-dose-blue',
  'bg-dose-green',
];

export default function RemediosPage() {
  const { listQuery, create, update, remove } = useMedications();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);

  const meds = listQuery.data ?? [];

  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());

  useGSAP(
    () => {
      gsap.from('[data-anim="header"]', {
        opacity: 0,
        y: -16,
        duration: 0.5,
        ease: 'power2.out',
      });
      gsap.from('[data-anim="new-btn"]', {
        opacity: 0,
        scale: 0.85,
        duration: 0.4,
        delay: 0.15,
        ease: 'back.out(1.7)',
      });
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (!meds.length) return;
      gsap.from('[data-anim="med-item"]', {
        opacity: 0,
        y: 20,
        duration: 0.45,
        stagger: 0.07,
        ease: 'power3.out',
      });
    },
    { scope: listRef, dependencies: [meds.length] },
  );

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
    const el = itemRefs.current.get(med.id);
    if (el) {
      gsap.to(el, {
        opacity: 0,
        x: 40,
        scale: 0.95,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => remove.mutate(med.id),
      });
    } else {
      remove.mutate(med.id);
    }
  };

  const isSubmitting = create.isPending || update.isPending;

  return (
    <main
      ref={rootRef}
      className="mx-auto w-full max-w-md sm:max-w-2xl px-5 sm:px-6 py-8 sm:py-12 space-y-8"
    >
      <header
        data-anim="header"
        className="flex items-end justify-between gap-4"
      >
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Cadastro
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.05]">
            Remédios
          </h1>
        </div>
        <Button
          data-anim="new-btn"
          onClick={openCreate}
          className="rounded-full"
          size="lg"
        >
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

      <ul ref={listRef} className="space-y-3">
        {meds.map((med, i) => (
          <li
            key={med.id}
            data-anim="med-item"
            ref={(el) => {
              if (el) itemRefs.current.set(med.id, el);
              else itemRefs.current.delete(med.id);
            }}
            className={cn(
              'rounded-2xl border border-black/5 p-4 flex items-start justify-between gap-3',
              PALETTE[i % PALETTE.length],
            )}
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground truncate">
                  {med.name}
                </p>
                {!med.active && (
                  <span className="text-[10px] uppercase tracking-wider bg-background/60 text-foreground/70 rounded-full px-2 py-0.5">
                    Inativo
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/70">
                {med.dosage} · {[...med.times].sort().join(', ')}
              </p>
              {med.notes && (
                <p className="text-xs text-foreground/60 italic truncate">
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
