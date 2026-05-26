import type { Locale } from './i18n';

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  offsetMinutes: number;
}

// ─── Common timezones shown at top of list ──────────────────────────────────
export const COMMON_TIMEZONES: TimezoneOption[] = [
  { value: 'America/Mexico_City',           label: 'Ciudad de México / Guadalajara',  offset: 'UTC-6',  offsetMinutes: -360 },
  { value: 'America/Monterrey',             label: 'Monterrey',                       offset: 'UTC-6',  offsetMinutes: -360 },
  { value: 'America/New_York',              label: 'Nueva York / Miami / Atlanta',    offset: 'UTC-4',  offsetMinutes: -240 },
  { value: 'America/Chicago',               label: 'Chicago / Houston / Dallas',      offset: 'UTC-5',  offsetMinutes: -300 },
  { value: 'America/Denver',                label: 'Denver / Phoenix',                offset: 'UTC-6',  offsetMinutes: -360 },
  { value: 'America/Los_Angeles',           label: 'Los Ángeles / Seattle',           offset: 'UTC-7',  offsetMinutes: -420 },
  { value: 'America/Toronto',               label: 'Toronto',                         offset: 'UTC-4',  offsetMinutes: -240 },
  { value: 'America/Vancouver',             label: 'Vancouver',                       offset: 'UTC-7',  offsetMinutes: -420 },
  { value: 'America/Bogota',                label: 'Bogotá / Lima / Quito',           offset: 'UTC-5',  offsetMinutes: -300 },
  { value: 'America/Argentina/Buenos_Aires',label: 'Buenos Aires / Montevideo',       offset: 'UTC-3',  offsetMinutes: -180 },
  { value: 'America/Sao_Paulo',             label: 'São Paulo / Brasilia',            offset: 'UTC-3',  offsetMinutes: -180 },
  { value: 'America/Santiago',              label: 'Santiago de Chile',               offset: 'UTC-3',  offsetMinutes: -180 },
  { value: 'America/Caracas',               label: 'Caracas',                         offset: 'UTC-4',  offsetMinutes: -240 },
  { value: 'America/Lima',                  label: 'Lima',                            offset: 'UTC-5',  offsetMinutes: -300 },
  { value: 'Europe/Madrid',                 label: 'Madrid / Barcelona',              offset: 'UTC+2',  offsetMinutes: 120  },
  { value: 'Europe/London',                 label: 'Londres',                         offset: 'UTC+1',  offsetMinutes: 60   },
  { value: 'Europe/Paris',                  label: 'París / Berlin / Roma',           offset: 'UTC+2',  offsetMinutes: 120  },
  { value: 'Europe/Lisbon',                 label: 'Lisboa',                          offset: 'UTC+1',  offsetMinutes: 60   },
  { value: 'Europe/Amsterdam',              label: 'Ámsterdam',                       offset: 'UTC+2',  offsetMinutes: 120  },
  { value: 'Africa/Cairo',                  label: 'El Cairo',                        offset: 'UTC+3',  offsetMinutes: 180  },
  { value: 'Africa/Casablanca',             label: 'Casablanca / Rabat',              offset: 'UTC+1',  offsetMinutes: 60   },
  { value: 'Africa/Dakar',                  label: 'Dakar',                           offset: 'UTC+0',  offsetMinutes: 0    },
  { value: 'Africa/Nairobi',                label: 'Nairobi',                         offset: 'UTC+3',  offsetMinutes: 180  },
  { value: 'Africa/Johannesburg',           label: 'Johannesburgo',                   offset: 'UTC+2',  offsetMinutes: 120  },
  { value: 'Asia/Riyadh',                   label: 'Riad / Kuwait',                   offset: 'UTC+3',  offsetMinutes: 180  },
  { value: 'Asia/Baghdad',                  label: 'Bagdad',                          offset: 'UTC+3',  offsetMinutes: 180  },
  { value: 'Asia/Tehran',                   label: 'Teherán',                         offset: 'UTC+3:30',offsetMinutes: 210 },
  { value: 'Asia/Dubai',                    label: 'Dubái',                           offset: 'UTC+4',  offsetMinutes: 240  },
  { value: 'Asia/Tashkent',                 label: 'Taskent',                         offset: 'UTC+5',  offsetMinutes: 300  },
  { value: 'Asia/Karachi',                  label: 'Karachi',                         offset: 'UTC+5',  offsetMinutes: 300  },
  { value: 'Asia/Kolkata',                  label: 'Nueva Delhi / Mumbai',            offset: 'UTC+5:30',offsetMinutes: 330 },
  { value: 'Asia/Dhaka',                    label: 'Dhaka',                           offset: 'UTC+6',  offsetMinutes: 360  },
  { value: 'Asia/Bangkok',                  label: 'Bangkok / Hanói / Yakarta',       offset: 'UTC+7',  offsetMinutes: 420  },
  { value: 'Asia/Singapore',               label: 'Singapur / Kuala Lumpur',         offset: 'UTC+8',  offsetMinutes: 480  },
  { value: 'Asia/Shanghai',                 label: 'Shanghái / Beijing',              offset: 'UTC+8',  offsetMinutes: 480  },
  { value: 'Asia/Seoul',                    label: 'Seúl / Pyongyang',               offset: 'UTC+9',  offsetMinutes: 540  },
  { value: 'Asia/Tokyo',                    label: 'Tokio / Osaka',                  offset: 'UTC+9',  offsetMinutes: 540  },
  { value: 'Australia/Sydney',              label: 'Sídney / Melbourne',             offset: 'UTC+10', offsetMinutes: 600  },
  { value: 'Pacific/Auckland',              label: 'Auckland',                       offset: 'UTC+12', offsetMinutes: 720  },
  { value: 'UTC',                           label: 'UTC',                            offset: 'UTC+0',  offsetMinutes: 0    },
];

// ─── Full IANA timezone list (generated at runtime) ─────────────────────────
function getOffsetMinutesForTz(tz: string): number {
  try {
    const offsetStr = new Intl.DateTimeFormat('en', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value ?? 'GMT+0';
    const m = offsetStr.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!m) return 0;
    const sign = m[1] === '+' ? 1 : -1;
    return sign * (parseInt(m[2]) * 60 + parseInt(m[3] ?? '0'));
  } catch { return 0; }
}

function getOffsetLabel(tz: string): string {
  try {
    const str = new Intl.DateTimeFormat('en', {
      timeZone: tz, timeZoneName: 'shortOffset',
    }).formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value ?? 'UTC';
    return str.replace('GMT', 'UTC');
  } catch { return 'UTC'; }
}

let _allTzCache: TimezoneOption[] | null = null;

export function getAllTimezones(): TimezoneOption[] {
  if (_allTzCache) return _allTzCache;

  const commonValues = new Set(COMMON_TIMEZONES.map(t => t.value));

  let allKeys: string[] = COMMON_TIMEZONES.map(t => t.value);
  try {
    // @ts-ignore
    const fullList: string[] = typeof Intl.supportedValuesOf === 'function'
      // @ts-ignore
      ? Intl.supportedValuesOf('timeZone')
      : [];
    const extras = fullList.filter(tz => !commonValues.has(tz));
    allKeys = [...allKeys, ...extras];
  } catch { /* keep common only */ }

  const common = COMMON_TIMEZONES;
  const extras: TimezoneOption[] = allKeys
    .filter(tz => !commonValues.has(tz))
    .map(tz => {
      const parts = tz.split('/');
      const label = parts.slice(1).join(' / ').replace(/_/g, ' ') || tz;
      const offsetMinutes = getOffsetMinutesForTz(tz);
      return { value: tz, label, offset: getOffsetLabel(tz), offsetMinutes };
    })
    .sort((a, b) =>
      a.offsetMinutes !== b.offsetMinutes
        ? a.offsetMinutes - b.offsetMinutes
        : a.value.localeCompare(b.value)
    );

  _allTzCache = [...common, ...extras];
  return _allTzCache;
}

// ─── Date/time formatting ────────────────────────────────────────────────────
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
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

export function formatDayHeader(
  utcDatetime: string,
  timezone: string,
  locale: Locale,
  t: Record<string, string>
): string {
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

// ─── LocalStorage helpers ────────────────────────────────────────────────────
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
  if (typeof window !== 'undefined') localStorage.setItem('fut-timezone', tz);
}

export function hasSeenIntro(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('fut-intro-seen') === '1';
}

export function markIntroSeen(): void {
  if (typeof window !== 'undefined') localStorage.setItem('fut-intro-seen', '1');
}

export function hasSeenTimezone(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('fut-tz-confirmed') === '1';
}

export function markTimezoneSeen(): void {
  if (typeof window !== 'undefined') localStorage.setItem('fut-tz-confirmed', '1');
}

// ─── Settlement algorithm ────────────────────────────────────────────────────
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
  const debtors   = balances.filter((b) => b.balance < -0.01).sort((a, b) => a.balance - b.balance);
  const creditors = balances.filter((b) => b.balance >  0.01).sort((a, b) => b.balance - a.balance);

  const transactions: { from: string; to: string; amount: number }[] = [];
  let di = 0, ci = 0;
  while (di < debtors.length && ci < creditors.length) {
    const debt = -debtors[di].balance;
    const credit = creditors[ci].balance;
    const amount = Math.min(debt, credit);
    transactions.push({ from: debtors[di].name, to: creditors[ci].name, amount: Math.round(amount * 100) / 100 });
    debtors[di].balance += amount;
    creditors[ci].balance -= amount;
    if (Math.abs(debtors[di].balance) < 0.01) di++;
    if (Math.abs(creditors[ci].balance) < 0.01) ci++;
  }
  return transactions;
}

// ─── Flag emojis (all FIFA 2026 teams) ──────────────────────────────────────
export function flagEmoji(teamName: string): string {
  const flags: Record<string, string> = {
    // Group A
    'Mexico': '🇲🇽', 'South Africa': '🇿🇦', 'Korea Republic': '🇰🇷', 'Czechia': '🇨🇿',
    // Group B
    'Canada': '🇨🇦', 'Bosnia and Herzegovina': '🇧🇦', 'Qatar': '🇶🇦', 'Switzerland': '🇨🇭',
    // Group C
    'Brazil': '🇧🇷', 'Morocco': '🇲🇦', 'Haiti': '🇭🇹', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    // Group D
    'USA': '🇺🇸', 'United States': '🇺🇸', 'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Türkiye': '🇹🇷',
    // Group E
    'Germany': '🇩🇪', 'Curaçao': '🇨🇼', 'Ivory Coast': '🇨🇮', "Côte d'Ivoire": '🇨🇮', 'Ecuador': '🇪🇨',
    // Group F
    'Netherlands': '🇳🇱', 'Japan': '🇯🇵', 'Tunisia': '🇹🇳', 'Sweden': '🇸🇪',
    // Group G
    'Belgium': '🇧🇪', 'Egypt': '🇪🇬', 'Iran': '🇮🇷', 'New Zealand': '🇳🇿',
    // Group H
    'Spain': '🇪🇸', 'Cabo Verde': '🇨🇻', 'Cape Verde': '🇨🇻', 'Saudi Arabia': '🇸🇦', 'Uruguay': '🇺🇾',
    // Group I
    'France': '🇫🇷', 'Senegal': '🇸🇳', 'Norway': '🇳🇴', 'Iraq': '🇮🇶',
    // Group J
    'Argentina': '🇦🇷', 'Algeria': '🇩🇿', 'Austria': '🇦🇹', 'Jordan': '🇯🇴',
    // Group K
    'Portugal': '🇵🇹', 'Uzbekistan': '🇺🇿', 'Colombia': '🇨🇴', 'Congo DR': '🇨🇩', 'DR Congo': '🇨🇩',
    // Group L
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croatia': '🇭🇷', 'Ghana': '🇬🇭', 'Panama': '🇵🇦',
    // Extras
    'Chile': '🇨🇱', 'Venezuela': '🇻🇪', 'Costa Rica': '🇨🇷',
    'Poland': '🇵🇱', 'Serbia': '🇷🇸', 'Denmark': '🇩🇰', 'Turkey': '🇹🇷',
    'South Korea': '🇰🇷', 'Indonesia': '🇮🇩', 'Nigeria': '🇳🇬',
    'Cameroon': '🇨🇲', 'Jamaica': '🇯🇲', 'Italy': '🇮🇹',
  };
  return flags[teamName] ?? '🏳️';
}
