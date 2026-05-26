'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface Props {
  lang: Locale;
  dict: Record<string, Record<string, string>>;
  timezone: string;
  onTimezoneClick: () => void;
}

function getIsDark(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('fut-theme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function NavBar({ lang, dict, timezone, onTimezoneClick }: Props) {
  const t = dict.home ?? {};
  const nav = dict.nav ?? {};
  const otherLang = lang === 'es' ? 'en' : 'es';
  const shortTz = timezone.split('/').pop()?.replace(/_/g, ' ') ?? timezone;

  const [isDark, setIsDark] = useState(false);

  // Sync with stored/system preference after mount
  useEffect(() => {
    setIsDark(getIsDark());

    // Also listen for system preference changes (when no manual override)
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (!localStorage.getItem('fut-theme')) setIsDark(mq.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fut-theme', next);
  };

  return (
    <header className="pitch-bg border-b-4 border-signal">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between relative">
        {/* Circle decoration */}
        <div className="absolute right-0 top-0 w-20 h-20 rounded-full border border-white/15 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* Logo */}
        <div className="z-10">
          <span className="font-display text-white text-2xl lowercase">
            fut <span className="text-signal">office</span>
          </span>
          <div className="font-mono text-white/50 text-xs tracking-widest uppercase -mt-0.5">
            {nav.subtitle ?? 'Mundial 2026'}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 z-10">
          {/* Timezone button (desktop) */}
          <button
            onClick={onTimezoneClick}
            className="hidden sm:flex items-center gap-2 font-mono text-xs text-white/70 hover:text-white bg-pitch-dark/40 border border-white/15 rounded-full px-3 py-1.5 transition-colors"
          >
            <span>🌍</span>
            <span className="max-w-[100px] truncate">{shortTz}</span>
          </button>
          {/* Timezone button (mobile) */}
          <button
            onClick={onTimezoneClick}
            className="flex sm:hidden items-center font-mono text-xs text-white/70 hover:text-white"
          >
            🌍
          </button>

          {/* Split link (desktop) */}
          <Link
            href={`/${lang}/split/new`}
            className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-white/70 hover:text-white bg-pitch-dark/40 border border-white/15 rounded-full px-3 py-1.5 transition-colors"
          >
            <span>💸</span>
            <span>{nav.splitLink ?? 'Split'}</span>
          </Link>
          {/* Split link (mobile) */}
          <Link
            href={`/${lang}/split/new`}
            className="flex sm:hidden font-mono text-xs text-white/70 hover:text-white"
          >
            💸
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-pitch-dark/40 border border-white/15 text-sm hover:bg-pitch-dark/70 transition-colors"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Language toggle */}
          <Link
            href={`/${otherLang}`}
            className="font-mono text-xs uppercase tracking-widest bg-signal text-pitch-dark px-2.5 py-1 rounded-full font-bold hover:bg-signal/80 transition-colors"
          >
            {otherLang}
          </Link>
        </div>
      </div>

      {/* Mobile timezone bar */}
      <button
        onClick={onTimezoneClick}
        className="sm:hidden w-full px-4 pb-2 flex items-center gap-2 font-mono text-xs text-white/50 hover:text-white/80 transition-colors"
      >
        <span>{t.timezoneLabel ?? 'Tu zona horaria'}:</span>
        <span className="text-signal">{shortTz}</span>
        <span className="text-white/30">· {t.changeTimezone ?? 'Cambiar'}</span>
      </button>
    </header>
  );
}
