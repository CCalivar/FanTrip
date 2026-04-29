import { NextResponse } from "next/server";

const RAPIDAPI_KEY = "9ea437f52fmsheb8b95077ea0ae9p1e78aajsn605392291ad3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get("team") || "";

  try {
    // Buscar performer en SeatGeek
    const performerRes = await fetch(
      `https://seatgeek-seatgeekcom.p.rapidapi.com/performers?q=${encodeURIComponent(team)}&per_page=1`,
      { headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "seatgeek-seatgeekcom.p.rapidapi.com" } }
    );
    const performerData = await performerRes.json();
    const performer = performerData.performers?.[0];

    if (!performer) return NextResponse.json(getFallback(team));

    // Buscar eventos de ese performer
    const eventsRes = await fetch(
      `https://seatgeek-seatgeekcom.p.rapidapi.com/events?performers.id=${performer.id}&per_page=3&sort=datetime_utc.asc`,
      { headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "seatgeek-seatgeekcom.p.rapidapi.com" } }
    );
    const eventsData = await eventsRes.json();
    const events = eventsData.events || [];

    if (events.length === 0) return NextResponse.json(getFallback(team));

    return NextResponse.json(events.map((e: any, i: number) => ({
      platform: "SeatGeek",
      section: e.title || e.short_title || team,
      price: Math.round(e.stats?.lowest_price || 89),
      oldPrice: e.stats?.average_price ? Math.round(e.stats.average_price) : null,
      badge: i === 0 ? "Best value" : null,
      delivery: "E-ticket · Instant",
      url: e.url,
    })));
  } catch {
    return NextResponse.json(getFallback(team));
  }
}

function getFallback(team: string) {
  return [
    { platform: "StubHub", section: "Category B — Best available", price: 89, oldPrice: 108, badge: "Best value", delivery: "E-ticket · Instant", url: `https://www.stubhub.com/search?q=${encodeURIComponent(team)}` },
    { platform: "Viagogo", section: "Category A — Premium seats", price: 215, oldPrice: null, badge: null, delivery: "E-ticket · Instant", url: `https://www.viagogo.com/search?q=${encodeURIComponent(team)}` },
    { platform: "Ticketmaster", section: "Official tickets", price: 150, oldPrice: null, badge: "Official", delivery: "E-ticket", url: `https://www.ticketmaster.com/search?q=${encodeURIComponent(team)}` },
  ];
}