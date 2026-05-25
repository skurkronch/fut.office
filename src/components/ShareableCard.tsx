'use client';

import { useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Match } from '@/data/matches';
import type { MeetingData } from './MeetingModal';
import { formatMatchTime, formatMatchDate, flagEmoji } from '@/lib/utils';
import { STAGE_LABELS } from '@/data/matches';

interface Props {
  match: Match;
  data: MeetingData;
  timezone: string;
  lang: Locale;
  dict: Record<string, Record<string, string>>;
}

export default function ShareableCard({ match, data, timezone, lang, dict }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const t = dict.meeting ?? {};
  const common = dict.common ?? {};

  const time = formatMatchTime(match.datetime, timezone, lang);
  const date = formatMatchDate(match.datetime, timezone, lang);
  const stageLabel = STAGE_LABELS[match.stage]?.[lang] ?? match.stage;

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

      if (typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Quedada fut office' });
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
      {/* Card to screenshot */}
      <div
        ref={cardRef}
        style={{ fontFamily: 'system-ui, sans-serif' }}
        className="rounded-xl overflow-hidden border-2 border-ink"
      >
        {/* Card header */}
        <div className="pitch-bg px-5 pt-5 pb-4 border-b-4 border-signal">
          <div
            style={{ fontFamily: 'Georgia, serif' }}
            className="text-signal text-xs uppercase tracking-widest mb-2 font-bold"
          >
            ⚽ fut office · {stageLabel}
          </div>
          <div className="text-chalk text-xl font-bold leading-tight">
            {flagEmoji(match.homeTeam)} {match.homeTeam}
            {'  '}vs{'  '}
            {flagEmoji(match.awayTeam)} {match.awayTeam}
          </div>
          <div className="text-chalk/70 text-xs mt-1.5 font-mono">
            {date} · {time} · {match.city}
          </div>
        </div>

        {/* Card body */}
        <div className="bg-chalk px-5 py-4 space-y-3">
          {/* Host */}
          <div>
            <div className="text-ink/50 text-xs font-mono uppercase tracking-wider mb-0.5">
              {lang === 'es' ? 'Anfitrión' : 'Host'}
            </div>
            <div className="text-ink font-semibold text-sm">{data.hostName || '—'}</div>
          </div>

          {/* Address */}
          <div>
            <div className="text-ink/50 text-xs font-mono uppercase tracking-wider mb-0.5">
              📍 {lang === 'es' ? 'Dónde' : 'Where'}
            </div>
            <div className="text-ink font-semibold text-sm">{data.address}</div>
          </div>

          {/* Logistics */}
          <div className="flex gap-3">
            <div className="flex-1 bg-turf rounded-lg px-3 py-2 text-center">
              <div className="text-xs font-mono text-ink/50 mb-0.5">
                {lang === 'es' ? 'Estacionamiento' : 'Parking'}
              </div>
              <div className={`text-sm font-bold ${data.parking ? 'text-pitch' : 'text-whistle'}`}>
                {data.parking ? '✅ Sí' : '❌ No'}
              </div>
            </div>
            <div className="flex-1 bg-turf rounded-lg px-3 py-2 text-center">
              <div className="text-xs font-mono text-ink/50 mb-0.5">
                {lang === 'es' ? 'Juntas de trabajo' : 'Work calls'}
              </div>
              <div className={`text-sm font-bold ${data.meetingRoom ? 'text-pitch' : 'text-whistle'}`}>
                {data.meetingRoom ? '✅ Sí' : '❌ No'}
              </div>
            </div>
          </div>

          {/* Bring food */}
          {data.bringFood && (
            <div>
              <div className="text-ink/50 text-xs font-mono uppercase tracking-wider mb-0.5">
                🧃 {lang === 'es' ? 'Lleva' : 'Bring'}
              </div>
              <div className="text-ink text-sm">{data.bringFood}</div>
            </div>
          )}

          {/* Note */}
          {data.note && (
            <div className="bg-card-yellow/20 border border-card-yellow rounded-lg px-3 py-2">
              <div className="text-ink/60 text-xs font-mono uppercase tracking-wider mb-0.5">
                💬 {lang === 'es' ? 'Nota' : 'Note'}
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

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full bg-signal text-ink font-display lowercase text-base py-3 rounded-xl hover:bg-card-yellow active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <span>📥</span>
        {downloading ? (common.loading ?? 'Cargando...') : (t.downloadCard ?? 'Descargar imagen')}
      </button>
    </div>
  );
}
