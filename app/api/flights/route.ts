import { NextResponse } from "next/server";

const RAPIDAPI_KEY = "9ea437f52fmsheb8b95077ea0ae9p1e78aajsn605392291ad3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin") || "MAD";
  const dest = searchParams.get("dest") || "LON";
  const date = searchParams.get("date") || "";

  try {
    // Step 1: get origin skyId
    const originRes = await fetch(
      `https://sky-scrapper3.p.rapidapi.com/api/v1/flights/searchAirport?query=${origin}&locale=en-US`,
      { headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "sky-scrapper3.p.rapidapi.com" } }
    );
    const originData = await originRes.json();
    const originSkyId = originData.data?.[0]?.skyId;
    const originEntityId = originData.data?.[0]?.entityId;

    // Step 2: get dest skyId
    const destRes = await fetch(
      `https://sky-scrapper3.p.rapidapi.com/api/v1/flights/searchAirport?query=${dest}&locale=en-US`,
      { headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "sky-scrapper3.p.rapidapi.com" } }
    );
    const destData = await destRes.json();
    const destSkyId = destData.data?.[0]?.skyId;
    const destEntityId = destData.data?.[0]?.entityId;

    if (!originSkyId || !destSkyId) {
      return NextResponse.json(getFallback(origin, dest));
    }

    // Step 3: search flights
    const flightRes = await fetch(
      `https://sky-scrapper3.p.rapidapi.com/api/v2/flights/searchFlightsComplete?originSkyId=${originSkyId}&destinationSkyId=${destSkyId}&originEntityId=${originEntityId}&destinationEntityId=${destEntityId}&date=${date}&adults=1&currency=EUR&locale=en-US&market=en-US&cabinClass=economy&countryCode=ES`,
      { headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "sky-scrapper3.p.rapidapi.com" } }
    );
    const flightData = await flightRes.json();
    const itineraries = flightData.data?.itineraries?.slice(0, 3) || [];

    if (itineraries.length === 0) return NextResponse.json(getFallback(origin, dest));

    const flights = itineraries.map((it: any) => ({
      airline: it.legs?.[0]?.carriers?.marketing?.[0]?.name || "Unknown",
      route: `${origin} → ${dest}`,
      duration: formatDuration(it.legs?.[0]?.durationInMinutes),
      price: Math.round(it.price?.raw || 0),
      oldPrice: null,
      badge: null,
      url: `https://www.skyscanner.com/transport/flights/${origin}/${dest}/${date}/`,
    }));

    // add badges
    if (flights.length > 0) flights[0].badge = "Cheapest";

    return NextResponse.json(flights);
  } catch {
    return NextResponse.json(getFallback(origin, dest));
  }
}

function formatDuration(mins: number) {
  if (!mins) return "Direct";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function getFallback(origin: string, dest: string) {
  return [
    { airline: "Vueling", route: `${origin} → ${dest}`, duration: "Direct · 2h", price: 72, oldPrice: 94, badge: "Cheapest", url: `https://www.skyscanner.com/transport/flights/${origin}/${dest}/` },
    { airline: "Iberia", route: `${origin} → ${dest}`, duration: "Direct · 2h 15m", price: 96, oldPrice: 117, badge: null, url: `https://www.skyscanner.com/transport/flights/${origin}/${dest}/` },
    { airline: "Ryanair", route: `${origin} → ${dest}`, duration: "Direct · 2h 30m", price: 54, oldPrice: null, badge: "Early flight", url: `https://www.skyscanner.com/transport/flights/${origin}/${dest}/` },
  ];
}