'use client';

import { useMemo } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Match, Stage } from '@/data/matches';
import { STAGE_LABELS } from '@/data/matches';
import { formatMatchTime, formatDayKey, formatDayHeader, flagEmoji } from '@/lib/utils';

interface Props {
  matches: Match[];
  timezone: string;
  lang: Locale;
  dict: Record<string, Record<string, string>>;
  onSelectMatch: (match: Match) => void;
  onSelectDay: (matches: Match[], dayLabel: string) => void;
}

export default function MatchCalendar({
  matches,
  timezone,
  lang,
  dict,
  onSelectMatch,
  onSelectDay,
}: Props) {
  const t = dict.home ?? {};

  const grouped = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of matches) {
      const key = formatDayKey(m.datetime, timezone);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [matches, timezone]);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-ink text-2xl lowercase">
        {t.upcomingMatches ?? 'Próximos partidos'}
      </h2>

      {grouped.map(([dayKey, dayMatches]) => {
        const headerText = formatDayHeader(dayMatches[0].datetime, timezone, lang, t);
        return (
          <DayBlock
            key={dayKey}
            header={headerText}
            matches={dayMatches}
            timezone={timezone}
            lang={lang}
            dict={dict}
            onSelectMatch={onSelectMatch}
            onSelectDay={onSelectDay}
          />
        );
      })}
    </div>
  );
}

function DayBlock({
  header,
  matches,
  timezone,
  lang,
  dict,
  onSelectMatch,
  onSelectDay,
}: {
  header: string;
  matches: Match[];
  timezone: string;
  lang: Locale;
  dict: Record<string, Record<string, string>>;
  onSelectMatch: (match: Match) => void;
  onSelectDay: (matches: Match[], dayLabel: string) => void;
}) {
  const t = dict.home ?? {};
  const stageLabel = STAGE_LABELS[matches[0].stage as Stage]?.[lang] ?? '';

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h3 className="font-display text-ink text-lg lowercase capitalize">{header}</h3>
        <span className="font-mono text-whistle text-xs uppercase tracking-widest border border-whistle/40 px-2 py-0.5 rounded-full">
          {stageLabel}
        </span>
      </div>

      <div className="space-y-2">
        {matches.map((match) => (
          <MatchRow
            key={match.id}
            match={match}
            timezone={timezone}
            lang={lang}
            dict={dict}
            onSelect={() => onSelectMatch(match)}
          />
        ))}
      </div>

      {/* Day-level organizer CTA */}
      <button
        onClick={() => onSelectDay(matches, header)}
        className="mt-2 w-full flex items-center justify-between gap-3 bg-pitch/8 hover:bg-pitch/15 border-2 border-pitch/25 hover:border-pitch/50 text-pitch rounded-xl px-4 py-3 transition-all group"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <div className="text-left">
            <div className="font-display text-sm lowercase leading-tight">
              {t.organizeDay ?? 'Organizar todos los partidos del día'}
            </div>
            <div className="font-mono text-xs text-pitch/60 mt-0.5">
              {matches.length} {matches.length === 1
                ? (lang === 'es' ? 'partido' : 'match')
                : (lang === 'es' ? 'partidos' : 'matches')}
            </div>
          </div>
        </div>
        <span className="font-mono text-pitch/40 group-hover:text-pitch/70 text-lg transition-colors">→</span>
      </button>
    </div>
  );
}

function MatchRow({
  match,
  timezone,
  lang,
  dict,
  onSelect,
}: {
  match: Match;
  timezone: string;
  lang: Locale;
  dict: Record<string, Record<string, string>>;
  onSelect: () => void;
}) {
  const t = dict.home ?? {};
  const time = formatMatchTime(match.datetime, timezone, lang);

  return (
    <div className="bg-chalk border-2 border-ink rounded-xl px-3 py-3 card-shadow flex items-center gap-2.5 group min-h-[60px]">
      {/* Time */}
      <div className="font-mono text-whistle text-xs font-bold min-w-[46px] text-center shrink-0">
        {time}
      </div>

      {/* Teams */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-ink flex-wrap">
          <span className="shrink-0">{flagEmoji(match.homeTeam)}</span>
          <span className="truncate max-w-[80px] sm:max-w-none">{match.homeTeam}</span>
          <span className="text-ink/30 font-mono text-xs shrink-0">vs</span>
          <span className="shrink-0">{flagEmoji(match.awayTeam)}</span>
          <span className="truncate max-w-[80px] sm:max-w-none">{match.awayTeam}</span>
        </div>
        <div className="font-mono text-ink/40 text-xs mt-0.5 truncate">
          {match.group && (
            <span className="text-pitch font-bold mr-1.5">
              {lang === 'es' ? 'Grupo' : 'Group'} {match.group}
            </span>
          )}
          {match.city}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onSelect}
        className="shrink-0 bg-pitch text-white font-mono text-xs px-3 py-2.5 rounded-lg hover:bg-pitch-line active:scale-95 transition-all min-h-[40px]"
      >
        {t.organize ?? 'Organizar'}
      </button>
    </div>
  );
}
