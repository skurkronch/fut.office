export type Stage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'bronze' | 'final';
export type GroupLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export interface Match {
  id: string;
  stage: Stage;
  group?: GroupLetter;
  matchday?: 1 | 2 | 3;
  datetime: string; // ISO 8601 UTC
  homeTeam: string;
  awayTeam: string;
  venue: string;
  city: string;
  country: string;
}

// ─── GROUP STAGE (Matches 1–72) ────────────────────────────────────────────
// UTC times computed from official local kickoff × venue UTC offset (summer 2026)
// Venue offsets: MEX City/GDL/MTY UTC-6 | TOR/ATL/MIA/NYC/BOS/PHI UTC-4
//                HOU/DAL/KC UTC-5 | LA/SF/SEA/VAN UTC-7

const groupMatches: Match[] = [
  // ── GROUP A ─────────────────────────────────────────────────────────────
  { id: 'm1',  stage:'group', group:'A', matchday:1, datetime:'2026-06-11T19:00:00Z', homeTeam:'Mexico',       awayTeam:'South Africa',  venue:"Estadio Azteca",        city:'Mexico City',  country:'Mexico' },
  { id: 'm2',  stage:'group', group:'A', matchday:1, datetime:'2026-06-12T02:00:00Z', homeTeam:'Korea Republic',awayTeam:'Czechia',       venue:"Estadio Akron",         city:'Guadalajara',  country:'Mexico' },
  { id: 'm25', stage:'group', group:'A', matchday:2, datetime:'2026-06-18T16:00:00Z', homeTeam:'Czechia',      awayTeam:'South Africa',  venue:"Mercedes-Benz Stadium", city:'Atlanta',      country:'USA' },
  { id: 'm28', stage:'group', group:'A', matchday:2, datetime:'2026-06-19T01:00:00Z', homeTeam:'Mexico',       awayTeam:'Korea Republic',venue:"Estadio Akron",         city:'Guadalajara',  country:'Mexico' },
  { id: 'm53', stage:'group', group:'A', matchday:3, datetime:'2026-06-25T01:00:00Z', homeTeam:'Czechia',      awayTeam:'Mexico',        venue:"Estadio Azteca",        city:'Mexico City',  country:'Mexico' },
  { id: 'm54', stage:'group', group:'A', matchday:3, datetime:'2026-06-25T01:00:00Z', homeTeam:'South Africa', awayTeam:'Korea Republic',venue:"Estadio BBVA",          city:'Monterrey',    country:'Mexico' },

  // ── GROUP B ─────────────────────────────────────────────────────────────
  { id: 'm3',  stage:'group', group:'B', matchday:1, datetime:'2026-06-12T19:00:00Z', homeTeam:'Canada',               awayTeam:'Bosnia and Herzegovina', venue:"BMO Field",      city:'Toronto',      country:'Canada' },
  { id: 'm8',  stage:'group', group:'B', matchday:1, datetime:'2026-06-13T19:00:00Z', homeTeam:'Qatar',                awayTeam:'Switzerland',            venue:"Levi's Stadium", city:'San Francisco', country:'USA' },
  { id: 'm26', stage:'group', group:'B', matchday:2, datetime:'2026-06-18T19:00:00Z', homeTeam:'Switzerland',          awayTeam:'Bosnia and Herzegovina', venue:"SoFi Stadium",   city:'Los Angeles',  country:'USA' },
  { id: 'm27', stage:'group', group:'B', matchday:2, datetime:'2026-06-18T22:00:00Z', homeTeam:'Canada',               awayTeam:'Qatar',                  venue:"BC Place",       city:'Vancouver',    country:'Canada' },
  { id: 'm51', stage:'group', group:'B', matchday:3, datetime:'2026-06-24T19:00:00Z', homeTeam:'Switzerland',          awayTeam:'Canada',                 venue:"BC Place",       city:'Vancouver',    country:'Canada' },
  { id: 'm52', stage:'group', group:'B', matchday:3, datetime:'2026-06-24T19:00:00Z', homeTeam:'Bosnia and Herzegovina',awayTeam:'Qatar',                 venue:"Lumen Field",    city:'Seattle',      country:'USA' },

  // ── GROUP C ─────────────────────────────────────────────────────────────
  { id: 'm7',  stage:'group', group:'C', matchday:1, datetime:'2026-06-13T22:00:00Z', homeTeam:'Brazil',  awayTeam:'Morocco',  venue:"MetLife Stadium",        city:'New York',     country:'USA' },
  { id: 'm5',  stage:'group', group:'C', matchday:1, datetime:'2026-06-14T01:00:00Z', homeTeam:'Haiti',   awayTeam:'Scotland', venue:"Gillette Stadium",       city:'Boston',       country:'USA' },
  { id: 'm30', stage:'group', group:'C', matchday:2, datetime:'2026-06-19T22:00:00Z', homeTeam:'Scotland',awayTeam:'Morocco',  venue:"Gillette Stadium",       city:'Boston',       country:'USA' },
  { id: 'm29', stage:'group', group:'C', matchday:2, datetime:'2026-06-20T01:00:00Z', homeTeam:'Brazil',  awayTeam:'Haiti',    venue:"Lincoln Financial Field", city:'Philadelphia', country:'USA' },
  { id: 'm49', stage:'group', group:'C', matchday:3, datetime:'2026-06-24T22:00:00Z', homeTeam:'Scotland',awayTeam:'Brazil',   venue:"Hard Rock Stadium",      city:'Miami',        country:'USA' },
  { id: 'm50', stage:'group', group:'C', matchday:3, datetime:'2026-06-24T22:00:00Z', homeTeam:'Morocco', awayTeam:'Haiti',    venue:"Mercedes-Benz Stadium",  city:'Atlanta',      country:'USA' },

  // ── GROUP D ─────────────────────────────────────────────────────────────
  { id: 'm4',  stage:'group', group:'D', matchday:1, datetime:'2026-06-13T01:00:00Z', homeTeam:'USA',      awayTeam:'Paraguay',  venue:"SoFi Stadium",   city:'Los Angeles',   country:'USA' },
  { id: 'm6',  stage:'group', group:'D', matchday:1, datetime:'2026-06-14T04:00:00Z', homeTeam:'Australia',awayTeam:'Türkiye',   venue:"BC Place",        city:'Vancouver',     country:'Canada' },
  { id: 'm32', stage:'group', group:'D', matchday:2, datetime:'2026-06-19T19:00:00Z', homeTeam:'USA',      awayTeam:'Australia', venue:"Lumen Field",     city:'Seattle',       country:'USA' },
  { id: 'm31', stage:'group', group:'D', matchday:2, datetime:'2026-06-20T03:00:00Z', homeTeam:'Türkiye',  awayTeam:'Paraguay',  venue:"Levi's Stadium",  city:'San Francisco', country:'USA' },
  { id: 'm59', stage:'group', group:'D', matchday:3, datetime:'2026-06-26T02:00:00Z', homeTeam:'Türkiye',  awayTeam:'USA',       venue:"SoFi Stadium",    city:'Los Angeles',   country:'USA' },
  { id: 'm60', stage:'group', group:'D', matchday:3, datetime:'2026-06-26T02:00:00Z', homeTeam:'Paraguay', awayTeam:'Australia', venue:"Levi's Stadium",  city:'San Francisco', country:'USA' },

  // ── GROUP E ─────────────────────────────────────────────────────────────
  { id: 'm10', stage:'group', group:'E', matchday:1, datetime:'2026-06-14T17:00:00Z', homeTeam:'Germany',     awayTeam:'Curaçao',    venue:"NRG Stadium",            city:'Houston',      country:'USA' },
  { id: 'm9',  stage:'group', group:'E', matchday:1, datetime:'2026-06-14T23:00:00Z', homeTeam:'Ivory Coast', awayTeam:'Ecuador',    venue:"Lincoln Financial Field", city:'Philadelphia', country:'USA' },
  { id: 'm33', stage:'group', group:'E', matchday:2, datetime:'2026-06-20T20:00:00Z', homeTeam:'Germany',     awayTeam:'Ivory Coast',venue:"BMO Field",              city:'Toronto',      country:'Canada' },
  { id: 'm34', stage:'group', group:'E', matchday:2, datetime:'2026-06-21T00:00:00Z', homeTeam:'Ecuador',     awayTeam:'Curaçao',    venue:"Arrowhead Stadium",      city:'Kansas City',  country:'USA' },
  { id: 'm55', stage:'group', group:'E', matchday:3, datetime:'2026-06-25T20:00:00Z', homeTeam:'Curaçao',     awayTeam:'Ivory Coast',venue:"Lincoln Financial Field", city:'Philadelphia', country:'USA' },
  { id: 'm56', stage:'group', group:'E', matchday:3, datetime:'2026-06-25T20:00:00Z', homeTeam:'Ecuador',     awayTeam:'Germany',    venue:"MetLife Stadium",        city:'New York',     country:'USA' },

  // ── GROUP F ─────────────────────────────────────────────────────────────
  { id: 'm11', stage:'group', group:'F', matchday:1, datetime:'2026-06-14T20:00:00Z', homeTeam:'Netherlands',awayTeam:'Japan',        venue:"AT&T Stadium",    city:'Dallas',       country:'USA' },
  { id: 'm12', stage:'group', group:'F', matchday:1, datetime:'2026-06-15T02:00:00Z', homeTeam:'Sweden',     awayTeam:'Tunisia',      venue:"Estadio BBVA",    city:'Monterrey',    country:'Mexico' },
  { id: 'm35', stage:'group', group:'F', matchday:2, datetime:'2026-06-20T17:00:00Z', homeTeam:'Netherlands',awayTeam:'Sweden',       venue:"NRG Stadium",     city:'Houston',      country:'USA' },
  { id: 'm36', stage:'group', group:'F', matchday:2, datetime:'2026-06-21T04:00:00Z', homeTeam:'Tunisia',    awayTeam:'Japan',        venue:"Estadio BBVA",    city:'Monterrey',    country:'Mexico' },
  { id: 'm57', stage:'group', group:'F', matchday:3, datetime:'2026-06-25T23:00:00Z', homeTeam:'Japan',      awayTeam:'Sweden',       venue:"AT&T Stadium",    city:'Dallas',       country:'USA' },
  { id: 'm58', stage:'group', group:'F', matchday:3, datetime:'2026-06-25T23:00:00Z', homeTeam:'Tunisia',    awayTeam:'Netherlands',  venue:"Arrowhead Stadium",city:'Kansas City', country:'USA' },

  // ── GROUP G ─────────────────────────────────────────────────────────────
  { id: 'm16', stage:'group', group:'G', matchday:1, datetime:'2026-06-15T19:00:00Z', homeTeam:'Belgium',    awayTeam:'Egypt',        venue:"Lumen Field",  city:'Seattle',     country:'USA' },
  { id: 'm15', stage:'group', group:'G', matchday:1, datetime:'2026-06-16T01:00:00Z', homeTeam:'Iran',       awayTeam:'New Zealand',  venue:"SoFi Stadium", city:'Los Angeles', country:'USA' },
  { id: 'm39', stage:'group', group:'G', matchday:2, datetime:'2026-06-21T19:00:00Z', homeTeam:'Belgium',    awayTeam:'Iran',         venue:"SoFi Stadium", city:'Los Angeles', country:'USA' },
  { id: 'm40', stage:'group', group:'G', matchday:2, datetime:'2026-06-22T01:00:00Z', homeTeam:'New Zealand',awayTeam:'Egypt',        venue:"BC Place",     city:'Vancouver',   country:'Canada' },
  { id: 'm63', stage:'group', group:'G', matchday:3, datetime:'2026-06-27T03:00:00Z', homeTeam:'Egypt',      awayTeam:'Iran',         venue:"Lumen Field",  city:'Seattle',     country:'USA' },
  { id: 'm64', stage:'group', group:'G', matchday:3, datetime:'2026-06-27T03:00:00Z', homeTeam:'New Zealand',awayTeam:'Belgium',      venue:"BC Place",     city:'Vancouver',   country:'Canada' },

  // ── GROUP H ─────────────────────────────────────────────────────────────
  { id: 'm14', stage:'group', group:'H', matchday:1, datetime:'2026-06-15T16:00:00Z', homeTeam:'Spain',       awayTeam:'Cabo Verde',  venue:"Mercedes-Benz Stadium", city:'Atlanta', country:'USA' },
  { id: 'm13', stage:'group', group:'H', matchday:1, datetime:'2026-06-15T22:00:00Z', homeTeam:'Saudi Arabia',awayTeam:'Uruguay',     venue:"Hard Rock Stadium",     city:'Miami',   country:'USA' },
  { id: 'm38', stage:'group', group:'H', matchday:2, datetime:'2026-06-21T16:00:00Z', homeTeam:'Spain',       awayTeam:'Saudi Arabia',venue:"Mercedes-Benz Stadium", city:'Atlanta', country:'USA' },
  { id: 'm37', stage:'group', group:'H', matchday:2, datetime:'2026-06-21T22:00:00Z', homeTeam:'Uruguay',     awayTeam:'Cabo Verde',  venue:"Hard Rock Stadium",     city:'Miami',   country:'USA' },
  { id: 'm65', stage:'group', group:'H', matchday:3, datetime:'2026-06-27T00:00:00Z', homeTeam:'Cabo Verde',  awayTeam:'Saudi Arabia',venue:"NRG Stadium",           city:'Houston', country:'USA' },
  { id: 'm66', stage:'group', group:'H', matchday:3, datetime:'2026-06-27T00:00:00Z', homeTeam:'Uruguay',     awayTeam:'Spain',       venue:"Estadio Akron",         city:'Guadalajara', country:'Mexico' },

  // ── GROUP I ─────────────────────────────────────────────────────────────
  { id: 'm17', stage:'group', group:'I', matchday:1, datetime:'2026-06-16T19:00:00Z', homeTeam:'France',  awayTeam:'Senegal', venue:"MetLife Stadium",        city:'New York',     country:'USA' },
  { id: 'm18', stage:'group', group:'I', matchday:1, datetime:'2026-06-16T22:00:00Z', homeTeam:'Iraq',    awayTeam:'Norway',  venue:"Gillette Stadium",       city:'Boston',       country:'USA' },
  { id: 'm42', stage:'group', group:'I', matchday:2, datetime:'2026-06-22T21:00:00Z', homeTeam:'France',  awayTeam:'Iraq',    venue:"Lincoln Financial Field", city:'Philadelphia', country:'USA' },
  { id: 'm41', stage:'group', group:'I', matchday:2, datetime:'2026-06-23T00:00:00Z', homeTeam:'Norway',  awayTeam:'Senegal', venue:"MetLife Stadium",        city:'New York',     country:'USA' },
  { id: 'm61', stage:'group', group:'I', matchday:3, datetime:'2026-06-26T19:00:00Z', homeTeam:'Norway',  awayTeam:'France',  venue:"Gillette Stadium",       city:'Boston',       country:'USA' },
  { id: 'm62', stage:'group', group:'I', matchday:3, datetime:'2026-06-26T19:00:00Z', homeTeam:'Senegal', awayTeam:'Iraq',    venue:"BMO Field",              city:'Toronto',      country:'Canada' },

  // ── GROUP J ─────────────────────────────────────────────────────────────
  { id: 'm19', stage:'group', group:'J', matchday:1, datetime:'2026-06-17T01:00:00Z', homeTeam:'Argentina',awayTeam:'Algeria',  venue:"Arrowhead Stadium", city:'Kansas City',   country:'USA' },
  { id: 'm20', stage:'group', group:'J', matchday:1, datetime:'2026-06-17T04:00:00Z', homeTeam:'Austria',  awayTeam:'Jordan',   venue:"Levi's Stadium",    city:'San Francisco', country:'USA' },
  { id: 'm43', stage:'group', group:'J', matchday:2, datetime:'2026-06-22T17:00:00Z', homeTeam:'Argentina',awayTeam:'Austria',  venue:"AT&T Stadium",      city:'Dallas',        country:'USA' },
  { id: 'm44', stage:'group', group:'J', matchday:2, datetime:'2026-06-23T03:00:00Z', homeTeam:'Jordan',   awayTeam:'Algeria',  venue:"Levi's Stadium",    city:'San Francisco', country:'USA' },
  { id: 'm69', stage:'group', group:'J', matchday:3, datetime:'2026-06-28T02:00:00Z', homeTeam:'Algeria',  awayTeam:'Austria',  venue:"Arrowhead Stadium", city:'Kansas City',   country:'USA' },
  { id: 'm70', stage:'group', group:'J', matchday:3, datetime:'2026-06-28T02:00:00Z', homeTeam:'Jordan',   awayTeam:'Argentina',venue:"AT&T Stadium",      city:'Dallas',        country:'USA' },

  // ── GROUP K ─────────────────────────────────────────────────────────────
  { id: 'm23', stage:'group', group:'K', matchday:1, datetime:'2026-06-17T17:00:00Z', homeTeam:'Portugal',   awayTeam:'Congo DR',  venue:"NRG Stadium",          city:'Houston',     country:'USA' },
  { id: 'm24', stage:'group', group:'K', matchday:1, datetime:'2026-06-18T02:00:00Z', homeTeam:'Uzbekistan', awayTeam:'Colombia',  venue:"Estadio Azteca",       city:'Mexico City', country:'Mexico' },
  { id: 'm47', stage:'group', group:'K', matchday:2, datetime:'2026-06-23T17:00:00Z', homeTeam:'Portugal',   awayTeam:'Uzbekistan',venue:"NRG Stadium",          city:'Houston',     country:'USA' },
  { id: 'm48', stage:'group', group:'K', matchday:2, datetime:'2026-06-24T02:00:00Z', homeTeam:'Colombia',   awayTeam:'Congo DR',  venue:"Estadio Akron",        city:'Guadalajara', country:'Mexico' },
  { id: 'm71', stage:'group', group:'K', matchday:3, datetime:'2026-06-27T23:30:00Z', homeTeam:'Colombia',   awayTeam:'Portugal',  venue:"Hard Rock Stadium",    city:'Miami',       country:'USA' },
  { id: 'm72', stage:'group', group:'K', matchday:3, datetime:'2026-06-27T23:30:00Z', homeTeam:'Congo DR',   awayTeam:'Uzbekistan',venue:"Mercedes-Benz Stadium",city:'Atlanta',     country:'USA' },

  // ── GROUP L ─────────────────────────────────────────────────────────────
  { id: 'm22', stage:'group', group:'L', matchday:1, datetime:'2026-06-17T20:00:00Z', homeTeam:'England', awayTeam:'Croatia', venue:"AT&T Stadium",        city:'Dallas',       country:'USA' },
  { id: 'm21', stage:'group', group:'L', matchday:1, datetime:'2026-06-17T23:00:00Z', homeTeam:'Ghana',   awayTeam:'Panama',  venue:"BMO Field",           city:'Toronto',      country:'Canada' },
  { id: 'm45', stage:'group', group:'L', matchday:2, datetime:'2026-06-23T20:00:00Z', homeTeam:'England', awayTeam:'Ghana',   venue:"Gillette Stadium",    city:'Boston',       country:'USA' },
  { id: 'm46', stage:'group', group:'L', matchday:2, datetime:'2026-06-23T23:00:00Z', homeTeam:'Panama',  awayTeam:'Croatia', venue:"BMO Field",           city:'Toronto',      country:'Canada' },
  { id: 'm67', stage:'group', group:'L', matchday:3, datetime:'2026-06-27T21:00:00Z', homeTeam:'Panama',  awayTeam:'England', venue:"MetLife Stadium",     city:'New York',     country:'USA' },
  { id: 'm68', stage:'group', group:'L', matchday:3, datetime:'2026-06-27T21:00:00Z', homeTeam:'Croatia', awayTeam:'Ghana',   venue:"Lincoln Financial Field", city:'Philadelphia', country:'USA' },
];

// ─── KNOCKOUT STAGE (Matches 73–104) ───────────────────────────────────────
const knockoutMatches: Match[] = [
  // Round of 32
  { id: 'm73',  stage:'r32', datetime:'2026-06-28T19:00:00Z', homeTeam:'Grp A Runner-up',  awayTeam:'Grp B Runner-up',        venue:"SoFi Stadium",          city:'Los Angeles',   country:'USA' },
  { id: 'm76',  stage:'r32', datetime:'2026-06-29T17:00:00Z', homeTeam:'Grp C Winner',     awayTeam:'Grp F Runner-up',        venue:"NRG Stadium",           city:'Houston',       country:'USA' },
  { id: 'm74',  stage:'r32', datetime:'2026-06-29T20:30:00Z', homeTeam:'Grp E Winner',     awayTeam:'Best 3rd (A/B/C/D/F)',  venue:"Gillette Stadium",      city:'Boston',        country:'USA' },
  { id: 'm75',  stage:'r32', datetime:'2026-06-30T01:00:00Z', homeTeam:'Grp F Winner',     awayTeam:'Grp C Runner-up',        venue:"Estadio BBVA",          city:'Monterrey',     country:'Mexico' },
  { id: 'm78',  stage:'r32', datetime:'2026-06-30T17:00:00Z', homeTeam:'Grp E Runner-up',  awayTeam:'Grp I Runner-up',        venue:"AT&T Stadium",          city:'Dallas',        country:'USA' },
  { id: 'm77',  stage:'r32', datetime:'2026-06-30T21:00:00Z', homeTeam:'Grp I Winner',     awayTeam:'Best 3rd (C/D/F/G/H)',  venue:"MetLife Stadium",       city:'New York',      country:'USA' },
  { id: 'm79',  stage:'r32', datetime:'2026-07-01T01:00:00Z', homeTeam:'Grp A Winner',     awayTeam:'Best 3rd (C/E/F/H/I)',  venue:"Estadio Azteca",        city:'Mexico City',   country:'Mexico' },
  { id: 'm80',  stage:'r32', datetime:'2026-07-01T16:00:00Z', homeTeam:'Grp L Winner',     awayTeam:'Best 3rd (E/H/I/J/K)',  venue:"Mercedes-Benz Stadium", city:'Atlanta',       country:'USA' },
  { id: 'm82',  stage:'r32', datetime:'2026-07-01T20:00:00Z', homeTeam:'Grp G Winner',     awayTeam:'Best 3rd (A/E/H/I/J)',  venue:"Lumen Field",           city:'Seattle',       country:'USA' },
  { id: 'm81',  stage:'r32', datetime:'2026-07-02T00:00:00Z', homeTeam:'Grp D Winner',     awayTeam:'Best 3rd (B/E/F/I/J)',  venue:"Levi's Stadium",        city:'San Francisco', country:'USA' },
  { id: 'm84',  stage:'r32', datetime:'2026-07-02T19:00:00Z', homeTeam:'Grp H Winner',     awayTeam:'Grp J Runner-up',        venue:"SoFi Stadium",          city:'Los Angeles',   country:'USA' },
  { id: 'm83',  stage:'r32', datetime:'2026-07-02T23:00:00Z', homeTeam:'Grp K Runner-up',  awayTeam:'Grp L Runner-up',        venue:"BMO Field",             city:'Toronto',       country:'Canada' },
  { id: 'm85',  stage:'r32', datetime:'2026-07-03T03:00:00Z', homeTeam:'Grp B Winner',     awayTeam:'Best 3rd (E/F/G/I/J)',  venue:"BC Place",              city:'Vancouver',     country:'Canada' },
  { id: 'm88',  stage:'r32', datetime:'2026-07-03T18:00:00Z', homeTeam:'Grp D Runner-up',  awayTeam:'Grp G Runner-up',        venue:"AT&T Stadium",          city:'Dallas',        country:'USA' },
  { id: 'm86',  stage:'r32', datetime:'2026-07-03T22:00:00Z', homeTeam:'Grp J Winner',     awayTeam:'Grp H Runner-up',        venue:"Hard Rock Stadium",     city:'Miami',         country:'USA' },
  { id: 'm87',  stage:'r32', datetime:'2026-07-04T01:30:00Z', homeTeam:'Grp K Winner',     awayTeam:'Best 3rd (D/E/I/J/L)',  venue:"Arrowhead Stadium",     city:'Kansas City',   country:'USA' },

  // Round of 16
  { id: 'm90',  stage:'r16', datetime:'2026-07-04T17:00:00Z', homeTeam:'M73 Winner', awayTeam:'M75 Winner', venue:"NRG Stadium",            city:'Houston',       country:'USA' },
  { id: 'm89',  stage:'r16', datetime:'2026-07-04T21:00:00Z', homeTeam:'M74 Winner', awayTeam:'M77 Winner', venue:"Lincoln Financial Field", city:'Philadelphia',  country:'USA' },
  { id: 'm91',  stage:'r16', datetime:'2026-07-05T20:00:00Z', homeTeam:'M76 Winner', awayTeam:'M78 Winner', venue:"MetLife Stadium",        city:'New York',      country:'USA' },
  { id: 'm92',  stage:'r16', datetime:'2026-07-06T00:00:00Z', homeTeam:'M79 Winner', awayTeam:'M80 Winner', venue:"Estadio Azteca",         city:'Mexico City',   country:'Mexico' },
  { id: 'm93',  stage:'r16', datetime:'2026-07-06T19:00:00Z', homeTeam:'M83 Winner', awayTeam:'M84 Winner', venue:"AT&T Stadium",           city:'Dallas',        country:'USA' },
  { id: 'm94',  stage:'r16', datetime:'2026-07-07T00:00:00Z', homeTeam:'M81 Winner', awayTeam:'M82 Winner', venue:"Lumen Field",            city:'Seattle',       country:'USA' },
  { id: 'm95',  stage:'r16', datetime:'2026-07-07T16:00:00Z', homeTeam:'M86 Winner', awayTeam:'M88 Winner', venue:"Mercedes-Benz Stadium",  city:'Atlanta',       country:'USA' },
  { id: 'm96',  stage:'r16', datetime:'2026-07-07T20:00:00Z', homeTeam:'M85 Winner', awayTeam:'M87 Winner', venue:"BC Place",               city:'Vancouver',     country:'Canada' },

  // Quarterfinals
  { id: 'm97',  stage:'qf',  datetime:'2026-07-09T20:00:00Z', homeTeam:'M89 Winner', awayTeam:'M90 Winner', venue:"Gillette Stadium",       city:'Boston',       country:'USA' },
  { id: 'm98',  stage:'qf',  datetime:'2026-07-10T19:00:00Z', homeTeam:'M93 Winner', awayTeam:'M94 Winner', venue:"SoFi Stadium",           city:'Los Angeles',  country:'USA' },
  { id: 'm99',  stage:'qf',  datetime:'2026-07-11T21:00:00Z', homeTeam:'M91 Winner', awayTeam:'M92 Winner', venue:"Hard Rock Stadium",      city:'Miami',        country:'USA' },
  { id: 'm100', stage:'qf',  datetime:'2026-07-12T01:00:00Z', homeTeam:'M95 Winner', awayTeam:'M96 Winner', venue:"Arrowhead Stadium",      city:'Kansas City',  country:'USA' },

  // Semifinals
  { id: 'm101', stage:'sf',  datetime:'2026-07-14T19:00:00Z', homeTeam:'M97 Winner', awayTeam:'M98 Winner', venue:"AT&T Stadium",           city:'Dallas',       country:'USA' },
  { id: 'm102', stage:'sf',  datetime:'2026-07-15T19:00:00Z', homeTeam:'M99 Winner', awayTeam:'M100 Winner',venue:"Mercedes-Benz Stadium",  city:'Atlanta',      country:'USA' },

  // Third place
  { id: 'm103', stage:'bronze', datetime:'2026-07-18T21:00:00Z', homeTeam:'M101 Loser', awayTeam:'M102 Loser',  venue:"Hard Rock Stadium", city:'Miami',        country:'USA' },

  // Final
  { id: 'm104', stage:'final',  datetime:'2026-07-19T19:00:00Z', homeTeam:'M101 Winner',awayTeam:'M102 Winner', venue:"MetLife Stadium",   city:'New York',     country:'USA' },
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

export const STAGE_LABELS: Record<Stage, Record<string, string>> = {
  group:  { es: 'Fase de Grupos',    en: 'Group Stage',    pt: 'Fase de Grupos',    fr: 'Phase de Groupes' },
  r32:    { es: 'Ronda de 32',       en: 'Round of 32',    pt: 'Rodada de 32',      fr: 'Tour de 32' },
  r16:    { es: 'Octavos de Final',  en: 'Round of 16',    pt: 'Oitavas de Final',  fr: 'Huitièmes de finale' },
  qf:     { es: 'Cuartos de Final',  en: 'Quarterfinals',  pt: 'Quartas de Final',  fr: 'Quarts de finale' },
  sf:     { es: 'Semifinales',       en: 'Semifinals',     pt: 'Semifinais',        fr: 'Demi-finales' },
  bronze: { es: 'Tercer Lugar',      en: 'Third Place',    pt: 'Terceiro Lugar',    fr: 'Troisième place' },
  final:  { es: 'Final',             en: 'Final',          pt: 'Final',             fr: 'Finale' },
};
