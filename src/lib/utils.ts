import type { Locale } from './i18n';

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

export const COMMON_TIMEZONES: TimezoneOption[] = [
  { value: 'America/Mexico_City',    label: 'Ciudad de México',       offset: 'CDT (UTC-5)' },
  { value: 'America/Monterrey',      label: 'Monterrey',              offset: 'CDT (UTC-5)' },
  { value: 'America/Guadalajara',    label: 'Guadalajara',            offset: 'CDT (UTC-5)' },
  { value: 'America/New_York',       label: 'Nueva York / Miami',     offset: 'EDT (UTC-4)' },
  { value: 'America/Chicago',        label: 'Chicago / Houston',      offset: 'CDT (UTC-5)' },
  { value: 'America/Denver',         label: 'Denver / Phoenix',       offset: 'MDT (UTC-6)' },
  { value: 'America/Los_Angeles',    label: 'Los Ángeles / Seattle',  offset: 'PDT (UTC-7)' },
  { value: 'America/Toronto',        label: 'Toronto',                offset: 'EDT (UTC-4)' },
  { value: 'America/Vancouver',      label: 'Vancouver',              offset: 'PDT (UTC-7)' },
  { value: 'America/Bogota',         label: 'Bogotá / Lima',          offset: 'COT (UTC-5)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires',   offset: 'ART (UTC-3)' },
  { value: 'America/Sao_Paulo',      label: 'São Paulo',              offset: 'BRT (UTC-3)' },
  { value: 'Europe/Madrid',          label: 'Madrid',                 offset: 'CEST (UTC+2)' },
  { value: 'Europe/London',          label: 'Londres',                offset: 'BST (UTC+1)' },
  { value: 'UTC',                    label: 'UTC',                    offset: 'UTC+0' },
];

export function formatMatchTime(utcDatetime: string, timezone: string, locale: Locale): string {
  const date = new Date(utcDatetime);
  return date.toLocaleTimeString(locale === 'es' ? 'es-MX' : 'en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatMatchDate(utcDatetime: string, timezone: string, locale: Locale): string {
  const date = new Date(utcDatetime);
  return date.toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
    timeZone: timezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDayKey(utcDatetime: string, timezone: string): string {
  const date = new Date(utcDatetime);
  // Returns YYYY-MM-DD in the user's local timezone
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

export function formatDayHeader(utcDatetime: string, timezone: string, locale: Locale, t: Record<string, string>): string {
  const date = new Date(utcDatetime);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const localDate = formatDayKey(utcDatetime, timezone);
  const todayKey = formatDayKey(today.toISOString(), timezone);
  const tomorrowKey = formatDayKey(tomorrow.toISOString(), timezone);

  if (localDate === todayKey) return t.today ?? 'Today';
  if (localDate === tomorrowKey) return t.tomorrow ?? 'Tomorrow';

  return date.toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
    timeZone: timezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getUserTimezone(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('fut-timezone');
    if (stored) return stored;
  }
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/Mexico_City';
  }
}

export function setUserTimezone(tz: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fut-timezone', tz);
  }
}

export function hasSeenIntro(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('fut-intro-seen') === '1';
}

export function markIntroSeen(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fut-intro-seen', '1');
  }
}

export function calculateSettlement(
  expenses: { personName: string; amount: number }[]
): { from: string; to: string; amount: number }[] {
  if (expenses.length === 0) return [];

  const totals = new Map<string, number>();
  for (const e of expenses) {
    totals.set(e.personName, (totals.get(e.personName) ?? 0) + e.amount);
  }

  const people = [...totals.keys()];
  const totalSpent = [...totals.values()].reduce((a, b) => a + b, 0);
  const avgSpend = totalSpent / people.length;

  const balances = people.map((p) => ({ name: p, balance: (totals.get(p) ?? 0) - avgSpend }));

  const debtors  = balances.filter((b) => b.balance < -0.01).sort((a, b) => a.balance - b.balance);
  const creditors = balances.filter((b) => b.balance > 0.01).sort((a, b) => b.balance - a.balance);

  const transactions: { from: string; to: string; amount: number }[] = [];
  let di = 0, ci = 0;

  while (di < debtors.length && ci < creditors.length) {
    const debt = -debtors[di].balance;
    const credit = creditors[ci].balance;
    const amount = Math.min(debt, credit);

    transactions.push({
      from: debtors[di].name,
      to: creditors[ci].name,
      amount: Math.round(amount * 100) / 100,
    });

    debtors[di].balance += amount;
    creditors[ci].balance -= amount;

    if (Math.abs(debtors[di].balance) < 0.01) di++;
    if (Math.abs(creditors[ci].balance) < 0.01) ci++;
  }

  return transactions;
}

export function flagEmoji(teamName: string): string {
  const flags: Record<string, string> = {
    'Mexico': '🇲🇽', 'USA': '🇺🇸', 'Canada': '🇨🇦',
    'Argentina': '🇦🇷', 'Brazil': '🇧🇷', 'Uruguay': '🇺🇾',
    'Colombia': '🇨🇴', 'Ecuador': '🇪🇨', 'Chile': '🇨🇱', 'Venezuela': '🇻🇪',
    'Germany': '🇩🇪', 'France': '🇫🇷', 'Spain': '🇪🇸', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Portugal': '🇵🇹', 'Netherlands': '🇳🇱', 'Belgium': '🇧🇪',
    'Italy': '🇮🇹', 'Switzerland': '🇨🇭', 'Croatia': '🇭🇷',
    'Poland': '🇵🇱', 'Serbia': '🇷🇸', 'Denmark': '🇩🇰', 'Turkey': '🇹🇷',
    'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'Australia': '🇦🇺',
    'Iran': '🇮🇷', 'Saudi Arabia': '🇸🇦', 'Qatar': '🇶🇦', 'Iraq': '🇮🇶',
    'Uzbekistan': '🇺🇿', 'Indonesia': '🇮🇩',
    'Morocco': '🇲🇦', 'Senegal': '🇸🇳', 'Nigeria': '🇳🇬',
    'Cameroon': '🇨🇲', 'Ghana': '🇬🇭', 'Ivory Coast': '🇨🇮',
    'Egypt': '🇪🇬', 'Tunisia': '🇹🇳', 'South Africa': '🇿🇦',
    'DR Congo': '🇨🇩',
    'New Zealand': '🇳🇿',
    'Panama': '🇵🇦', 'Costa Rica': '🇨🇷', 'Jamaica': '🇯🇲',
  };
  return flags[teamName] ?? '🏳️';
}
