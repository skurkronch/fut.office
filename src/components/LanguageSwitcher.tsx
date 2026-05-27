'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'en', label: 'English',    flag: '🇺🇸' },
  { code: 'pt', label: 'Português',  flag: '🇧🇷' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
];

interface Props {
  lang: Locale;
  /** Extra query string appended to every lang link, e.g. '?intro=1' */
  extraParam?: string;
  /** CSS classes for the trigger button */
  triggerClass?: string;
  /** CSS classes for the wrapper div */
  className?: string;
}

export default function LanguageSwitcher({
  lang,
  extraParam = '',
  triggerClass,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const defaultTrigger =
    'font-mono text-xs uppercase tracking-widest bg-signal text-pitch-dark px-3 py-1.5 rounded-full font-bold hover:bg-signal/80 transition-colors min-h-[36px] flex items-center gap-1';

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={triggerClass ?? defaultTrigger}
        aria-label="Change language"
        aria-expanded={open}
      >
        {lang.toUpperCase()}
        <span className="text-[9px] text-pitch-dark/60">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-chalk border-2 border-ink rounded-xl overflow-hidden z-50 min-w-[148px] shadow-lg animate-fade-in">
          {LANGUAGES.map(({ code, label, flag }) => (
            <Link
              key={code}
              href={`/${code}${extraParam}`}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                code === lang
                  ? 'bg-pitch text-white font-semibold'
                  : 'text-ink hover:bg-turf'
              }`}
            >
              <span className="text-base">{flag}</span>
              <span className="font-mono text-xs tracking-wide">{label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
