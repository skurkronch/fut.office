'use client';

import { useState, useMemo } from 'react';
import type { Locale } from '@/lib/i18n';
import { COMMON_TIMEZONES } from '@/lib/utils';

interface Props {
  lang: Locale;
  dict: Record<string, Record<string, string>>;
  current: string;
  onSelect: (tz: string) => void;
  onClose: () => void;
}

export default function TimezoneSelector({ dict, current, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');
  const t = dict.timezone ?? {};

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMON_TIMEZONES;
    const q = query.toLowerCase();
    return COMMON_TIMEZONES.filter(
      (tz) =>
        tz.label.toLowerCase().includes(q) ||
        tz.value.toLowerCase().includes(q) ||
        tz.offset.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-ink/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-chalk border-2 border-ink rounded-t-2xl sm:rounded-2xl p-5 card-shadow max-h-[85dvh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-ink text-xl lowercase">
            {t.title ?? 'Zona horaria'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-turf flex items-center justify-center text-ink/50 hover:text-ink text-lg"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          placeholder={t.search ?? 'Buscar...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-2 border-ink rounded-lg px-3 py-2 font-mono text-sm bg-turf text-ink placeholder-ink/40 outline-none focus:border-pitch mb-3"
          autoFocus
        />

        <div className="overflow-y-auto flex-1 -mr-1 pr-1">
          {filtered.map((tz) => (
            <button
              key={tz.value}
              onClick={() => onSelect(tz.value)}
              className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 flex items-center justify-between transition-colors group ${
                tz.value === current
                  ? 'bg-pitch text-chalk'
                  : 'hover:bg-turf text-ink'
              }`}
            >
              <span className="font-medium text-sm">{tz.label}</span>
              <span
                className={`font-mono text-xs ${
                  tz.value === current ? 'text-signal' : 'text-ink/40 group-hover:text-ink/60'
                }`}
              >
                {tz.offset}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-ink/40 text-sm py-6 font-mono">
              Sin resultados
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
