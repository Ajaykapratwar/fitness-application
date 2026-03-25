import { format, parseISO, isValid } from 'date-fns';

export function formatDisplayDate(value) {
  if (!value) return '—';
  const d = typeof value === 'string' ? parseISO(value) : value;
  if (!isValid(d)) return '—';
  return format(d, 'MMM dd, yyyy');
}

export function formatDateTime(value) {
  if (value == null) return '—';
  const d =
    typeof value === 'number'
      ? new Date(value)
      : typeof value === 'string'
        ? parseISO(value)
        : value;
  if (!isValid(d)) return '—';
  return format(d, 'MMM dd, yyyy HH:mm');
}

export function formatDurationMinutes(mins) {
  if (mins == null || mins === '') return '—';
  const n = Number(mins);
  if (Number.isNaN(n)) return '—';
  return `${n} min`;
}

export function formatNumber(n) {
  if (n == null || Number.isNaN(Number(n))) return '0';
  return Number(n).toLocaleString();
}
