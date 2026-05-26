'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Match } from '@/data/matches';
import { matches } from '@/data/matches';
import {
  getUserTimezone,
  setUserTimezone,
  hasSeenIntro,
  markIntroSeen,
  hasSeenTimezone,
  markTimezoneSeen,
} from '@/lib/utils';
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
  const [showTimezoneConfirm, setShowTimezoneConfirm] = useState(false);
  const [timezone, setTimezone] = useState('America/Mexico_City');
  const [detectedTz, setDetectedTz] = useState('');
  const [showTzSelector, setShowTzSelector] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedDay, setSelectedDay] = useState<{ matches: Match[]; dayLabel: string } | null>(
    null
  );

  useEffect(() => {
    const tz = getUserTimezone();
    setTimezone(tz);
    try {
      setDetectedTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch { /* ignore */ }

    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.get('intro') === '1';

    if (!hasSeenIntro() || forceIntro) {
      setShowIntro(true);
      // Clean the param so a refresh doesn't re-trigger the intro
      if (forceIntro) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    } else if (!hasSeenTimezone()) {
      setShowTimezoneConfirm(true);
    }
  }, []);

  const handleIntroClose = useCallback(() => {
    markIntroSeen();
    setShowIntro(false);
    if (!hasSeenTimezone()) setShowTimezoneConfirm(true);
  }, []);

  // Called from the mandatory full-screen selector
  const handleTimezoneConfirm = useCallback((tz: string) => {
    setTimezone(tz);
    setUserTimezone(tz);
    markTimezoneSeen();
    setShowTimezoneConfirm(false);
  }, []);

  // Called from the normal bottom-sheet selector
  const handleTimezoneChange = useCallback((tz: string) => {
    setTimezone(tz);
    setUserTimezone(tz);
    setShowTzSelector(false);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMatch(null);
    setSelectedDay(null);
  }, []);

  const t = dict as Record<string, Record<string, string>>;

  const now = new Date();
  const upcoming = matches.filter((m) => new Date(m.datetime) > now);

  const showModal = selectedMatch !== null || selectedDay !== null;

  return (
    <div className="min-h-dvh flex flex-col">
      {showIntro && (
        <IntroAnimation lang={lang} dict={t} onClose={handleIntroClose} />
      )}

      {showTimezoneConfirm && (
        <TimezoneSelector
          lang={lang}
          dict={t}
          current={timezone}
          detected={detectedTz}
          onSelect={handleTimezoneConfirm}
          mandatory={true}
        />
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

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-4 sm:pt-6 pb-safe">
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
            onSelectDay={(ms, dayLabel) => setSelectedDay({ matches: ms, dayLabel })}
          />
        )}

        <AdSlot className="mt-8" label={t.ad?.label} />
      </main>

      {showModal && (
        <MeetingModal
          target={selectedMatch ? { match: selectedMatch } : selectedDay!}
          timezone={timezone}
          lang={lang}
          dict={t}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
