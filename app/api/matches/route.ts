import { NextResponse } from "next/server";

const API_KEY = "7f4bc2c1832544f6b0dff6a3e38c7f96";

const COMPETITIONS = [
  { code: "CL", name: "Champions League", emoji: "🏆", featured: true },
  { code: "PL", name: "Premier League", emoji: "⚽", featured: true },
  { code: "PD", name: "LaLiga", emoji: "⚽", featured: false },
  { code: "BL1", name: "Bundesliga", emoji: "⚽", featured: false },
  { code: "SA", name: "Serie A", emoji: "⚽", featured: false },
];

export async function GET() {
  try {
    const allMatches: any[] = [];

    for (const comp of COMPETITIONS) {
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${comp.code}/matches?status=SCHEDULED`,
        { headers: { "X-Auth-Token": API_KEY! } }
      );

      if (!res.ok) continue;

      const data = await res.json();
      const matches = data.matches?.slice(0, 4).map((m: any) => ({
        id: m.id,
        home: m.homeTeam.shortName || m.homeTeam.name,
        away: m.awayTeam.shortName || m.awayTeam.name,
        league: comp.name,
        date: new Date(m.utcDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        venue: m.venue || "TBC",
        city: m.area?.name || "Europe",
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
