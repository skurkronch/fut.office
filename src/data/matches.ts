export type Stage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'bronze' | 'final';
export type GroupLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export interface Match {
  id: string;
  stage: Stage;
  group?: GroupLetter;
  matchday?: number;
  datetime: string; // ISO 8601 UTC
  homeTeam: string;
  awayTeam: string;
  venue: string;
  city: string;
  country: string;
}

interface VenueConfig {
  venue: string;
  city: string;
  country: string;
}

interface GroupConfig {
  id: GroupLetter;
  teams: [string, string, string, string];
  md1: string;
  md2: string;
  md3: string;
  venues: [VenueConfig, VenueConfig];
}

const GROUP_CONFIGS: GroupConfig[] = [
  {
    id: 'A',
    teams: ['Mexico', 'Poland', 'Cameroon', 'Uzbekistan'],
    md1: '2026-06-11', md2: '2026-06-18', md3: '2026-06-25',
    venues: [
      { venue: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico' },
      { venue: 'NRG Stadium', city: 'Houston', country: 'USA' },
    ],
  },
  {
    id: 'B',
    teams: ['USA', 'Panama', 'Morocco', 'South Africa'],
    md1: '2026-06-12', md2: '2026-06-19', md3: '2026-06-25',
    venues: [
      { venue: 'MetLife Stadium', city: 'East Rutherford', country: 'USA' },
      { venue: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA' },
    ],
  },
  {
    id: 'C',
    teams: ['Canada', 'Japan', 'Serbia', 'New Zealand'],
    md1: '2026-06-13', md2: '2026-06-20', md3: '2026-06-26',
    venues: [
      { venue: 'BMO Field', city: 'Toronto', country: 'Canada' },
      { venue: 'BC Place', city: 'Vancouver', country: 'Canada' },
    ],
  },
  {
    id: 'D',
    teams: ['Argentina', 'Ecuador', 'Nigeria', 'Australia'],
    md1: '2026-06-13', md2: '2026-06-20', md3: '2026-06-26',
    venues: [
      { venue: 'SoFi Stadium', city: 'Inglewood', country: 'USA' },
      { venue: 'AT&T Stadium', city: 'Arlington', country: 'USA' },
    ],
  },
  {
    id: 'E',
    teams: ['Germany', 'Colombia', 'Senegal', 'South Korea'],
    md1: '2026-06-14', md2: '2026-06-21', md3: '2026-06-26',
    venues: [
      { venue: 'Lumen Field', city: 'Seattle', country: 'USA' },
      { venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA' },
    ],
  },
  {
    id: 'F',
    teams: ['Spain', 'Chile', 'Iran', 'Qatar'],
    md1: '2026-06-14', md2: '2026-06-21', md3: '2026-06-26',
    venues: [
      { venue: 'Gillette Stadium', city: 'Foxborough', country: 'USA' },
      { venue: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA' },
    ],
  },
  {
    id: 'G',
    teams: ['Brazil', 'Uruguay', 'Denmark', 'Iraq'],
    md1: '2026-06-15', md2: '2026-06-22', md3: '2026-06-27',
    venues: [
      { venue: "Levi's Stadium", city: 'Santa Clara', country: 'USA' },
      { venue: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA' },
    ],
  },
  {
    id: 'H',
    teams: ['England', 'France', 'Tunisia', 'Jamaica'],
    md1: '2026-06-15', md2: '2026-06-22', md3: '2026-06-27',
    venues: [
      { venue: 'Estadio Akron', city: 'Zapopan', country: 'Mexico' },
      { venue: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico' },
    ],
  },
  {
    id: 'I',
    teams: ['Portugal', 'Netherlands', 'Ivory Coast', 'Indonesia'],
    md1: '2026-06-16', md2: '2026-06-23', md3: '2026-06-27',
    venues: [
      { venue: 'MetLife Stadium', city: 'East Rutherford', country: 'USA' },
      { venue: "Levi's Stadium", city: 'Santa Clara', country: 'USA' },
    ],
  },
  {
    id: 'J',
    teams: ['Belgium', 'Croatia', 'Egypt', 'Venezuela'],
    md1: '2026-06-16', md2: '2026-06-23', md3: '2026-06-27',
    venues: [
      { venue: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA' },
      { venue: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA' },
    ],
  },
  {
    id: 'K',
    teams: ['Italy', 'Switzerland', 'Costa Rica', 'Ghana'],
    md1: '2026-06-17', md2: '2026-06-24', md3: '2026-06-27',
    venues: [
      { venue: 'NRG Stadium', city: 'Houston', country: 'USA' },
      { venue: 'AT&T Stadium', city: 'Arlington', country: 'USA' },
    ],
  },
  {
    id: 'L',
    teams: ['Turkey', 'Saudi Arabia', 'Scotland', 'DR Congo'],
    md1: '2026-06-17', md2: '2026-06-24', md3: '2026-06-27',
    venues: [
      { venue: 'SoFi Stadium', city: 'Inglewood', country: 'USA' },
      { venue: 'Lumen Field', city: 'Seattle', country: 'USA' },
    ],
  },
];

function generateGroupMatches(cfg: GroupConfig): Match[] {
  const { id, teams, md1, md2, md3, venues } = cfg;
  const matchups = [
    { md: 1, date: md1, home: 0, away: 2, time: '18:00', vi: 0 },
    { md: 1, date: md1, home: 1, away: 3, time: '21:00', vi: 1 },
    { md: 2, date: md2, home: 0, away: 3, time: '18:00', vi: 0 },
    { md: 2, date: md2, home: 1, away: 2, time: '21:00', vi: 1 },
    { md: 3, date: md3, home: 0, away: 1, time: '22:00', vi: 0 },
    { md: 3, date: md3, home: 2, away: 3, time: '22:00', vi: 1 },
  ] as const;

  return matchups.map((m, i) => ({
    id: `grp-${id.toLowerCase()}-${i + 1}`,
    stage: 'group' as Stage,
    group: id as GroupLetter,
    matchday: m.md,
    datetime: `${m.date}T${m.time}:00Z`,
    homeTeam: teams[m.home],
    awayTeam: teams[m.away],
    ...venues[m.vi],
  }));
}

const groupMatches: Match[] = GROUP_CONFIGS.flatMap(generateGroupMatches);

const knockoutMatches: Match[] = [
  // Round of 32 — June 29 to July 2 (16 matches)
  { id: 'r32-1',  stage: 'r32', datetime: '2026-06-29T18:00:00Z', homeTeam: 'Winner Group A', awayTeam: 'Best 3rd (D/E/F)', venue: 'MetLife Stadium', city: 'East Rutherford', country: 'USA' },
  { id: 'r32-2',  stage: 'r32', datetime: '2026-06-29T21:00:00Z', homeTeam: 'Winner Group C', awayTeam: 'Runner-up Group D', venue: 'SoFi Stadium', city: 'Inglewood', country: 'USA' },
  { id: 'r32-3',  stage: 'r32', datetime: '2026-06-29T18:00:00Z', homeTeam: 'Winner Group B', awayTeam: 'Best 3rd (A/C/L)', venue: 'AT&T Stadium', city: 'Arlington', country: 'USA' },
  { id: 'r32-4',  stage: 'r32', datetime: '2026-06-29T21:00:00Z', homeTeam: 'Winner Group D', awayTeam: 'Runner-up Group C', venue: 'NRG Stadium', city: 'Houston', country: 'USA' },
  { id: 'r32-5',  stage: 'r32', datetime: '2026-06-30T18:00:00Z', homeTeam: 'Winner Group E', awayTeam: 'Best 3rd (G/H/I)', venue: 'Lumen Field', city: 'Seattle', country: 'USA' },
  { id: 'r32-6',  stage: 'r32', datetime: '2026-06-30T21:00:00Z', homeTeam: 'Winner Group G', awayTeam: 'Runner-up Group H', venue: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA' },
  { id: 'r32-7',  stage: 'r32', datetime: '2026-06-30T18:00:00Z', homeTeam: 'Winner Group F', awayTeam: 'Best 3rd (B/J/K)', venue: 'Gillette Stadium', city: 'Foxborough', country: 'USA' },
  { id: 'r32-8',  stage: 'r32', datetime: '2026-06-30T21:00:00Z', homeTeam: 'Winner Group H', awayTeam: 'Runner-up Group G', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA' },
  { id: 'r32-9',  stage: 'r32', datetime: '2026-07-01T18:00:00Z', homeTeam: 'Winner Group I', awayTeam: 'Best 3rd (A/B/C)', venue: 'BMO Field', city: 'Toronto', country: 'Canada' },
  { id: 'r32-10', stage: 'r32', datetime: '2026-07-01T21:00:00Z', homeTeam: 'Winner Group K', awayTeam: 'Runner-up Group L', venue: 'BC Place', city: 'Vancouver', country: 'Canada' },
  { id: 'r32-11', stage: 'r32', datetime: '2026-07-01T18:00:00Z', homeTeam: 'Winner Group J', awayTeam: 'Best 3rd (F/G/H)', venue: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico' },
  { id: 'r32-12', stage: 'r32', datetime: '2026-07-01T21:00:00Z', homeTeam: 'Winner Group L', awayTeam: 'Runner-up Group K', venue: 'Estadio Akron', city: 'Zapopan', country: 'Mexico' },
  { id: 'r32-13', stage: 'r32', datetime: '2026-07-02T18:00:00Z', homeTeam: 'Runner-up Group A', awayTeam: 'Runner-up Group B', venue: "Levi's Stadium", city: 'Santa Clara', country: 'USA' },
  { id: 'r32-14', stage: 'r32', datetime: '2026-07-02T21:00:00Z', homeTeam: 'Runner-up Group E', awayTeam: 'Runner-up Group F', venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA' },
  { id: 'r32-15', stage: 'r32', datetime: '2026-07-02T18:00:00Z', homeTeam: 'Runner-up Group I', awayTeam: 'Runner-up Group J', venue: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA' },
  { id: 'r32-16', stage: 'r32', datetime: '2026-07-02T21:00:00Z', homeTeam: 'Best 3rd Overall', awayTeam: 'Best 3rd Group 2', venue: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico' },

  // Round of 16 — July 4-7 (8 matches)
  { id: 'r16-1', stage: 'r16', datetime: '2026-07-04T18:00:00Z', homeTeam: 'R32 Match 1 Winner', awayTeam: 'R32 Match 2 Winner', venue: 'MetLife Stadium', city: 'East Rutherford', country: 'USA' },
  { id: 'r16-2', stage: 'r16', datetime: '2026-07-04T21:00:00Z', homeTeam: 'R32 Match 3 Winner', awayTeam: 'R32 Match 4 Winner', venue: 'SoFi Stadium', city: 'Inglewood', country: 'USA' },
  { id: 'r16-3', stage: 'r16', datetime: '2026-07-05T18:00:00Z', homeTeam: 'R32 Match 5 Winner', awayTeam: 'R32 Match 6 Winner', venue: 'AT&T Stadium', city: 'Arlington', country: 'USA' },
  { id: 'r16-4', stage: 'r16', datetime: '2026-07-05T21:00:00Z', homeTeam: 'R32 Match 7 Winner', awayTeam: 'R32 Match 8 Winner', venue: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA' },
  { id: 'r16-5', stage: 'r16', datetime: '2026-07-06T18:00:00Z', homeTeam: 'R32 Match 9 Winner',  awayTeam: 'R32 Match 10 Winner', venue: 'NRG Stadium', city: 'Houston', country: 'USA' },
  { id: 'r16-6', stage: 'r16', datetime: '2026-07-06T21:00:00Z', homeTeam: 'R32 Match 11 Winner', awayTeam: 'R32 Match 12 Winner', venue: 'Gillette Stadium', city: 'Foxborough', country: 'USA' },
  { id: 'r16-7', stage: 'r16', datetime: '2026-07-07T18:00:00Z', homeTeam: 'R32 Match 13 Winner', awayTeam: 'R32 Match 14 Winner', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA' },
  { id: 'r16-8', stage: 'r16', datetime: '2026-07-07T21:00:00Z', homeTeam: 'R32 Match 15 Winner', awayTeam: 'R32 Match 16 Winner', venue: "Levi's Stadium", city: 'Santa Clara', country: 'USA' },

  // Quarterfinals — July 10-11 (4 matches)
  { id: 'qf-1', stage: 'qf', datetime: '2026-07-10T18:00:00Z', homeTeam: 'R16 Match 1 Winner', awayTeam: 'R16 Match 2 Winner', venue: 'MetLife Stadium', city: 'East Rutherford', country: 'USA' },
  { id: 'qf-2', stage: 'qf', datetime: '2026-07-10T21:00:00Z', homeTeam: 'R16 Match 3 Winner', awayTeam: 'R16 Match 4 Winner', venue: 'SoFi Stadium', city: 'Inglewood', country: 'USA' },
  { id: 'qf-3', stage: 'qf', datetime: '2026-07-11T18:00:00Z', homeTeam: 'R16 Match 5 Winner', awayTeam: 'R16 Match 6 Winner', venue: 'AT&T Stadium', city: 'Arlington', country: 'USA' },
  { id: 'qf-4', stage: 'qf', datetime: '2026-07-11T21:00:00Z', homeTeam: 'R16 Match 7 Winner', awayTeam: 'R16 Match 8 Winner', venue: 'NRG Stadium', city: 'Houston', country: 'USA' },

  // Semifinals — July 14-15 (2 matches)
  { id: 'sf-1', stage: 'sf', datetime: '2026-07-14T21:00:00Z', homeTeam: 'QF 1 Winner', awayTeam: 'QF 2 Winner', venue: 'MetLife Stadium', city: 'East Rutherford', country: 'USA' },
  { id: 'sf-2', stage: 'sf', datetime: '2026-07-15T21:00:00Z', homeTeam: 'QF 3 Winner', awayTeam: 'QF 4 Winner', venue: 'SoFi Stadium', city: 'Inglewood', country: 'USA' },

  // Third place — July 18
  { id: 'bronze', stage: 'bronze', datetime: '2026-07-18T21:00:00Z', homeTeam: 'SF 1 Loser', awayTeam: 'SF 2 Loser', venue: 'AT&T Stadium', city: 'Arlington', country: 'USA' },

  // Final — July 19
  { id: 'final', stage: 'final', datetime: '2026-07-19T21:00:00Z', homeTeam: 'SF 1 Winner', awayTeam: 'SF 2 Winner', venue: 'MetLife Stadium', city: 'East Rutherford', country: 'USA' },
];

export const matches: Match[] = [...groupMatches, ...knockoutMatches];

export function getMatchesByDate(date: string): Match[] {
  return matches.filter((m) => m.datetime.startsWith(date));
}

export function getUpcomingMatches(now: Date = new Date()): Match[] {
  return matches.filter((m) => new Date(m.datetime) > now);
}

export function getMatchById(id: string): Match | undefined {
  return matches.find((m) => m.id === id);
}

export function groupMatchesByDay(matchList: Match[]): Map<string, Match[]> {
  const map = new Map<string, Match[]>();
  for (const m of matchList) {
    const day = m.datetime.slice(0, 10);
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(m);
  }
  return map;
}

export const STAGE_LABELS: Record<Stage, { es: string; en: string }> = {
  group:  { es: 'Fase de Grupos', en: 'Group Stage' },
  r32:    { es: 'Ronda de 32',    en: 'Round of 32' },
  r16:    { es: 'Octavos de Final', en: 'Round of 16' },
  qf:     { es: 'Cuartos de Final', en: 'Quarterfinals' },
  sf:     { es: 'Semifinales',    en: 'Semifinals' },
  bronze: { es: 'Tercer Lugar',   en: 'Third Place' },
  final:  { es: 'Final',          en: 'Final' },
};
