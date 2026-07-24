'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
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

  const itemRefs = useRef(new Map<string, HTMLLIElement>());

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
    <main className="mx-auto w-full max-w-2xl px-5 sm:px-8 py-10 sm:py-16 space-y-10">
      <header className="flex items-end justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="space-y-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Cadastro
          </p>
          <h1
            className="text-4xl sm:text-5xl font-semibold leading-[0.95] tracking-tight"
            style={{ fontFamily: 'var(--font-fraunces), serif' }}
          >
            Remédios
          </h1>
        </div>
        <Button
          onClick={openCreate}
          className="rounded-full h-11 px-5 shadow-sm hover:shadow"
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
        <div className="rounded-3xl border border-dashed border-border/70 p-12 text-center space-y-2">
          <p className="text-foreground/70 font-medium">
            Nenhum remédio cadastrado
          </p>
          <p className="text-sm text-muted-foreground">
            Clique em "Novo" pra começar.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {meds.map((med, i) => (
          <li
            key={med.id}
            ref={(el) => {
              if (el) itemRefs.current.set(med.id, el);
              else itemRefs.current.delete(med.id);
            }}
            className={cn(
              'group relative rounded-3xl border border-black/[0.04] px-6 py-5 flex items-center gap-4 transition-shadow hover:shadow-md/40 animate-in fade-in slide-in-from-bottom-2 duration-400',
              PALETTE[i % PALETTE.length],
            )}
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3
                  className="text-lg font-semibold text-foreground truncate leading-tight"
                  style={{ fontFamily: 'var(--font-fraunces), serif' }}
                >
                  {med.name}
                </h3>
                {!med.active && (
                  <span className="text-[9px] uppercase tracking-[0.15em] font-medium bg-background/70 text-foreground/60 rounded-full px-2 py-0.5">
                    Inativo
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/60">
                <span className="font-medium text-foreground/80">
                  {med.dosage}
                </span>
                <span className="mx-2 text-foreground/30">·</span>
                {[...med.times].sort().join(' · ')}
              </p>
              {med.notes && (
                <p className="text-xs text-foreground/50 italic truncate pt-0.5">
                  {med.notes}
                </p>
              )}
            </div>
            <div className="shrink-0 flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => openEdit(med)}
                aria-label="Editar"
                className="hover:bg-background/60 text-foreground/70 hover:text-foreground"
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleRemove(med)}
                disabled={remove.isPending}
                aria-label="Remover"
                className="hover:bg-destructive/10 text-foreground/50 hover:text-destructive"
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
