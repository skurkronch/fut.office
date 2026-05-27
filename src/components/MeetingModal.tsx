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

interface PlaceResult {
  placeName: string;
  displayName: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  embedUrl: string;
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

  // ── Place search state ────────────────────────────────────────────────────
  const [locationInput, setLocationInput] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resolvedEmbed, setResolvedEmbed] = useState<string | null>(null);
  const [resolvingMap, setResolvingMap] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);

  // ── Split state ───────────────────────────────────────────────────────────
  const [splitUrl, setSplitUrl] = useState<string | null>(null);
  const [splitCopied, setSplitCopied] = useState(false);
  const [creatingSplt, setCreatingSplit] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const t = dict.meeting ?? {};
  const common = dict.common ?? {};

  // ── Derived display info ──────────────────────────────────────────────────
  const isMatch = 'match' in target;
  const primaryMatch = isMatch ? target.match : target.matches[0];
  const time = primaryMatch ? formatMatchTime(primaryMatch.datetime, timezone, lang) : '';
  const date = primaryMatch ? formatMatchDate(primaryMatch.datetime, timezone, lang) : '';

  // ── Close search results when clicking outside ────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Smart location input: search or URL resolve ───────────────────────────
  useEffect(() => {
    const val = locationInput.trim();
    if (!val) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const isUrl = val.startsWith('http://') || val.startsWith('https://');

    if (isUrl) {
      // URL mode — resolve via existing API
      const isMapsUrl =
        val.includes('google.com/maps') ||
        val.includes('maps.app.goo.gl') ||
        val.includes('goo.gl/maps');
      if (!isMapsUrl) return;

      const timer = setTimeout(async () => {
        setResolvingMap(true);
        try {
          const res = await fetch(`/api/resolve-maps?url=${encodeURIComponent(val)}`);
          const info = await res.json();
          if (info.embedUrl) setResolvedEmbed(info.embedUrl);
          setData((d) => ({
            ...d,
            mapsUrl: val,
            placeName: info.placeName ?? d.placeName,
            lat: info.lat,
            lng: info.lng,
          }));
        } catch { /* silently ignore */ } finally {
          setResolvingMap(false);
        }
      }, 600);
      return () => clearTimeout(timer);
    }

    // Text search mode
    if (val.length < 2) return;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search-places?q=${encodeURIComponent(val)}&lang=${lang}`);
        const json = await res.json();
        setSearchResults(json.results ?? []);
        setShowResults(true);
      } catch { /* silently ignore */ } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationInput]);

  const selectPlace = (result: PlaceResult) => {
    setData((d) => ({
      ...d,
      placeName: result.placeName,
      mapsUrl: result.mapsUrl,
      lat: result.lat,
      lng: result.lng,
    }));
    setResolvedEmbed(result.embedUrl);
    setLocationInput(result.placeName);
    setShowResults(false);
    setSearchResults([]);
  };

  const clearLocation = () => {
    setLocationInput('');
    setData((d) => ({ ...d, placeName: '', mapsUrl: '', lat: undefined, lng: undefined }));
    setResolvedEmbed(null);
    setSearchResults([]);
    setShowResults(false);
  };

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.placeName.trim() && !data.mapsUrl.trim()) return;
    setStep('card');
  };

  // ── Split ─────────────────────────────────────────────────────────────────
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

  const locationConfirmed = !!data.placeName || !!data.mapsUrl;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-ink/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="w-full sm:max-w-md bg-chalk border-2 border-ink rounded-t-2xl sm:rounded-2xl max-h-[94dvh] sm:max-h-[92dvh] flex flex-col card-shadow animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="pitch-bg border-b-4 border-signal px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4 shrink-0">
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
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 sm:space-y-5">

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

              {/* Location */}
              <div>
                <div className="font-mono text-xs text-ink/60 uppercase tracking-wider mb-1.5">
                  {t.section1 ?? '¿Dónde?'}
                </div>

                {/* Smart search input */}
                <div ref={searchRef} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder ?? 'Buscar restaurante, bar, dirección...'}
                      value={locationInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLocationInput(val);
                        // If user clears it, reset location data
                        if (!val) clearLocation();
                        else if (!val.startsWith('http')) {
                          // Reset place selection when user starts typing again
                          setData((d) => ({ ...d, placeName: '', mapsUrl: '', lat: undefined, lng: undefined }));
                          setResolvedEmbed(null);
                        }
                      }}
                      onFocus={() => {
                        if (searchResults.length > 0) setShowResults(true);
                      }}
                      className="w-full border-2 border-ink rounded-lg px-3 py-2 pr-16 font-sans text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch"
                    />
                    {/* Status icons */}
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      {(searching || resolvingMap) && (
                        <span className="text-xs animate-pulse">🔍</span>
                      )}
                      {locationConfirmed && !searching && !resolvingMap && (
                        <span className="text-pitch text-sm">✓</span>
                      )}
                      {locationInput && (
                        <button
                          type="button"
                          onClick={clearLocation}
                          className="text-ink/40 hover:text-ink text-lg leading-none w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Autocomplete dropdown */}
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-chalk border-2 border-ink rounded-xl overflow-hidden shadow-lg animate-fade-in">
                      {searchResults.map((result, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selectPlace(result)}
                          className="w-full text-left px-3 py-2.5 hover:bg-turf transition-colors border-b border-ink/10 last:border-0"
                        >
                          <div className="text-sm font-semibold text-ink truncate">
                            📍 {result.placeName}
                          </div>
                          <div className="text-xs text-ink/40 font-mono truncate mt-0.5">
                            {result.displayName}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {showResults && !searching && searchResults.length === 0 && locationInput.length >= 2 && !locationInput.startsWith('http') && (
                    <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-chalk border-2 border-ink rounded-xl px-3 py-3 shadow-lg">
                      <p className="text-sm text-ink/50 font-mono text-center">
                        {t.noPlacesFound ?? 'Sin resultados'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirmed place chip */}
                {locationConfirmed && !searching && !resolvingMap && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-pitch text-xs">✓</span>
                    <span className="font-mono text-pitch text-xs">
                      {t.placeFound ?? 'Lugar encontrado'}:{' '}
                      <span className="font-semibold">{data.placeName || data.mapsUrl}</span>
                    </span>
                  </div>
                )}

                {/* Resolving / searching status */}
                {(resolvingMap || searching) && (
                  <p className="font-mono text-ink/40 text-xs mt-1 animate-pulse">
                    {searching ? (t.searching ?? 'Buscando...') : (t.resolving ?? 'Buscando ubicación...')}
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

                {/* Fallback: paste Google Maps URL */}
                <button
                  type="button"
                  onClick={() => setShowUrlFallback((v) => !v)}
                  className="mt-2 text-xs font-mono text-ink/40 hover:text-ink/70 transition-colors"
                >
                  {showUrlFallback ? '▴' : '▾'} {t.orPasteUrl ?? 'O pega el link de Google Maps'}
                </button>

                {showUrlFallback && (
                  <input
                    type="url"
                    placeholder={t.mapsUrlPlaceholder ?? 'https://maps.google.com/...'}
                    value={locationInput.startsWith('http') ? locationInput : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocationInput(val);
                      if (!val) clearLocation();
                    }}
                    className="mt-1.5 w-full border-2 border-ink/40 rounded-lg px-3 py-2 font-sans text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch"
                  />
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
            <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
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
