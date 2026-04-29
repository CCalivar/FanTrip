import { NextResponse } from "next/server";

const API_KEY = process.env.TICKETMASTER_API_KEY || "ozpMSyHUQfwnyqotKNcJGqjsFmAHvpcs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get("team") || "";

  try {
    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(team)}&classificationName=football&locale=*&apikey=${API_KEY}&size=5`
    );
    const data = await res.json();
    const events = data._embedded?.events || [];
    const tickets = events.map((e: any) => ({
      platform: "Ticketmaster",
      section: e.name,
      price: e.priceRanges?.[0]?.min || 89,
      oldPrice: null,
      badge: "Official",
      delivery: "E-ticket · Instant",
      url: e.url,
    }));
    return NextResponse.json(tickets.length > 0 ? tickets : [
      { platform: "StubHub", section: "Category B", price: 89, oldPrice: 108, badge: "Best value", delivery: "E-ticket · Instant", url: `https://www.stubhub.com/search?q=${encodeURIComponent(team)}` },
      { platform: "Viagogo", section: "Category A", price: 215, oldPrice: null, badge: null, delivery: "E-ticket · Instant", url: `https://www.viagogo.com/search?q=${encodeURIComponent(team)}` },
    ]);
  } catch {
    return NextResponse.json([]);
  }
}