'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function useCalendar() {
  const [month, setMonth] = useState(currentMonth());

  const query = useQuery({
    queryKey: ['calendar', month],
    queryFn: () => api.calendar(month),
  });

  return {
    month,
    prev: () => setMonth((m) => shiftMonth(m, -1)),
    next: () => setMonth((m) => shiftMonth(m, 1)),
    goToCurrent: () => setMonth(currentMonth()),
    isCurrent: month === currentMonth(),
    query,
  };
}
