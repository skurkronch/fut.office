'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Locale } from '@/lib/i18n';
import { COMMON_TIMEZONES, getAllTimezones } from '@/lib/utils';

interface Props {
  lang: Locale;
  dict: Record<string, Record<string, string>>;
  current: string;
  detected?: string;  // auto-detected timezone from browser
  onSelect: (tz: string) => void;
  onClose?: () => void;
  mandatory?: boolean; // true = full-screen, can't dismiss
}

export default function TimezoneSelector({
  dict, current, detected, onSelect, onClose, mandatory = false,
}: Props) {
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const t = dict.timezone ?? {};

  // Load full list only when user requests it (perf)
  const allTimezones = useMemo(() => showAll ? getAllTimezones() : COMMON_TIMEZONES, [showAll]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allTimezones;
    const q = query.toLowerCase();
    return allTimezones.filter(
      (tz) =>
        tz.label.toLowerCase().includes(q) ||
        tz.value.toLowerCase().includes(q) ||
        tz.offset.toLowerCase().includes(q)
    );
  }, [query, allTimezones]);

  // Group: show detected tz first if mandatory
  const detectedTz = useMemo(() => {
    if (!detected || !mandatory) return null;
    return COMMON_TIMEZONES.find(t => t.value === detected) ??
      getAllTimezones().find(t => t.value === detected) ??
      { value: detected, label: detected.split('/').slice(1).join(' / ').replace(/_/g, ' ') || detected, offset: '', offsetMinutes: 0 };
  }, [detected, mandatory]);

  if (mandatory) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-pitch-dark overflow-hidden">
        {/* Header */}
        <div className="pitch-bg border-b-4 border-signal px-5 pt-8 pb-5 shrink-0">
          <div className="max-w-lg mx-auto">
            <div className="font-mono text-signal text-xs tracking-widest uppercase mb-2">
              ⚽ fut office
            </div>
            <h1 className="font-display text-white text-2xl lowercase">
              {t.mandatory_title ?? '¿En qué zona horaria estás?'}
            </h1>
            <p className="font-mono text-white/60 text-xs mt-1">
              {t.mandatory_subtitle ?? 'Los partidos se mostrarán en tu hora local'}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col max-w-lg mx-auto w-full px-4 py-4">
          {/* Detected suggestion */}
          {detectedTz && (
            <div className="mb-4 p-3 bg-signal/15 border-2 border-signal/40 rounded-xl flex items-center justify-between shrink-0">
              <div>
                <div className="font-mono text-signal text-xs uppercase tracking-wider mb-0.5">
                  {t.detected ?? 'Zona detectada'}
                </div>
                <div className="font-semibold text-ink text-sm">{detectedTz.label}</div>
                <div className="font-mono text-ink/50 text-xs">{detectedTz.value} · {detectedTz.offset || getOffsetStr(detectedTz.value)}</div>
              </div>
              <button
                onClick={() => onSelect(detectedTz.value)}
                className="shrink-0 ml-3 bg-signal text-pitch-dark font-mono text-xs uppercase tracking-wider px-3 py-2 rounded-lg hover:bg-signal/80 active:scale-95 transition-all"
              >
                {t.use_detected ?? 'Usar esta'}
              </button>
            </div>
          )}

          {/* Search */}
          <input
            type="text"
            placeholder={t.search ?? 'Buscar ciudad o zona...'}
            value={query}
            onChange={(e) => { setQuery(e.target.value); if (!showAll) setShowAll(true); }}
            className="w-full border-2 border-ink rounded-lg px-3 py-2.5 font-mono text-sm bg-turf text-ink placeholder-ink/40 outline-none focus:border-pitch mb-2 shrink-0"
            autoFocus
          />

          {/* Show all toggle */}
          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-xs font-mono text-ink/50 hover:text-ink/80 mb-2 text-left shrink-0 transition-colors"
            >
              {t.all_zones ?? 'Ver todas las zonas horarias'} →
            </button>
          )}

          {/* List */}
          <div className="overflow-y-auto flex-1 -mr-1 pr-1">
            {filtered.map((tz) => (
              <button
                key={tz.value}
                onClick={() => onSelect(tz.value)}
                className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 flex items-center justify-between transition-colors group ${
                  tz.value === current
                    ? 'bg-pitch text-white'
                    : 'hover:bg-chalk/20 text-ink'
                }`}
              >
                <span className="font-medium text-sm">{tz.label}</span>
                <span className={`font-mono text-xs ml-2 shrink-0 ${tz.value === current ? 'text-signal' : 'text-ink/40 group-hover:text-ink/60'}`}>
                  {tz.offset || getOffsetStr(tz.value)}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-ink/40 text-sm py-6 font-mono">
                {t.noResults ?? 'Sin resultados'}
              </p>
            )}
          </div>

          {/* Confirm button */}
          <div className="pt-3 shrink-0">
            <button
              onClick={() => onSelect(current)}
              className="w-full bg-signal text-pitch-dark font-display lowercase text-lg py-3 rounded-xl hover:bg-signal/90 active:scale-95 transition-all"
            >
              {t.confirm_btn ?? 'Confirmar zona horaria'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal modal mode ──────────────────────────────────────────────────────
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
          onChange={(e) => { setQuery(e.target.value); if (!showAll) setShowAll(true); }}
          className="w-full border-2 border-ink rounded-lg px-3 py-2 font-mono text-sm bg-turf text-ink placeholder-ink/40 outline-none focus:border-pitch mb-1"
          autoFocus
        />

        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-xs font-mono text-ink/40 hover:text-ink/70 mb-2 text-left transition-colors"
          >
            {t.all_zones ?? 'Todas las zonas'} →
          </button>
        )}

        <div className="overflow-y-auto flex-1 -mr-1 pr-1">
          {filtered.map((tz) => (
            <button
              key={tz.value}
              onClick={() => onSelect(tz.value)}
              className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 flex items-center justify-between transition-colors group ${
                tz.value === current ? 'bg-pitch text-white' : 'hover:bg-turf text-ink'
              }`}
            >
              <span className="font-medium text-sm">{tz.label}</span>
              <span className={`font-mono text-xs ml-2 shrink-0 ${tz.value === current ? 'text-signal' : 'text-ink/40 group-hover:text-ink/60'}`}>
                {tz.offset || getOffsetStr(tz.value)}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-ink/40 text-sm py-6 font-mono">
              {t.noResults ?? 'Sin resultados'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getOffsetStr(tz: string): string {
  try {
    const str = new Intl.DateTimeFormat('en', {
      timeZone: tz, timeZoneName: 'shortOffset',
    }).formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value ?? 'UTC';
    return str.replace('GMT', 'UTC');
  } catch { return 'UTC'; }
}
