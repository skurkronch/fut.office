'use client';

import { useState, useRef, useCallback } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Match } from '@/data/matches';
import { formatMatchTime, formatMatchDate, flagEmoji } from '@/lib/utils';
import ShareableCard from './ShareableCard';
import AdSlot from './AdSlot';

export interface MeetingData {
  hostName: string;
  address: string;
  parking: boolean;
  meetingRoom: boolean;
  bringFood: string;
  note: string;
}

type ModalStep = 'form' | 'card';

interface Props {
  match: Match;
  timezone: string;
  lang: Locale;
  dict: Record<string, Record<string, string>>;
  onClose: () => void;
}

export default function MeetingModal({ match, timezone, lang, dict, onClose }: Props) {
  const [step, setStep] = useState<ModalStep>('form');
  const [data, setData] = useState<MeetingData>({
    hostName: '',
    address: '',
    parking: false,
    meetingRoom: false,
    bringFood: '',
    note: '',
  });
  const [splitUrl, setSplitUrl] = useState<string | null>(null);
  const [splitCopied, setSplitCopied] = useState(false);
  const [creatingSplt, setCreatingSplit] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const t = dict.meeting ?? {};
  const common = dict.common ?? {};
  const time = formatMatchTime(match.datetime, timezone, lang);
  const date = formatMatchDate(match.datetime, timezone, lang);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.address.trim()) return;
    setStep('card');
  };

  const handleCreateSplit = useCallback(async () => {
    if (!data.hostName.trim()) return;
    setCreatingSplit(true);
    try {
      const res = await fetch('/api/splits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: match.id, hostName: data.hostName }),
      });
      const json = await res.json();
      const url = `${window.location.origin}/${lang}/split/${json.id}`;
      setSplitUrl(url);
    } catch {
      alert(common.error);
    } finally {
      setCreatingSplit(false);
    }
  }, [data.hostName, match.id, lang, common.error]);

  const handleCopyLink = () => {
    if (!splitUrl) return;
    navigator.clipboard.writeText(splitUrl).then(() => {
      setSplitCopied(true);
      setTimeout(() => setSplitCopied(false), 2500);
    });
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-ink/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="w-full sm:max-w-md bg-chalk border-2 border-ink rounded-t-2xl sm:rounded-2xl max-h-[92dvh] flex flex-col card-shadow animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="pitch-bg border-b-4 border-signal px-5 pt-5 pb-4 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-signal text-xs tracking-widest uppercase mb-1">
                {t.title ?? 'Organizar quedada'}
              </div>
              <div className="font-display text-chalk text-lg lowercase">
                {flagEmoji(match.homeTeam)} {match.homeTeam}
                <span className="text-chalk/50 font-mono text-base"> vs </span>
                {flagEmoji(match.awayTeam)} {match.awayTeam}
              </div>
              <div className="font-mono text-chalk/60 text-xs mt-0.5">
                {date} · {time} · {match.city}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-chalk/50 hover:text-chalk text-2xl leading-none ml-4 mt-1"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Host name */}
              <div>
                <label className="block font-mono text-xs text-ink/60 uppercase tracking-wider mb-1.5">
                  {t.yourName ?? 'Tu nombre'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.yourNamePlaceholder ?? 'Ej. Carlos'}
                  value={data.hostName}
                  onChange={(e) => setData((d) => ({ ...d, hostName: e.target.value }))}
                  className="w-full border-2 border-ink rounded-lg px-3 py-2 font-sans text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch"
                />
              </div>

              {/* Where */}
              <div>
                <div className="font-mono text-xs text-ink/60 uppercase tracking-wider mb-1.5">
                  {t.section1 ?? '¿Dónde?'}
                </div>
                <input
                  type="text"
                  required
                  placeholder={t.addressPlaceholder}
                  value={data.address}
                  onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
                  className="w-full border-2 border-ink rounded-lg px-3 py-2 font-sans text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch mb-3"
                />

                <div className="flex gap-3">
                  <Toggle
                    label={t.parking ?? '¿Estacionamiento?'}
                    value={data.parking}
                    onChange={(v) => setData((d) => ({ ...d, parking: v }))}
                    dict={common}
                  />
                  <Toggle
                    label={t.meetingRoom ?? '¿Lugar para juntas?'}
                    value={data.meetingRoom}
                    onChange={(v) => setData((d) => ({ ...d, meetingRoom: v }))}
                    dict={common}
                  />
                </div>
              </div>

              {/* What to bring */}
              <div>
                <label className="block font-mono text-xs text-ink/60 uppercase tracking-wider mb-1.5">
                  {t.section2 ?? '¿Qué llevar?'}
                </label>
                <input
                  type="text"
                  placeholder={t.bringFoodPlaceholder}
                  value={data.bringFood}
                  onChange={(e) => setData((d) => ({ ...d, bringFood: e.target.value }))}
                  className="w-full border-2 border-ink rounded-lg px-3 py-2 font-sans text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block font-mono text-xs text-ink/60 uppercase tracking-wider mb-1.5">
                  {t.section3 ?? 'Mensaje'}
                </label>
                <textarea
                  rows={2}
                  placeholder={t.notePlaceholder}
                  value={data.note}
                  onChange={(e) => setData((d) => ({ ...d, note: e.target.value }))}
                  className="w-full border-2 border-ink rounded-lg px-3 py-2 font-sans text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch resize-none"
                />
              </div>

              <AdSlot label={dict.ad?.label} className="my-2" />

              <button
                type="submit"
                className="w-full bg-pitch text-chalk font-display lowercase text-lg py-3 rounded-xl hover:bg-pitch-line active:scale-95 transition-all"
              >
                {t.generateCard ?? 'Generar tarjeta'}
              </button>
            </form>
          ) : (
            <div className="p-5 space-y-5">
              <p className="font-mono text-pitch text-xs uppercase tracking-widest text-center">
                {t.cardReady ?? '¡Tu tarjeta está lista!'}
              </p>

              <ShareableCard match={match} data={data} timezone={timezone} lang={lang} dict={dict} />

              {/* Expense split */}
              <div className="border-2 border-ink rounded-xl p-4 bg-turf space-y-3">
                <p className="font-mono text-xs text-ink/60 uppercase tracking-wider">
                  {t.createSplit ?? 'Divisor de gastos'}
                </p>

                {splitUrl ? (
                  <div className="space-y-2">
                    <p className="font-mono text-xs text-ink/50 break-all">{splitUrl}</p>
                    <button
                      onClick={handleCopyLink}
                      className="w-full bg-signal text-ink font-mono text-xs uppercase tracking-wider py-2 rounded-lg hover:bg-card-yellow active:scale-95 transition-all"
                    >
                      {splitCopied ? (common.copied ?? '¡Copiado!') : (t.copySplitLink ?? 'Copiar link')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCreateSplit}
                    disabled={creatingSplt}
                    className="w-full bg-ink text-chalk font-mono text-xs uppercase tracking-wider py-2.5 rounded-lg hover:bg-ink/80 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {creatingSplt ? (common.loading ?? 'Cargando...') : (t.createSplit ?? 'Crear divisor')}
                  </button>
                )}
              </div>

              <button
                onClick={() => setStep('form')}
                className="w-full text-center font-mono text-xs text-ink/40 hover:text-ink/70 transition-colors"
              >
                ← {common.back ?? 'Regresar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
  dict,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  dict: Record<string, string>;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex-1 flex items-center justify-between border-2 rounded-lg px-3 py-2 text-xs font-mono transition-colors ${
        value
          ? 'border-pitch bg-pitch text-chalk'
          : 'border-ink/30 bg-turf text-ink/60 hover:border-ink/50'
      }`}
    >
      <span className="text-left leading-tight">{label}</span>
      <span className={`ml-1.5 shrink-0 font-bold ${value ? 'text-signal' : 'text-ink/30'}`}>
        {value ? (dict.yes ?? 'Sí') : (dict.no ?? 'No')}
      </span>
    </button>
  );
}
