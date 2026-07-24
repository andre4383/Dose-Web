'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, Medication } from '@/lib/api';

export type MedicationInput = {
  name: string;
  dosage: string;
  times: string[];
  startDate?: string;
  endDate: string | null;
  notes: string | null;
  active: boolean;
};

export function useMedications() {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['medications'],
    queryFn: () => api.medications.list(),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['medications'] });
    qc.invalidateQueries({ queryKey: ['stats'] });
  };

  const create = useMutation({
    mutationFn: (data: MedicationInput) => api.medications.create(data),
    onSuccess: () => {
      invalidate();
      toast.success('Remédio cadastrado');
    },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  const update = useMutation({
    mutationFn: (v: { id: string; data: Partial<Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      api.medications.update(v.id, v.data),
    onSuccess: () => {
      invalidate();
      toast.success('Remédio atualizado');
    },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.medications.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success('Remédio removido');
    },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  return { listQuery, create, update, remove };
}
