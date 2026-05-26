'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Match } from '@/data/matches';
import { formatMatchTime, formatMatchDate, flagEmoji } from '@/lib/utils';
import ShareableCard from './ShareableCard';
import AdSlot from './AdSlot';

export interface MeetingData {
  hostName: string;
  mapsUrl: string;
  placeName: string;
  interiorNumber: string;
  lat?: number;
  lng?: number;
  parking: boolean;
  meetingRoom: boolean;
  bringFood: string;
  note: string;
}

type ModalStep = 'form' | 'card';

type Target =
  | { match: Match }
  | { matches: Match[]; dayLabel: string };

interface Props {
  target: Target;
  timezone: string;
  lang: Locale;
  dict: Record<string, Record<string, string>>;
  onClose: () => void;
}

export default function MeetingModal({ target, timezone, lang, dict, onClose }: Props) {
  const [step, setStep] = useState<ModalStep>('form');
  const [data, setData] = useState<MeetingData>({
    hostName: '',
    mapsUrl: '',
    placeName: '',
    interiorNumber: '',
    parking: false,
    meetingRoom: false,
    bringFood: '',
    note: '',
  });
  const [resolvedEmbed, setResolvedEmbed] = useState<string | null>(null);
  const [resolvingMap, setResolvingMap] = useState(false);
  const [splitUrl, setSplitUrl] = useState<string | null>(null);
  const [splitCopied, setSplitCopied] = useState(false);
  const [creatingSplt, setCreatingSplit] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const t = dict.meeting ?? {};
  const common = dict.common ?? {};

  // ── Derived display info ───────────────────────────────────────────────
  const isMatch = 'match' in target;
  const primaryMatch = isMatch ? target.match : target.matches[0];
  const time = primaryMatch ? formatMatchTime(primaryMatch.datetime, timezone, lang) : '';
  const date = primaryMatch ? formatMatchDate(primaryMatch.datetime, timezone, lang) : '';

  // ── Google Maps URL resolution (debounced) ─────────────────────────────
  useEffect(() => {
    const url = data.mapsUrl.trim();
    if (!url) {
      setResolvedEmbed(null);
      return;
    }
    const isMapsUrl =
      url.includes('google.com/maps') ||
      url.includes('maps.app.goo.gl') ||
      url.includes('goo.gl/maps');
    if (!isMapsUrl) return;

    const timer = setTimeout(async () => {
      setResolvingMap(true);
      try {
        const res = await fetch(`/api/resolve-maps?url=${encodeURIComponent(url)}`);
        const info = await res.json();
        if (info.embedUrl) setResolvedEmbed(info.embedUrl);
        // Store place name + coordinates (used by the shareable card)
        setData((d) => ({
          ...d,
          placeName: info.placeName ?? d.placeName,
          lat: info.lat,
          lng: info.lng,
        }));
      } catch {
        // silently ignore — embed stays null
      } finally {
        setResolvingMap(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.mapsUrl]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.mapsUrl.trim()) return;
    setStep('card');
  };

  const handleCreateSplit = useCallback(async () => {
    if (!data.hostName.trim()) return;
    setCreatingSplit(true);
    const matchId = isMatch ? target.match.id : 'standalone';
    try {
      const res = await fetch('/api/splits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, hostName: data.hostName }),
      });
      const json = await res.json();
      const url = `${window.location.origin}/${lang}/split/${json.id}`;
      setSplitUrl(url);
    } catch {
      alert(common.error);
    } finally {
      setCreatingSplit(false);
    }
  }, [data.hostName, isMatch, target, lang, common.error]);

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
            <div className="flex-1 min-w-0 mr-3">
              <div className="font-mono text-signal text-xs tracking-widest uppercase mb-1">
                {isMatch
                  ? (t.title ?? 'Organizar quedada')
                  : (t.organizeDay ?? 'Organizar el día completo')}
              </div>

              {isMatch ? (
                <>
                  <div className="font-display text-white text-lg lowercase">
                    {flagEmoji(target.match.homeTeam)} {target.match.homeTeam}
                    <span className="text-white/50 font-mono text-base"> vs </span>
                    {flagEmoji(target.match.awayTeam)} {target.match.awayTeam}
                  </div>
                  <div className="font-mono text-white/60 text-xs mt-0.5">
                    {date} · {time} · {target.match.city}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-display text-white text-lg lowercase">
                    📅 {target.dayLabel}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {target.matches.map((m) => (
                      <div key={m.id} className="font-mono text-white/60 text-xs truncate">
                        {flagEmoji(m.homeTeam)} {m.homeTeam} vs {flagEmoji(m.awayTeam)}{' '}
                        {m.awayTeam} · {formatMatchTime(m.datetime, timezone, lang)}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white text-2xl leading-none mt-1 shrink-0"
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

              {/* Google Maps URL */}
              <div>
                <div className="font-mono text-xs text-ink/60 uppercase tracking-wider mb-1.5">
                  {t.section1 ?? '¿Dónde?'}
                </div>

                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder={t.mapsUrlPlaceholder ?? 'Pega el link de Google Maps aquí'}
                    value={data.mapsUrl}
                    onChange={(e) => {
                      setData((d) => ({ ...d, mapsUrl: e.target.value, placeName: '' }));
                      setResolvedEmbed(null);
                    }}
                    className="w-full border-2 border-ink rounded-lg px-3 py-2 font-sans text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch pr-8"
                  />
                  {resolvingMap && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs animate-pulse">
                      🔍
                    </span>
                  )}
                </div>

                {/* Resolved place name chip */}
                {data.placeName && !resolvingMap && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-pitch text-xs">✓</span>
                    <span className="font-mono text-pitch text-xs">
                      {t.placeFound ?? 'Lugar encontrado'}:{' '}
                      <span className="font-semibold">{data.placeName}</span>
                    </span>
                  </div>
                )}
                {resolvingMap && (
                  <p className="font-mono text-ink/40 text-xs mt-1 animate-pulse">
                    {t.resolving ?? 'Buscando ubicación...'}
                  </p>
                )}

                {/* Map embed preview */}
                {resolvedEmbed && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-ink/20">
                    <iframe
                      src={resolvedEmbed}
                      className="maps-embed"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      title="map preview"
                    />
                  </div>
                )}

                {/* Interior number */}
                <input
                  type="text"
                  placeholder={t.interiorNumberPlaceholder ?? 'Ej. Depto 4B, Piso 3'}
                  value={data.interiorNumber}
                  onChange={(e) => setData((d) => ({ ...d, interiorNumber: e.target.value }))}
                  className="w-full border-2 border-ink/40 rounded-lg px-3 py-2 font-sans text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch mt-2"
                />
                <p className="font-mono text-ink/35 text-xs mt-0.5">
                  {t.interiorNumber ?? 'Número interior (opcional)'}
                </p>

                {/* Logistics toggles */}
                <div className="flex gap-3 mt-3">
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
                className="w-full bg-pitch text-white font-display lowercase text-lg py-3 rounded-xl hover:bg-pitch-line active:scale-95 transition-all"
              >
                {t.generateCard ?? 'Generar tarjeta'}
              </button>
            </form>
          ) : (
            <div className="p-5 space-y-5">
              <p className="font-mono text-pitch text-xs uppercase tracking-widest text-center">
                {t.cardReady ?? '¡Tu tarjeta está lista!'}
              </p>

              <ShareableCard
                target={target}
                data={data}
                timezone={timezone}
                lang={lang}
                dict={dict}
              />

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
                      className="w-full bg-signal text-pitch-dark font-mono text-xs uppercase tracking-wider py-2 rounded-lg hover:bg-card-yellow active:scale-95 transition-all"
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
          ? 'border-pitch bg-pitch text-white'
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
