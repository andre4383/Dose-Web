const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  startDate: string;
  endDate: string | null;
  notes: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DoseLog = {
  id: string;
  medicationId: string;
  date: string;
  time: string;
  takenAt: string | null;
  createdAt: string;
};

export type Prescription = {
  id: string;
  issuedAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Stats = {
  currentStreak: number;
  longestStreak: number;
  adherenceRate: number;
};

export type DayStatus =
  | 'complete'
  | 'partial'
  | 'none'
  | 'none-scheduled'
  | 'future';

export type CalendarDay = {
  date: string;
  expected: number;
  taken: number;
  status: DayStatus;
};

export type Calendar = {
  month: string;
  days: CalendarDay[];
};

export const api = {
  medications: {
    list: () => request<Medication[]>('/medications'),
    get: (id: string) => request<Medication>(`/medications/${id}`),
    create: (data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt' | 'startDate'> & { startDate?: string }) =>
      request<Medication>('/medications', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>>) =>
      request<Medication>(`/medications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      request<{ deleted: boolean }>(`/medications/${id}`, { method: 'DELETE' }),
    listLogs: (id: string, from?: string, to?: string) => {
      const qs = new URLSearchParams();
      if (from) qs.set('from', from);
      if (to) qs.set('to', to);
      const q = qs.toString();
      return request<DoseLog[]>(`/medications/${id}/logs${q ? `?${q}` : ''}`);
    },
    markLog: (id: string, date: string, time: string) =>
      request<DoseLog>(`/medications/${id}/logs`, {
        method: 'POST',
        body: JSON.stringify({ date, time }),
      }),
    unmarkLog: (id: string, date: string, time: string) =>
      request<{ deleted: number }>(
        `/medications/${id}/logs?date=${date}&time=${time}`,
        { method: 'DELETE' },
      ),
  },
  prescriptions: {
    list: () => request<Prescription[]>('/prescriptions'),
    get: (id: string) => request<Prescription>(`/prescriptions/${id}`),
    create: (data: { issuedAt: string; notes?: string }) =>
      request<Prescription>('/prescriptions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: { issuedAt?: string; notes?: string }) =>
      request<Prescription>(`/prescriptions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      request<{ deleted: boolean }>(`/prescriptions/${id}`, { method: 'DELETE' }),
  },
  calendar: (month: string) =>
    request<Calendar>(`/calendar?month=${month}`),
  stats: () => request<Stats>('/stats'),
};
