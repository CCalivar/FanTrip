import { NextResponse } from "next/server";

const RAPIDAPI_KEY = "9ea437f52fmsheb8b95077ea0ae9p1e78aajsn605392291ad3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get("team") || "";
  const city = searchParams.get("city") || "";
  const date = searchParams.get("date") || "";

  try {
    // Buscar eventos por equipo + ciudad + fecha
    const dateFormatted = date ? new Date(date + " 2025").toISOString().split("T")[0] : "";
    const nextDay = date ? new Date(new Date(date + " 2025").getTime() + 86400000).toISOString().split("T")[0] : "";

    const url = `https://seatgeek-seatgeekcom.p.rapidapi.com/events?q=${encodeURIComponent(team)}&per_page=5&sort=datetime_utc.asc${dateFormatted ? `&datetime_utc.gte=${dateFormatted}&datetime_utc.lte=${nextDay}` : ""}${city ? `&venue.city=${encodeURIComponent(city)}` : ""}`;

    const res = await fetch(url, {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "seatgeek-seatgeekcom.p.rapidapi.com"
      }
    });

    const data = await res.json();
    const events = data.events || [];

    if (events.length > 0) {
      return NextResponse.json(events.map((e: any, i: number) => ({
        platform: "SeatGeek",
        section: e.title || e.short_title,
        price: Math.round(e.stats?.lowest_price || 89),
        oldPrice: e.stats?.average_price ? Math.round(e.stats.average_price) : null,
        badge: i === 0 ? "Best value" : null,
        delivery: "E-ticket · Instant",
        url: e.url,
      })));
    }

    return NextResponse.json(getFallback(team, city));
  } catch {
    return NextResponse.json(getFallback(team, city));
  }
}

function getFallback(team: string, city: string) {
  return [
    { platform: "StubHub", section: "Best available tickets", price: 89, oldPrice: 108, badge: "Best value", delivery: "E-ticket · Instant", url: `https://www.stubhub.com/search?q=${encodeURIComponent(team)}` },
    { platform: "Viagogo", section: "Premium seats", price: 215, oldPrice: null, badge: null, delivery: "E-ticket · Instant", url: `https://www.viagogo.com/search?q=${encodeURIComponent(team + " " + city)}` },
    { platform: "Ticketmaster", section: "Official tickets", price: 150, oldPrice: null, badge: "Official", delivery: "E-ticket", url: `https://www.ticketmaster.com/search?q=${encodeURIComponent(team)}` },
  ];
}