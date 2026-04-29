import { NextResponse } from "next/server";

const API_KEY = "7f4bc2c1832544f6b0dff6a3e38c7f96";

const COMPETITIONS = [
  { code: "CL", name: "Champions League", emoji: "🏆", featured: true },
  { code: "PL", name: "Premier League", emoji: "⚽", featured: true },
  { code: "PD", name: "LaLiga", emoji: "⚽", featured: false },
  { code: "BL1", name: "Bundesliga", emoji: "⚽", featured: false },
  { code: "SA", name: "Serie A", emoji: "⚽", featured: false },
];

const cityMap: Record<string, string> = {
  // Full names
  "Paris Saint-Germain": "Paris", "Bayern München": "Munich",
  "Arsenal FC": "London", "Chelsea FC": "London", "Tottenham Hotspur FC": "London",
  "West Ham United FC": "London", "Fulham FC": "London", "Brentford FC": "London",
  "Crystal Palace FC": "London", "Manchester City FC": "Manchester", "Manchester United FC": "Manchester",
  "Real Madrid CF": "Madrid", "Atlético de Madrid": "Madrid",
  "FC Barcelona": "Barcelona", "Villarreal CF": "Villarreal", "Valencia CF": "Valencia",
  "Sevilla FC": "Seville", "Athletic Club": "Bilbao", "Real Sociedad": "San Sebastian",
  "Juventus FC": "Turin", "AC Milan": "Milan", "FC Internazionale Milano": "Milan",
  "SSC Napoli": "Naples", "AS Roma": "Rome", "SS Lazio": "Rome",
  "ACF Fiorentina": "Florence", "Atalanta BC": "Bergamo",
  "Borussia Dortmund": "Dortmund", "Bayer 04 Leverkusen": "Leverkusen",
  "RB Leipzig": "Leipzig", "Eintracht Frankfurt": "Frankfurt",
  "Liverpool FC": "Liverpool", "Everton FC": "Liverpool",
  "Newcastle United FC": "Newcastle", "Aston Villa FC": "Birmingham",
  "Brighton & Hove Albion FC": "Brighton", "Leicester City FC": "Leicester",
  "Leeds United FC": "Leeds", "Burnley FC": "Burnley",
  "PSV Eindhoven": "Eindhoven", "AFC Ajax": "Amsterdam",
  "SL Benfica": "Lisbon", "FC Porto": "Porto",
  // Short names
  "Atleti": "Madrid", "PSG": "Paris", "Bayern": "Munich", "Barça": "Barcelona",
  "Arsenal": "London", "Chelsea": "London", "Spurs": "London",
  "West Ham": "London", "Fulham": "London", "Brentford": "London", "Palace": "London",
  "Man City": "Manchester", "Man United": "Manchester",
  "Real Madrid": "Madrid", "Barcelona": "Barcelona",
  "Villarreal": "Villarreal", "Valencia": "Valencia", "Sevilla": "Seville",
  "Betis": "Seville", "Athletic": "Bilbao", "Sociedad": "San Sebastian",
  "Osasuna": "Pamplona", "Celta": "Vigo", "Getafe": "Madrid", "Rayo": "Madrid",
  "Alaves": "Vitoria", "Girona": "Girona", "Mallorca": "Palma",
  "Juventus": "Turin", "Milan": "Milan", "Inter": "Milan",
  "Napoli": "Naples", "Roma": "Rome", "Lazio": "Rome",
  "Fiorentina": "Florence", "Atalanta": "Bergamo", "Bologna": "Bologna",
  "Torino": "Turin", "Udinese": "Udine", "Cagliari": "Cagliari",
  "Verona": "Verona", "Lecce": "Lecce", "Genoa": "Genoa",
  "Como": "Como", "Venezia": "Venice", "Monza": "Monza",
  "Dortmund": "Dortmund", "Leverkusen": "Leverkusen",
  "Leipzig": "Leipzig", "Frankfurt": "Frankfurt",
  "Stuttgart": "Stuttgart", "Freiburg": "Freiburg", "Augsburg": "Augsburg",
  "Bremen": "Bremen", "Mainz": "Mainz", "Hoffenheim": "Sinsheim",
  "Heidenheim": "Heidenheim", "Juve": "Turin",
  "Liverpool": "Liverpool", "Everton": "Liverpool",
  "Newcastle": "Newcastle", "Villa": "Birmingham", "Brighton": "Brighton",
  "Leicester": "Leicester", "Leeds": "Leeds", "Burnley": "Burnley",
  "Forest": "Nottingham", "Wolves": "Wolverhampton",
  "Southampton": "Southampton", "Ipswich": "Ipswich",
};

export async function GET() {
  try {
    const allMatches: any[] = [];

    for (const comp of COMPETITIONS) {
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${comp.code}/matches?status=SCHEDULED`,
        { headers: { "X-Auth-Token": API_KEY }, next: { revalidate: 3600 } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const matches = data.matches?.slice(0, 6).map((m: any) => ({
        id: m.id,
        home: m.homeTeam?.shortName || m.homeTeam?.name || "TBD",
        away: m.awayTeam?.shortName || m.awayTeam?.name || "TBD",
        league: comp.name,
        date: new Date(m.utcDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        venue: m.venue || "TBC",
        city: m.stage === "FINAL" ? "Munich" :
              cityMap[m.homeTeam?.shortName] ||
              cityMap[m.homeTeam?.name] ||
              m.area?.name || "Europe",
        price: Math.floor(Math.random() * 150) + 50,
        drop: Math.random() > 0.5 ? -(Math.floor(Math.random() * 20) + 5) : null,
        tripFrom: Math.floor(Math.random() * 300) + 200,
        featured: comp.featured,
        emoji: comp.emoji,
      }));
      if (matches?.length) allMatches.push(...matches);
    }

    return NextResponse.json(allMatches);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}