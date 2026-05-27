'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

interface Props {
  lang: Locale;
  dict: Record<string, Record<string, string>>;
  onClose: () => void;
}

const STEPS = [
  { icon: '📅', titleKey: 'step1Title', descKey: 'step1Desc' },
  { icon: '🏠', titleKey: 'step2Title', descKey: 'step2Desc' },
  { icon: '📲', titleKey: 'step3Title', descKey: 'step3Desc' },
  { icon: '💸', titleKey: 'step4Title', descKey: 'step4Desc' },
];

export default function IntroAnimation({ lang, dict, onClose }: Props) {
  const [step, setStep] = useState(0);
  const t = dict.intro ?? {};
  const total = STEPS.length;

  const advance = () => {
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      onClose();
    }
  };

  const s = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-pitch-dark">
      {/* Decorative circle */}
      <div className="absolute top-[-80px] right-[-60px] w-64 h-64 rounded-full border-2 border-white/20 pointer-events-none" />

      {/* Skip + lang switcher */}
      <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
        {/* Language switcher — passes ?intro=1 so the new lang page shows the intro */}
        <LanguageSwitcher
          lang={lang}
          extraParam="?intro=1"
          triggerClass="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest px-3 py-2 rounded-lg flex items-center gap-1"
        />
        <button
          onClick={onClose}
          className="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest px-3 py-2 rounded-lg"
        >
          {t.skip ?? 'Skip'}
        </button>
      </div>

      {/* Badge */}
      <div className="mb-8 px-4 py-2 border border-signal/40 rounded-full">
        <span className="font-mono text-signal text-xs tracking-[0.3em] uppercase">
          {t.badge ?? 'Mundial 2026'}
        </span>
      </div>

      {/* Step content */}
      <div
        key={step}
        className="animate-slide-up flex flex-col items-center text-center px-8 max-w-sm"
      >
        <div className="text-6xl mb-6 animate-ball">{s.icon}</div>
        <h2 className="font-display text-white text-3xl lowercase mb-3">
          {t[s.titleKey]}
        </h2>
        <p className="text-white/75 text-base leading-relaxed">
          {t[s.descKey]}
        </p>
      </div>

      {/* Step dots */}
      <div className="mt-10 flex gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-6 bg-signal' : 'w-1.5 bg-white/25'
            }`}
          />
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={advance}
        className="mt-8 px-10 py-4 bg-signal text-pitch-dark font-display lowercase text-lg rounded-full hover:bg-signal/90 active:scale-95 transition-all min-w-[180px]"
      >
        {step < total - 1 ? (t.continue ?? 'Continuar') : (t.start ?? '¡A jugar!')}
      </button>

      <p className="mt-4 font-mono text-white/30 text-xs">
        {step + 1} {t.of ?? 'de'} {total}
      </p>
    </div>
  );
}
