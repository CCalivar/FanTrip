import { NextResponse } from "next/server";

const RAPIDAPI_KEY = "9ea437f52fmsheb8b95077ea0ae9p1e78aajsn605392291ad3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "London";
  const checkin = searchParams.get("checkin") || "";
  const checkout = searchParams.get("checkout") || "";

  try {
    // Step 1: get destination id
    const destRes = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(city)}`,
      { headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "booking-com15.p.rapidapi.com" } }
    );
    const destData = await destRes.json();
    const destId = destData.data?.[0]?.dest_id;
    const destType = destData.data?.[0]?.dest_type || "city";

    if (!destId) return NextResponse.json(getFallback(city));

    // Step 2: search hotels
    const hotelRes = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=${destType}&arrival_date=${checkin}&departure_date=${checkout}&adults=1&room_qty=1&page_number=1&languagecode=en-us&currency_code=EUR`,
      { headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "booking-com15.p.rapidapi.com" } }
    );
    const hotelData = await hotelRes.json();
    const hotels = hotelData.data?.hotels?.slice(0, 3) || [];

    if (hotels.length === 0) return NextResponse.json(getFallback(city));

    return NextResponse.json(hotels.map((h: any, i: number) => ({
      name: h.property?.name || "Hotel",
      distance: h.property?.wishlistName || `${city} centre`,
      details: "Free cancellation",
      price: Math.round(h.property?.priceBreakdown?.grossPrice?.value || 80),
      oldPrice: null,
      badge: i === 0 ? "Best value" : null,
      url: `https://www.booking.com/hotel/${h.property?.countryCode}/${h.property?.id}.html`,
    })));
  } catch {
    return NextResponse.json(getFallback(city));
  }
}

function getFallback(city: string) {
  return [
    { name: `Ibis ${city} Centro`, distance: "0.8km from stadium", details: "Free cancellation", price: 67, oldPrice: 89, badge: "Best value", url: `https://www.booking.com/search.html?ss=${encodeURIComponent(city)}` },
    { name: `NH Collection ${city}`, distance: "0.3km from stadium", details: "Breakfast included", price: 124, oldPrice: null, badge: null, url: `https://www.booking.com/search.html?ss=${encodeURIComponent(city)}` },
    { name: "Marriott", distance: "1.2km from stadium", details: "Free cancellation", price: 98, oldPrice: 115, badge: null, url: `https://www.booking.com/search.html?ss=${encodeURIComponent(city)}` },
  ];
}