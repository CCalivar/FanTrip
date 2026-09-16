import { Metadata } from "next";
import { getCurrentSeasonLabel } from "@/lib/season";

function buildLeagueMeta(season: string, calendarYear: number): Record<string, { title: string; description: string }> {
  return {
    "champions-league": {
      title: `Champions League Tickets ${season} — Cheap UCL Tickets & Travel`,
      description: `Find cheap Champions League tickets for all ${season} fixtures. Compare prices from StubHub, Viagogo and Ticketmaster. Book flights and hotels from your city.`,
    },
    "premier-league": {
      title: `Premier League Tickets ${season} — Cheap Away Match Tickets`,
      description: `Find cheap Premier League tickets for all ${season} matches. Arsenal, Man City, Liverpool and more. Compare prices and book your full trip.`,
    },
    "laliga": {
      title: `LaLiga Tickets ${season} — Cheap Spanish Football Tickets`,
      description: "Find cheap LaLiga tickets. Real Madrid, Barcelona, Atlético and more. Compare prices and book flights and hotels from your city.",
    },
    "bundesliga": {
      title: `Bundesliga Tickets ${season} — Cheap German Football Tickets`,
      description: "Find cheap Bundesliga tickets. Bayern Munich, Dortmund, Leverkusen and more. Compare prices and book flights and hotels.",
    },
    "serie-a": {
      title: `Serie A Tickets ${season} — Cheap Italian Football Tickets`,
      description: "Find cheap Serie A tickets. Inter Milan, AC Milan, Juventus and more. Compare prices and book your full trip.",
    },
    "brasileirao": {
      // Brasileirão runs on the calendar year (Jan–Dec), not the Aug–May
      // European season convention used above — do not reuse `season` here.
      title: `Brasileirão Tickets ${calendarYear} — Cheap Brazilian Football Tickets`,
      description: `Find tickets for Brasileirão ${calendarYear} matches. Flamengo, Palmeiras, Corinthians, São Paulo and more. Compare prices and book flights and hotels from your city.`,
    },
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const leagueMeta = buildLeagueMeta(getCurrentSeasonLabel(), new Date().getFullYear());
  const meta = leagueMeta[slug] || {
    title: "Football League Tickets",
    description: "Find cheap football tickets and book your full trip.",
  };
  return { title: meta.title, description: meta.description };
}

export default function LeagueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}