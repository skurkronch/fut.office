'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface Props {
  lang: Locale;
  dict: Record<string, Record<string, string>>;
  timezone: string;
  onTimezoneClick: () => void;
}

export default function NavBar({ lang, dict, timezone, onTimezoneClick }: Props) {
  const t = dict.home ?? {};
  const nav = dict.nav ?? {};
  const otherLang = lang === 'es' ? 'en' : 'es';

  const shortTz = timezone.split('/').pop()?.replace(/_/g, ' ') ?? timezone;

  return (
    <header className="pitch-bg border-b-4 border-signal">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between relative">
        {/* Circle decoration */}
        <div className="absolute right-0 top-0 w-20 h-20 rounded-full border border-chalk/15 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* Logo */}
        <div className="z-10">
          <span className="font-display text-chalk text-2xl lowercase">
            fut <span className="text-signal">office</span>
          </span>
          <div className="font-mono text-chalk/50 text-xs tracking-widest uppercase -mt-0.5">
            {nav.subtitle ?? 'Mundial 2026'}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={onTimezoneClick}
            className="hidden sm:flex items-center gap-2 font-mono text-xs text-chalk/70 hover:text-chalk bg-pitch-dark/40 border border-chalk/15 rounded-full px-3 py-1.5 transition-colors"
          >
            <span>🌍</span>
            <span className="max-w-[100px] truncate">{shortTz}</span>
          </button>
          <button
            onClick={onTimezoneClick}
            className="flex sm:hidden items-center font-mono text-xs text-chalk/70 hover:text-chalk"
          >
            🌍
          </button>

          {/* Language toggle */}
          <Link
            href={`/${otherLang}`}
            className="font-mono text-xs uppercase tracking-widest bg-signal text-ink px-2.5 py-1 rounded-full font-bold hover:bg-signal/80 transition-colors"
          >
            {otherLang}
          </Link>
        </div>
      </div>

      {/* Mobile timezone bar */}
      <button
        onClick={onTimezoneClick}
        className="sm:hidden w-full px-4 pb-2 flex items-center gap-2 font-mono text-xs text-chalk/50 hover:text-chalk/80 transition-colors"
      >
        <span>{t.timezoneLabel ?? 'Tu zona horaria'}:</span>
        <span className="text-signal">{shortTz}</span>
        <span className="text-chalk/30">· {t.changeTimezone ?? 'Cambiar'}</span>
      </button>
    </header>
  );
}
