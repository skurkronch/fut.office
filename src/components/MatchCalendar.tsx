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
}

export default function MatchCalendar({ matches, timezone, lang, dict, onSelectMatch }: Props) {
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
}: {
  header: string;
  matches: Match[];
  timezone: string;
  lang: Locale;
  dict: Record<string, Record<string, string>>;
  onSelectMatch: (match: Match) => void;
}) {
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
    <div className="bg-chalk border-2 border-ink rounded-xl p-3.5 card-shadow flex items-center gap-3 group">
      {/* Time */}
      <div className="font-mono text-whistle text-xs font-bold min-w-[52px] text-center">
        {time}
      </div>

      {/* Teams */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span>{flagEmoji(match.homeTeam)}</span>
          <span className="truncate">{match.homeTeam}</span>
          <span className="text-ink/30 font-mono text-xs">vs</span>
          <span>{flagEmoji(match.awayTeam)}</span>
          <span className="truncate">{match.awayTeam}</span>
        </div>
        <div className="font-mono text-ink/40 text-xs mt-0.5 truncate">
          {match.group && (
            <span className="text-pitch font-bold mr-1.5">
              {lang === 'es' ? 'Grupo' : 'Group'} {match.group}
            </span>
          )}
          {match.city}, {match.country}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onSelect}
        className="shrink-0 bg-pitch text-chalk font-mono text-xs px-3 py-2 rounded-lg hover:bg-pitch-line active:scale-95 transition-all"
      >
        {t.organize ?? 'Organizar'}
      </button>
    </div>
  );
}
