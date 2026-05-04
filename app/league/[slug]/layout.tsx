import { Metadata } from "next";

const leagueMeta: Record<string, { title: string; description: string }> = {
  "champions-league": {
    title: "Champions League Tickets 2025/26 — Cheap UCL Tickets & Travel",
    description: "Find cheap Champions League tickets for all 2025/26 fixtures. Compare prices from StubHub, Viagogo and Ticketmaster. Book flights and hotels from your city.",
  },
  "premier-league": {
    title: "Premier League Tickets 2025/26 — Cheap Away Match Tickets",
    description: "Find cheap Premier League tickets for all 2025/26 matches. Arsenal, Man City, Liverpool and more. Compare prices and book your full trip.",
  },
  "laliga": {
    title: "LaLiga Tickets 2025/26 — Cheap Spanish Football Tickets",
    description: "Find cheap LaLiga tickets. Real Madrid, Barcelona, Atlético and more. Compare prices and book flights and hotels from your city.",
  },
  "bundesliga": {
    title: "Bundesliga Tickets 2025/26 — Cheap German Football Tickets",
    description: "Find cheap Bundesliga tickets. Bayern Munich, Dortmund, Leverkusen and more. Compare prices and book flights and hotels.",
  },
  "serie-a": {
    title: "Serie A Tickets 2025/26 — Cheap Italian Football Tickets",
    description: "Find cheap Serie A tickets. Inter Milan, AC Milan, Juventus and more. Compare prices and book your full trip.",
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = leagueMeta[params.slug] || {
    title: "Football League Tickets",
    description: "Find cheap football tickets and book your full trip.",
  };
  return { title: meta.title, description: meta.description };
}

export default function LeagueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}