'use client';

import { useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Match } from '@/data/matches';
import type { MeetingData } from './MeetingModal';
import { formatMatchTime, formatMatchDate, flagEmoji } from '@/lib/utils';
import { STAGE_LABELS } from '@/data/matches';

type Target =
  | { match: Match }
  | { matches: Match[]; dayLabel: string };

interface Props {
  target: Target;
  data: MeetingData;
  timezone: string;
  lang: Locale;
  dict: Record<string, Record<string, string>>;
}

export default function ShareableCard({ target, data, timezone, lang, dict }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const t = dict.meeting ?? {};
  const common = dict.common ?? {};

  const isMatch = 'match' in target;
  const match = isMatch ? target.match : null;
  const time  = match ? formatMatchTime(match.datetime, timezone, lang) : '';
  const date  = match ? formatMatchDate(match.datetime, timezone, lang) : '';
  const stageLabel = match ? (STAGE_LABELS[match.stage]?.[lang] ?? match.stage) : '';

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#0b6b3a',
      });

      const blob = await fetch(dataUrl).then((r) => r.blob());
      const file = new File([blob], 'fut-office-quedada.png', { type: 'image/png' });

      const shareText = data.mapsUrl
        ? `📍 ${data.placeName || data.mapsUrl}\n${data.mapsUrl}`
        : undefined;

      if (typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Quedada fut office',
          ...(shareText ? { text: shareText } : {}),
        });
      } else {
        const a = document.createElement('a');
        a.download = 'fut-office-quedada.png';
        a.href = dataUrl;
        a.click();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={cardRef}
        style={{ fontFamily: 'system-ui, sans-serif' }}
        className="rounded-xl overflow-hidden border-2 border-ink"
      >
        {/* Header */}
        <div className="pitch-bg px-5 pt-5 pb-4 border-b-4 border-signal">
          <div
            style={{ fontFamily: 'Georgia, serif' }}
            className="text-signal text-xs uppercase tracking-widest mb-2 font-bold"
          >
            ⚽ fut office
            {isMatch && stageLabel ? ` · ${stageLabel}` : ''}
            {!isMatch ? ` · ${target.dayLabel}` : ''}
          </div>

          {isMatch ? (
            <>
              <div className="text-white text-xl font-bold leading-tight">
                {flagEmoji(match!.homeTeam)} {match!.homeTeam}
                {'  '}vs{'  '}
                {flagEmoji(match!.awayTeam)} {match!.awayTeam}
              </div>
              <div className="text-white/70 text-xs mt-1.5 font-mono">
                {date} · {time} · {match!.city}
              </div>
            </>
          ) : (
            <div className="space-y-1">
              {target.matches.map((m) => (
                <div key={m.id} className="text-white text-sm font-semibold leading-snug">
                  {flagEmoji(m.homeTeam)} {m.homeTeam}{' '}
                  <span className="text-white/50 font-mono text-xs">vs</span>{' '}
                  {flagEmoji(m.awayTeam)} {m.awayTeam}
                  <span className="text-signal font-mono text-xs ml-1.5">
                    {formatMatchTime(m.datetime, timezone, lang)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="bg-chalk px-5 py-4 space-y-3">
          {/* Host */}
          <div>
            <div className="text-ink/50 text-xs font-mono uppercase tracking-wider mb-0.5">
              {t.cardHost ?? 'Host'}
            </div>
            <div className="text-ink font-semibold text-sm">{data.hostName || '—'}</div>
          </div>

          {/* Location */}
          <div>
            <div className="text-ink/50 text-xs font-mono uppercase tracking-wider mb-0.5">
              📍 {t.cardWhere ?? 'Where'}
            </div>
            <div className="text-ink font-semibold text-sm">
              {data.placeName || data.mapsUrl || '—'}
            </div>
            {data.interiorNumber && (
              <div className="text-ink/70 text-xs mt-0.5">
                <span className="font-mono uppercase tracking-wide text-ink/40">
                  {t.cardUnit ?? 'Unit'}:
                </span>{' '}
                <span className="font-semibold">{data.interiorNumber}</span>
              </div>
            )}
          </div>

          {/* Logistics */}
          <div className="flex gap-3">
            <div className="flex-1 bg-turf rounded-lg px-3 py-2 text-center">
              <div className="text-xs font-mono text-ink/50 mb-0.5">
                {t.parking ?? 'Parking'}
              </div>
              <div className={`text-sm font-bold ${data.parking ? 'text-pitch' : 'text-whistle'}`}>
                {data.parking ? '✅' : '❌'} {data.parking ? (common.yes ?? 'Sí') : (common.no ?? 'No')}
              </div>
            </div>
            <div className="flex-1 bg-turf rounded-lg px-3 py-2 text-center">
              <div className="text-xs font-mono text-ink/50 mb-0.5">
                {t.meetingRoom ?? 'Private space'}
              </div>
              <div className={`text-sm font-bold ${data.meetingRoom ? 'text-pitch' : 'text-whistle'}`}>
                {data.meetingRoom ? '✅' : '❌'} {data.meetingRoom ? (common.yes ?? 'Sí') : (common.no ?? 'No')}
              </div>
            </div>
          </div>

          {/* Bring */}
          {data.bringFood && (
            <div>
              <div className="text-ink/50 text-xs font-mono uppercase tracking-wider mb-0.5">
                🧃 {t.cardBring ?? 'Bring'}
              </div>
              <div className="text-ink text-sm">{data.bringFood}</div>
            </div>
          )}

          {/* Note */}
          {data.note && (
            <div className="bg-card-yellow/20 border border-card-yellow rounded-lg px-3 py-2">
              <div className="text-ink/60 text-xs font-mono uppercase tracking-wider mb-0.5">
                💬 {t.cardNote ?? 'Note'}
              </div>
              <div className="text-ink text-sm">{data.note}</div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-1 border-t border-ink/10 flex items-center justify-between">
            <span className="text-ink/30 text-xs font-mono">futoffice.app</span>
            <span className="text-signal bg-pitch rounded-full px-2 py-0.5 text-xs font-mono">
              ⚽ #Mundial2026
            </span>
          </div>
        </div>
      </div>

      {/* Download / share button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full bg-signal text-pitch-dark font-display lowercase text-base py-3 rounded-xl hover:bg-card-yellow active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <span>📥</span>
        {downloading ? (common.loading ?? 'Cargando...') : (t.downloadCard ?? 'Descargar imagen')}
      </button>
    </div>
  );
}
