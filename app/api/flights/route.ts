import { NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";

function buildAviasalesUrl(origin: string, dest: string, date: string) {
  try {
    const d = new Date(date + " 2026");
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const search = `https://aviasales.com/search/${origin}${day}${month}${dest}1`;
    return `https://tp.media/r?marker=723474.FT&trs=523774&p=4114&u=${encodeURIComponent(search)}&campaign_id=100`;
  } catch {
    return `https://tp.media/r?marker=723474.FT&trs=523774&p=4114&u=https%3A%2F%2Faviasales.com&campaign_id=100`;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin") || "MAD";
  const dest = searchParams.get("dest") || "LON";
  const date = searchParams.get("date") || "";

  const aviasalesUrl = buildAviasalesUrl(origin, dest, date);

  try {
    const originRes = await fetch(
      `https://sky-scrapper3.p.rapidapi.com/api/v1/flights/searchAirport?query=${origin}&locale=en-US`,
      { headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "sky-scrapper3.p.rapidapi.com" }, next: { revalidate: 3600 } }
    );
    const originData = await originRes.json();
    const originSkyId = originData.data?.[0]?.skyId;
    const originEntityId = originData.data?.[0]?.entityId;

    const destRes = await fetch(
      `https://sky-scrapper3.p.rapidapi.com/api/v1/flights/searchAirport?query=${dest}&locale=en-US`,
      { headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "sky-scrapper3.p.rapidapi.com" }, next: { revalidate: 3600 } }
    );
    const destData = await destRes.json();
    const destSkyId = destData.data?.[0]?.skyId;
    const destEntityId = destData.data?.[0]?.entityId;

    if (!originSkyId || !destSkyId) return NextResponse.json(getFallback(origin, dest, aviasalesUrl));

    const flightRes = await fetch(
      `https://sky-scrapper3.p.rapidapi.com/api/v2/flights/searchFlightsComplete?originSkyId=${originSkyId}&destinationSkyId=${destSkyId}&originEntityId=${originEntityId}&destinationEntityId=${destEntityId}&date=${date}&adults=1&currency=EUR&locale=en-US&market=en-US&cabinClass=economy&countryCode=ES`,
      { headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "sky-scrapper3.p.rapidapi.com" }, next: { revalidate: 3600 } }
    );
    const flightData = await flightRes.json();
    const itineraries = flightData.data?.itineraries?.slice(0, 3) || [];

    if (itineraries.length === 0) return NextResponse.json(getFallback(origin, dest, aviasalesUrl));

    const flights = itineraries.map((it: any, i: number) => ({
      airline: it.legs?.[0]?.carriers?.marketing?.[0]?.name || "Unknown",
      route: `${origin} → ${dest}`,
      duration: formatDuration(it.legs?.[0]?.durationInMinutes),
      price: Math.round(it.price?.raw || 0),
      oldPrice: null,
      badge: i === 0 ? "Cheapest" : null,
      url: aviasalesUrl,
    }));

    return NextResponse.json(flights);
  } catch {
    return NextResponse.json(getFallback(origin, dest, aviasalesUrl));
  }
}

function formatDuration(mins: number) {
  if (!mins) return "Direct";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function getFallback(origin: string, dest: string, url: string) {
  return [
    { airline: "Vueling", route: `${origin} → ${dest}`, duration: "Direct · 2h", price: 72, oldPrice: 94, badge: "Cheapest", url },
    { airline: "Iberia", route: `${origin} → ${dest}`, duration: "Direct · 2h 15m", price: 96, oldPrice: 117, badge: null, url },
    { airline: "Ryanair", route: `${origin} → ${dest}`, duration: "Direct · 2h 30m", price: 54, oldPrice: null, badge: "Early flight", url },
  ];
}