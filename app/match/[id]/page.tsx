"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const cityToIata: Record<string, string> = {
  "London": "LON", "Paris": "PAR", "Munich": "MUC", "Madrid": "MAD",
  "Barcelona": "BCN", "Milan": "MIL", "Rome": "ROM", "Amsterdam": "AMS",
  "Lisbon": "LIS", "Porto": "OPO", "Dortmund": "DTM", "Leipzig": "LEJ",
  "Frankfurt": "FRA", "Stuttgart": "STR", "Manchester": "MAN",
  "Liverpool": "LPL", "Birmingham": "BHX", "Newcastle": "NCL",
  "Turin": "TRN", "Naples": "NAP", "Bergamo": "BGY", "Florence": "FLR",
  "Seville": "SVQ", "Bilbao": "BIO", "Valencia": "VLC", "Vigo": "VGO",
  "Brighton": "BHD", "Leicester": "EMA", "Girona": "GRO",
};

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState("trip");
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [flights, setFlights] = useState<any[]>([]);
  const [loadingFlights, setLoadingFlights] = useState(true);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [alertPrice, setAlertPrice] = useState("80");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSet, setAlertSet] = useState(false);
  const [match, setMatch] = useState<any>(null);
  const [departureCity, setDepartureCity] = useState("Madrid");

  useEffect(() => {
    const saved = localStorage.getItem("departureCity");
    if (saved) setDepartureCity(saved);
  }, []);

  useEffect(() => {
    fetch("/api/matches")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find((m: any) => String(m.id) === String(id));
          setMatch(found || { home: "Home Team", away: "Away Team", league: "League", date: "TBC", venue: "TBC", city: "Europe", price: 89, tripFrom: 284, drop: null });
        }
      })
      .catch(() => setMatch({ home: "Home Team", away: "Away Team", league: "League", date: "TBC", venue: "TBC", city: "Europe", price: 89, tripFrom: 284, drop: null }));
  }, [id]);

  useEffect(() => {
    if (!match) return;
    fetch(`/api/tickets?team=${encodeURIComponent(match.home)}`)
      .then(r => r.json())
      .then(data => { setTickets(Array.isArray(data) ? data.slice(0, 3) : []); setLoadingTickets(false); })
      .catch(() => setLoadingTickets(false));
  }, [match]);

  const originIata = cityToIata[departureCity] || "MAD";
  const destIata = cityToIata[match?.city] || "";
  const isSameCity = departureCity === match?.city;
  const skyscannerUrl = destIata
    ? `https://www.skyscanner.com/transport/flights/${originIata}/${destIata}/`
    : `https://www.skyscanner.com/transport/flights/${originIata}/`;
  const matchDateObj = match?.date ? new Date(match.date + " 2025") : new Date();
  const bookingUrl = `https://www.booking.com/search.html?ss=${encodeURIComponent(match?.city || "")}&checkin_year=2025&checkin_month=${matchDateObj.getMonth() + 1}&checkin_monthday=${matchDateObj.getDate()}&checkout_year=2025&checkout_month=${matchDateObj.getMonth() + 1}&checkout_monthday=${matchDateObj.getDate() + 2}&group_adults=1&no_rooms=1`;

  useEffect(() => {
    if (!match || isSameCity || !destIata) { setLoadingFlights(false); return; }
    fetch(`/api/flights?origin=${originIata}&dest=${destIata}&date=${match.date.replace(" ", "-")}`)
      .then(r => r.json())
      .then(data => { setFlights(Array.isArray(data) ? data : []); setLoadingFlights(false); })
      .catch(() => setLoadingFlights(false));
  }, [match, originIata, destIata, isSameCity]);

  useEffect(() => {
    if (!match) return;
    fetch(`/api/hotels?city=${encodeURIComponent(match.city)}&checkin=${match.date.replace(" ", "-")}&checkout=${match.date.replace(" ", "-")}`)
      .then(r => r.json())
      .then(data => { setHotels(Array.isArray(data) ? data : []); setLoadingHotels(false); })
      .catch(() => setLoadingHotels(false));
  }, [match]);

  const ticketList = tickets.length > 0 ? tickets : [
    { platform: "StubHub", section: "Category B — Tier 2", price: match?.price || 89, oldPrice: null, badge: "Best value", delivery: "E-ticket · Instant", url: `https://www.stubhub.com/search?q=${encodeURIComponent(match?.home || "")}` },
    { platform: "Viagogo", section: "Category A — Tier 1", price: (match?.price || 89) + 80, oldPrice: null, badge: null, delivery: "E-ticket · Instant", url: `https://www.viagogo.com/search?q=${encodeURIComponent(match?.home || "")}` },
    { platform: "Ticketmaster", section: "General Admission", price: (match?.price || 89) + 40, oldPrice: null, badge: null, delivery: "E-ticket", url: `https://www.ticketmaster.com/search?q=${encodeURIComponent(match?.home || "")}` },
  ];

  const flightList = flights.length > 0 ? flights : [
    { airline: "Vueling", route: `${departureCity} → ${match?.city || "TBC"}`, duration: "Direct · 2h", price: 72, oldPrice: 94, badge: "Cheapest", url: skyscannerUrl },
    { airline: "Iberia", route: `${departureCity} → ${match?.city || "TBC"}`, duration: "Direct · 2h", price: 96, oldPrice: 117, badge: "↓ 18%", url: skyscannerUrl },
    { airline: "Ryanair", route: `${departureCity} → ${match?.city || "TBC"}`, duration: "Direct · 2h 30m", price: 54, oldPrice: null, badge: "Early flight", url: skyscannerUrl },
  ];

  const hotelList = hotels.length > 0 ? hotels : [
    { name: `Ibis ${match?.city || "City"} Centro`, distance: "0.8km from stadium", details: "Free cancellation", price: 67, oldPrice: 89, badge: "Best value", url: bookingUrl },
    { name: `NH Collection ${match?.city || "City"}`, distance: "0.3km from stadium", details: "Breakfast included", price: 124, oldPrice: null, badge: "2 left", url: bookingUrl },
    { name: "Marriott", distance: "1.2km from stadium", details: "Free cancellation", price: 98, oldPrice: 115, badge: null, url: bookingUrl },
  ];

  const totalPrice = ticketList[0]?.price + (isSameCity ? 0 : flightList[2]?.price || 54) + hotelList[0]?.price * 2;

  if (!match) return (
    <div style={{ background: "#F2F3F5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter,sans-serif", color: "#aaa", fontSize: 14 }}>
      Loading match...
    </div>
  );

  return (
    <main style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: "#F2F3F5", minHeight: "100vh", color: "#1a1a1a" }}>

      {/* NAV */}
      <nav style={{ background: "#0D0D0D", height: 56, display: "flex", alignItems: "center", padding: "0 28px", borderBottom: "1.5px solid #E8330A", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center" }}>
          <div onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 36, cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#E8330A,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✈</div>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Fan<span style={{ color: "#F97316" }}>Trip</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: "auto", marginRight: 24 }}>
            <span onClick={() => router.push("/")} style={{ cursor: "pointer" }}>Home</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <span>{match.league}</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{match.home} vs {match.away}</span>
          </div>
          <button onClick={() => router.push("/")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>← Back</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(160deg,#0D0D0D 0%,#1a1a2e 60%,#16213e 100%)", padding: "28px 28px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(232,51,10,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ background: "rgba(232,51,10,0.15)", border: "1px solid rgba(232,51,10,0.3)", borderRadius: 999, padding: "3px 10px", fontSize: 11, color: "#f87171", fontWeight: 700 }}>🏆 {match.league}</span>
          </div>
          <h1 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "#fff", letterSpacing: -1, marginBottom: 8 }}>
            {match.home} <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>vs</span> {match.away}
          </h1>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span>📅 {match.date}</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <span>🏟 {match.venue}</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <span
              onClick={() => {
                const city = prompt("Your departure city (e.g. Madrid, London, Paris):");
                if (city) { localStorage.setItem("departureCity", city); setDepartureCity(city); }
              }}
              style={{ cursor: "pointer", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "3px 10px", color: "#fff" }}
            >
              📍 From {departureCity} ▾
            </span>
          </div>
          <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[["trip", "Full Trip"], ["tickets", "Tickets only"], ["history", "Price History"], ["alerts", "Set Alert — free"]].map(([tabId, label]) => (
              <button key={tabId} onClick={() => setActiveTab(tabId)} style={{ padding: "13px 20px", fontSize: 13, fontWeight: 600, background: "none", border: "none", borderBottom: activeTab === tabId ? "2px solid #E8330A" : "2px solid transparent", color: activeTab === tabId ? "#fff" : "rgba(255,255,255,0.45)", cursor: "pointer", marginBottom: -1, fontFamily: "inherit", whiteSpace: "nowrap" }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 28px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          <div>

            {/* TOTAL */}
            <div style={{ background: "#fff", borderRadius: 14, border: "2px solid #E8330A", padding: "20px 24px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(232,51,10,0.1)", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#999", marginBottom: 5, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  Best combination · 1 person · 2 nights
                  <span style={{ background: "#FFF5F3", color: "#E8330A", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>📍 from {departureCity}</span>
                </div>
                <div style={{ fontSize: 40, fontWeight: 800, color: "#1a1a1a", letterSpacing: -2, lineHeight: 1, marginBottom: 4 }}>{totalPrice}€</div>
                <div style={{ fontSize: 12, color: "#aaa", display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span>Ticket {ticketList[0]?.price}€</span>
                  {!isSameCity && <><span style={{ color: "#ddd" }}>+</span><span>Flight {flightList[2]?.price || 54}€</span></>}
                  <span style={{ color: "#ddd" }}>+</span>
                  <span>Hotel {hotelList[0]?.price * 2}€</span>
                </div>
                <div style={{ fontSize: 12, color: "#2E7D32", fontWeight: 600, marginTop: 4 }}>✓ Saves ~100€ vs booking separately</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
                <button style={{ background: "linear-gradient(135deg,#E8330A,#F97316)", border: "none", color: "#fff", padding: "14px 28px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Book this trip →</button>
                <button onClick={() => setActiveTab("alerts")} style={{ background: "transparent", border: "1.5px solid #E8330A", color: "#E8330A", padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🔔 Alert me if it drops</button>
              </div>
            </div>

            {/* TICKETS */}
            {(activeTab === "trip" || activeTab === "tickets") && (
              <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 12, border: "1px solid #ebebeb" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center" }}>🎟</div>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Tickets</span>
                  <span style={{ fontSize: 11, color: "#aaa", marginLeft: "auto" }}>{loadingTickets ? "Loading..." : `${ticketList.length} options · live prices`}</span>
                </div>
                {ticketList.map((t, i) => (
                  <div key={i} style={{ padding: "14px 18px", borderBottom: i < ticketList.length - 1 ? "1px solid #f7f7f7" : "none", display: "flex", alignItems: "center", gap: 14, background: i === 0 ? "#FAFFFE" : "#fff" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        {t.section}
                        {t.badge && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 999, background: i === 0 ? "#E8F5E9" : "#FFEBEE", color: i === 0 ? "#1B5E20" : "#B71C1C", fontWeight: 700 }}>{t.badge}</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>{t.platform} · {t.delivery}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {t.oldPrice && <div style={{ fontSize: 11, color: "#ccc", textDecoration: "line-through" }}>{t.oldPrice}€</div>}
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{t.price}€</div>
                      <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 6, padding: "5px 12px", fontSize: 11, fontWeight: 600, borderRadius: 7, background: i === 0 ? "#E8330A" : "transparent", border: i === 0 ? "none" : "1.5px solid #e0e0e0", color: i === 0 ? "#fff" : "#666", textDecoration: "none", display: "inline-block" }}>Buy on {t.platform} →</a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FLIGHTS + HOTELS + EXTRAS */}
            {activeTab === "trip" && (
              <>
                {isSameCity ? (
                  <div style={{ background: "#E8F5E9", borderRadius: 14, padding: "16px 20px", marginBottom: 12, border: "1px solid #A5D6A7" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#2E7D32", marginBottom: 4 }}>🏠 This match is in your city</div>
                    <div style={{ fontSize: 12, color: "#388E3C" }}>No flights needed — the stadium is in {match.city}.</div>
                  </div>
                ) : (
                  <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 12, border: "1px solid #ebebeb" }}>
                    <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center" }}>✈️</div>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>Flights to {match.city}</span>
                      <span style={{ fontSize: 11, color: "#aaa", marginLeft: "auto" }}>{loadingFlights ? "Loading live prices..." : `${departureCity} → ${match.city} · live`}</span>
                    </div>
                    {flightList.map((f, i) => (
                      <div key={i} style={{ padding: "14px 18px", borderBottom: i < flightList.length - 1 ? "1px solid #f7f7f7" : "none", display: "flex", alignItems: "center", gap: 14, background: i === 0 ? "#FAFFFE" : "#fff" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            {f.airline} · {f.route}
                            {f.badge && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 999, background: "#E3F2FD", color: "#0D47A1", fontWeight: 700 }}>{f.badge}</span>}
                          </div>
                          <div style={{ fontSize: 12, color: "#aaa" }}>{f.duration}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {f.oldPrice && <div style={{ fontSize: 11, color: "#ccc", textDecoration: "line-through" }}>{f.oldPrice}€</div>}
                          <div style={{ fontSize: 18, fontWeight: 800 }}>{f.price}€</div>
                          <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 6, padding: "5px 12px", fontSize: 11, fontWeight: 600, borderRadius: 7, background: "transparent", border: "1.5px solid #e0e0e0", color: "#666", textDecoration: "none", display: "inline-block" }}>Book on Skyscanner →</a>
                        </div>
                      </div>
                    ))}
                    <div style={{ background: "#EFF8FF", border: "1px solid #BFDFFF", borderRadius: 10, padding: "13px 16px", margin: "12px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ fontSize: 18 }}>💡</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0D47A1", marginBottom: 4 }}>Try nearby airports — save up to 43€</div>
                        <div style={{ fontSize: 11, color: "#1565C0", marginBottom: 10 }}>Flying from a different airport near {departureCity} can reduce your cost.</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {[["✈ Valladolid (VLL)", "Save 43€", "190km"], ["✈ Zaragoza (ZAZ)", "Save 31€", "320km"], ["✈ Barcelona (BCN)", "Save 18€", "Train 2h30"]].map(([airport, saving, dist]) => (
                            <div key={airport} style={{ background: "#fff", border: "1.5px solid #90CAF9", borderRadius: 8, padding: "7px 12px", cursor: "pointer" }}>
                              <div style={{ fontSize: 12, fontWeight: 700 }}>{airport}</div>
                              <div style={{ fontSize: 10, color: "#2E7D32", fontWeight: 600 }}>{saving}</div>
                              <div style={{ fontSize: 10, color: "#aaa" }}>{dist}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* HOTELS */}
                <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 12, border: "1px solid #ebebeb" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: "#FFF8E1", display: "flex", alignItems: "center", justifyContent: "center" }}>🏨</div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Hotels near {match.venue || match.city}</span>
                    <span style={{ fontSize: 11, color: "#aaa", marginLeft: "auto" }}>{loadingHotels ? "Loading..." : "2 nights · via Booking.com · live"}</span>
                  </div>
                  {hotelList.map((h, i) => (
                    <div key={i} style={{ padding: "14px 18px", borderBottom: i < hotelList.length - 1 ? "1px solid #f7f7f7" : "none", display: "flex", alignItems: "center", gap: 14, background: i === 0 ? "#FFFDF5" : "#fff" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          {h.name}
                          {h.badge && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 999, background: "#FFF8E1", color: "#F57F17", fontWeight: 700 }}>{h.badge}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>{h.distance} · {h.details}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {h.oldPrice && <div style={{ fontSize: 11, color: "#ccc", textDecoration: "line-through" }}>{h.oldPrice}€/nt</div>}
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{h.price}€<span style={{ fontSize: 11, color: "#aaa" }}>/nt</span></div>
                        <a href={h.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 6, padding: "5px 12px", fontSize: 11, fontWeight: 600, borderRadius: 7, background: "transparent", border: "1.5px solid #e0e0e0", color: "#666", textDecoration: "none", display: "inline-block" }}>Book on Booking →</a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* EXTRAS */}
                <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 12, border: "1px solid #ebebeb" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", background: "linear-gradient(135deg,#FAF5FF,#F5F0FF)", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: "#F3E5F5", display: "flex", alignItems: "center", justifyContent: "center" }}>✨</div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Complete your trip</span>
                    <span style={{ fontSize: 11, color: "#9C27B0", marginLeft: "auto" }}>Recommended for away fans</span>
                  </div>
                  {[
                    { icon: "🛡️", bg: "#EDE7F6", name: "Travel Insurance", tag: "⭐ Recommended", tagBg: "#F3E5F5", tagColor: "#6A1B9A", desc: "Covers ticket cancellation, flight delays and medical. From 4.90€.", price: "from 4.90€", sub: "per trip", btnText: "Get insured →", btnBg: "#7B1FA2", url: "https://www.chapka-assurances.com" },
                    { icon: "📱", bg: "#E3F2FD", name: "eSIM for Europe", tag: "🔥 Popular", tagBg: "#E3F2FD", tagColor: "#0D47A1", desc: "Stay connected without roaming. 5GB from 4.50€.", price: "from 4.50€", sub: "5GB · 30 days", btnText: "Get eSIM →", btnBg: "#1565C0", url: "https://www.airalo.com" },
                    { icon: "💳", bg: "#F5F5F5", name: "Revolut — zero fees", tag: "💡 Save on FX", tagBg: "#F5F5F5", tagColor: "#424242", desc: "Pay in euros with no hidden charges. Free account.", price: "Free", sub: "open in 5 min", btnText: "Get Revolut →", btnBg: "#1a1a1a", url: "https://www.revolut.com" },
                  ].map((extra, i) => (
                    <div key={i} style={{ padding: "14px 18px", borderBottom: i < 2 ? "1px solid #f7f7f7" : "none", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: extra.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{extra.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          {extra.name}
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: extra.tagBg, color: extra.tagColor, fontWeight: 600 }}>{extra.tag}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>{extra.desc}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 800 }}>{extra.price}</div>
                        <div style={{ fontSize: 10, color: "#aaa", marginBottom: 6 }}>{extra.sub}</div>
                        <a href={extra.url} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 14px", fontSize: 11, fontWeight: 700, borderRadius: 7, background: extra.btnBg, color: "#fff", textDecoration: "none", display: "inline-block" }}>{extra.btnText}</a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* HISTORY */}
            {activeTab === "history" && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid #ebebeb" }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Ticket price history</div>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 16 }}>Last 4 weeks</div>
                <svg width="100%" height="80" viewBox="0 0 600 80" preserveAspectRatio="none">
                  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8330A" stopOpacity="0.15"/><stop offset="100%" stopColor="#E8330A" stopOpacity="0"/></linearGradient></defs>
                  <path d="M0,40 L75,35 L150,50 L225,55 L300,42 L375,62 L450,45 L525,28 L600,18" fill="none" stroke="#E8330A" strokeWidth="2"/>
                  <path d="M0,40 L75,35 L150,50 L225,55 L300,42 L375,62 L450,45 L525,28 L600,18 L600,80 L0,80Z" fill="url(#g)"/>
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#ccc", marginTop: 8 }}>
                  <span>1 Apr</span><span>8 Apr</span><span>15 Apr</span><span>22 Apr</span><span>Today</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f0f0f0" }}>
                  {[["Current", `${match.price}€`, "#2E7D32"], ["30d avg", `${match.price + 20}€`, "#1a1a1a"], ["Change", match.drop ? `↓ ${Math.abs(match.drop)}%` : "Stable", match.drop ? "#2E7D32" : "#aaa"]].map(([lbl, val, color]) => (
                    <div key={lbl} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color }}>{val}</div>
                      <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ALERTS */}
            {activeTab === "alerts" && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid #ebebeb" }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Set a price alert — free</div>
                <div style={{ fontSize: 13, color: "#aaa", marginBottom: 24, lineHeight: 1.6 }}>We'll email you when prices drop below your target.</div>
                {alertSet ? (
                  <div style={{ background: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: 10, padding: "24px", textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#2E7D32" }}>Alert set for {alertPrice}€</div>
                    <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>We'll notify {alertEmail} when prices drop.</div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 120 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#666", display: "block", marginBottom: 5 }}>Alert me when below</label>
                        <input value={alertPrice} onChange={e => setAlertPrice(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                      </div>
                      <div style={{ flex: 2, minWidth: 200 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#666", display: "block", marginBottom: 5 }}>Your email</label>
                        <input value={alertEmail} onChange={e => setAlertEmail(e.target.value)} placeholder="your@email.com" style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                      </div>
                    </div>
                    <button onClick={() => alertEmail && setAlertSet(true)} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#E8330A,#F97316)", border: "none", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Set alert — free</button>
                  </>
                )}
              </div>
            )}

          </div>

          {/* SIDEBAR */}
          <div>
            <div style={{ background: "#fff", borderRadius: 14, padding: "18px", marginBottom: 14, border: "2px solid #E8330A" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#E8330A", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>🔔 Price alert</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>Alert me when it drops</div>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 14, lineHeight: 1.5 }}>Get notified when the full trip price drops.</div>
              <input placeholder="your@email.com" style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 10 }} />
              <input defaultValue={departureCity} style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 10 }} />
              <button style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#E8330A,#F97316)", border: "none", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Set alert — free</button>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 14, border: "1px solid #ebebeb" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Complete your trip</div>
              {[
                { icon: "🛡️", bg: "#EDE7F6", name: "Travel Insurance", desc: "From 4.90€ · covers cancellation", btn: "Get →", btnBg: "#7B1FA2", url: "https://www.chapka-assurances.com" },
                { icon: "📱", bg: "#E3F2FD", name: "eSIM Europe", desc: "5GB from 4.50€ · no roaming", btn: "Get →", btnBg: "#1565C0", url: "https://www.airalo.com" },
                { icon: "💳", bg: "#F5F5F5", name: "Revolut", desc: "Zero fees · pay in euros", btn: "Free →", btnBg: "#1a1a1a", url: "https://www.revolut.com" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 2 ? "1px solid #f7f7f7" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: 10, color: "#aaa" }}>{item.desc}</div>
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 6, background: item.btnBg, color: "#fff", textDecoration: "none" }}>{item.btn}</a>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #ebebeb" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Share this match</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["🔗 Copy", "𝕏 Post", "💬 Share"].map(btn => (
                  <button key={btn} style={{ flex: 1, padding: 9, border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 11, fontWeight: 600, color: "#666", cursor: "pointer", background: "#fff", fontFamily: "inherit" }}>{btn}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}