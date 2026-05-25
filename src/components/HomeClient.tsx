'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Match } from '@/data/matches';
import { matches } from '@/data/matches';
import { getUserTimezone, setUserTimezone, hasSeenIntro, markIntroSeen } from '@/lib/utils';
import IntroAnimation from './IntroAnimation';
import NavBar from './NavBar';
import TimezoneSelector from './TimezoneSelector';
import MatchCalendar from './MatchCalendar';
import MeetingModal from './MeetingModal';
import AdSlot from './AdSlot';

interface Props {
  lang: Locale;
  dict: Record<string, unknown>;
}

export default function HomeClient({ lang, dict }: Props) {
  const [showIntro, setShowIntro] = useState(false);
  const [timezone, setTimezone] = useState('America/Mexico_City');
  const [showTzSelector, setShowTzSelector] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    setTimezone(getUserTimezone());
    if (!hasSeenIntro()) setShowIntro(true);
  }, []);

  const handleIntroClose = useCallback(() => {
    markIntroSeen();
    setShowIntro(false);
  }, []);

  const handleTimezoneChange = useCallback((tz: string) => {
    setTimezone(tz);
    setUserTimezone(tz);
    setShowTzSelector(false);
  }, []);

  const t = dict as Record<string, Record<string, string>>;

  const now = new Date();
  const upcoming = matches.filter((m) => new Date(m.datetime) > now);

  return (
    <div className="min-h-dvh flex flex-col">
      {showIntro && (
        <IntroAnimation lang={lang} dict={t} onClose={handleIntroClose} />
      )}

      <NavBar
        lang={lang}
        dict={t}
        timezone={timezone}
        onTimezoneClick={() => setShowTzSelector(true)}
      />

      {showTzSelector && (
        <TimezoneSelector
          lang={lang}
          dict={t}
          current={timezone}
          onSelect={handleTimezoneChange}
          onClose={() => setShowTzSelector(false)}
        />
      )}

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <AdSlot className="mb-6" label={t.ad?.label} />

        {upcoming.length === 0 ? (
          <p className="text-center text-ink/60 py-16 font-mono text-sm">
            {t.home?.noMoreMatches}
          </p>
        ) : (
          <MatchCalendar
            matches={upcoming}
            timezone={timezone}
            lang={lang}
            dict={t}
            onSelectMatch={setSelectedMatch}
          />
        )}

        <AdSlot className="mt-8" label={t.ad?.label} />
      </main>

      {selectedMatch && (
        <MeetingModal
          match={selectedMatch}
          timezone={timezone}
          lang={lang}
          dict={t}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
