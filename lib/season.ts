// Computes the current European football season label (e.g. "2026/27") from
// today's date instead of a hardcoded string. European domestic leagues
// (Premier League, LaLiga, Bundesliga, Serie A) and the Champions League
// group stage all kick off in August, so July 1 is used as the season
// rollover point: before it, we're still in the season that started the
// previous August; on/after it, the new season has begun (or is about to).
//
// This exists because "2024/25" and later "2025/26" were hardcoded in
// multiple places (league page body copy, league metadata titles) and went
// stale every single year without anyone noticing until a live-site check.
// Always import this instead of hardcoding a season string.
export function getCurrentSeasonLabel(date: Date = new Date()): string {
  const year = date.getFullYear();
  const rolloverMonth = 6; // 0-indexed: 6 = July
  const startYear = date.getMonth() >= rolloverMonth ? year : year - 1;
  const endYearShort = String((startYear + 1) % 100).padStart(2, "0");
  return `${startYear}/${endYearShort}`;
}
