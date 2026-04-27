"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const matches: Record<string, any> = {
  "1": { home: "Real Madrid", away: "Atletico Madrid", league: "LaLiga", date: "12 May 2025", venue: "Bernabeu", city: "Madrid", price: 89, oldPrice: 108, drop: -18, tripFrom: 284 },
  "2": { home: "UCL Final", away: "TBD vs TBD", league: "Champions League", date: "31 May 2025", venue: "Allianz Arena", city: "Munich", price: 210, oldPrice: 210, drop: null, tripFrom: 384 },
  "3": { home: "Man City", away: "Man United", league: "Premier League", date: "18 May 2025", venue: "Etihad", city: "Manchester", price: 145, oldPrice: 163, drop: -11, tripFrom: 310 },
  "4": { home: "Arsenal", away: "Chelsea", league: "Premier League", date: "24 May 2025", venue: "Emirates", city: "London", price: 67, oldPrice: 67, drop: null, tripFrom: 190 },
  "5": { home: "Barcelona", away: "Real Madrid", league: "LaLiga", date: "3 Jun 2025", venue: "Camp Nou", city: "Barcelona", price: 175, oldPrice: 220, drop: -20, tripFrom: 340 },
};

const tickets = [
  { platform: "StubHub", section: "Category B — Tier 2", price: 89, oldPrice: 108, badge: "Best value", delivery: "E-ticket · Instant" },
  { platform: "Viagogo", section: "Category A — Tier 1", price: 215, oldPrice: null, badge: "3 left", delivery: "E-ticket · Instant" },
  { platform: "Ticketmaster", section: "VIP Hospitality", price: 490, oldPrice: null, badge: null, delivery: "Includes catering" },
];

const flights = [
  { airline: "Vueling", route: "BCN 07:15 — MAD 08:30", duration: "Direct · 1h 15m", returnFlight: "Return 13 May 22:00", price: 54, oldPrice: 72, badge: "Cheapest" },
  { airline: "Iberia", route: "BCN 09:00 — MAD 10:10", duration: "Direct · 1h 10m", returnFlight: "Return 13 May 20:00", price: 78, oldPrice: 91, badge: "↓ 14%" },
  { airline: "Ryanair", route: "BCN 06:00 — MAD 07:20", duration: "Direct · 1h 20m", returnFlight: "Return 14 May 08:00", price: 42, oldPrice: null, badge: "Early flight" },
];

const hotels = [
  { name: "Ibis Madrid Centro", distance: "0.8km from stadium", details: "Free cancellation · Breakfast not included", price: 67, oldPrice: 89, badge: "Best value" },
  { name: "NH Collection Madrid", distance: "0.3km from stadium", details: "Breakfast included · 2 left", price: 124, oldPrice: null, badge: "2 left" },
  { name: "Marriott Auditorium", distance: "1.2km from stadium", details: "Free cancellation · Parking included", price: 98, oldPrice: 115, badge: null },
];

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const match = matches[params.id as string] || matches["1"];
  const [activeTab, setActiveTab] = useState("trip");
  const [alertPrice, setAlertPrice] = useState("80");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSet, setAlertSet] = useState(false);

  const totalPrice = tickets[0].price + flights[0].price + hotels[0].price * 2;

  return (
    <main style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#080808", minHeight: "100vh", color: "#fff" }}>

      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.1) 0%, transparent 70%)" }} />

      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", background: "rgba(8,8,8,0.85)", backdropFilter: "blur(20px)", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => router.push("/")}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #dc2626, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✈</div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>FanTrip</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => router.push("/")} style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>← Back</button>
          <button style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>Sign up free</button>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "32px 24px 60px" }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: "#f87171", fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 10 }}>{match.league}</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 6 }}>{match.home} <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>vs</span> {match.away}</h1>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{match.date} · {match.venue}, {match.city}</div>
        </div>

        <div style={{ background: "rgba(220,38,38,0.08)", border: "0.5px solid rgba(220,38,38,0.25)", borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Best combination · 1 person · 2 nights</div>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, marginBottom: 4 }}>{totalPrice}€</div>
            <div style={{ fontSize: 13, color: "#4ade80" }}>Saves ~112€ vs booking separately</div>
          </div>
          <button style={{ background: "linear-gradient(135deg, #dc2626, #f97316)", color: "#fff", border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Book this trip</button>
        </div>

        <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid rgba(255,255,255,0.08)", marginBottom: 24 }}>
          {[["trip", "Full trip"], ["tickets", "Tickets only"], ["history", "Price history"], ["alerts", "Set alert — free"]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{ padding: "10px 20px", fontSize: 13, background: "none", border: "none", borderBottom: activeTab === id ? "2px solid #dc2626" : "2px solid transparent", color: activeTab === id ? "#fff" : "rgba(255,255,255,0.4)", cursor: "pointer", fontWeight: activeTab === id ? 600 : 400, marginBottom: -1, transition: "all 0.15s" }}>{label}</button>
          ))}
        </div>

        {(activeTab === "trip" || activeTab === "tickets") && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ padding: "12px 18px", borderBottom: "0.5px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(74,222,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎟</div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Tickets</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>3 options · updated 2h ago</span>
            </div>
            {tickets.map((t, i) => (
              <div key={i} style={{ padding: "14px 18px", borderBottom: i < tickets.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none", display: "flex", alignItems: "center", gap: 14, background: i === 0 ? "rgba(74,222,128,0.03)" : "transparent" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, display: "flex", alignItems: "center", gap: 8 }}>
                    {t.section}
                    {t.badge && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 999, background: i === 0 ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)", color: i === 0 ? "#4ade80" : "#f87171", fontWeight: 600 }}>{t.badge}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{t.platform} · {t.delivery}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{t.price}€</div>
                  {t.oldPrice && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>{t.oldPrice}€</div>}
                  <button style={{ marginTop: 6, padding: "5px 12px", fontSize: 11, background: "transparent", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 7, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>Buy on {t.platform}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "trip" && (
          <>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ padding: "12px 18px", borderBottom: "0.5px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(96,165,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✈️</div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Flights to {match.city}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>via Amadeus API</span>
              </div>
              {flights.map((f, i) => (
                <div key={i} style={{ padding: "14px 18px", borderBottom: i < flights.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none", display: "flex", alignItems: "center", gap: 14, background: i === 0 ? "rgba(96,165,250,0.03)" : "transparent" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, display: "flex", alignItems: "center", gap: 8 }}>
                      {f.airline} · {f.route}
                      {f.badge && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 999, background: i === 0 ? "rgba(96,165,250,0.12)" : "rgba(74,222,128,0.12)", color: i === 0 ? "#60a5fa" : "#4ade80", fontWeight: 600 }}>{f.badge}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{f.duration} · {f.returnFlight}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{f.price}€</div>
                    {f.oldPrice && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>{f.oldPrice}€</div>}
                    <button style={{ marginTop: 6, padding: "5px 12px", fontSize: 11, background: "transparent", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 7, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>Book on Skyscanner</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", marginBottom: 24 }}>
              <div style={{ padding: "12px 18px", borderBottom: "0.5px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(251,191,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏨</div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Hotels near {match.venue}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>via Booking.com API</span>
              </div>
              {hotels.map((h, i) => (
                <div key={i} style={{ padding: "14px 18px", borderBottom: i < hotels.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none", display: "flex", alignItems: "center", gap: 14, background: i === 0 ? "rgba(251,191,36,0.03)" : "transparent" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, display: "flex", alignItems: "center", gap: 8 }}>
                      {h.name}
                      {h.badge && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 999, background: i === 0 ? "rgba(251,191,36,0.12)" : "rgba(248,113,113,0.12)", color: i === 0 ? "#fbbf24" : "#f87171", fontWeight: 600 }}>{h.badge}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{h.distance} · {h.details}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{h.price}€<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>/night</span></div>
                    {h.oldPrice && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>{h.oldPrice}€/night</div>}
                    <button style={{ marginTop: 6, padding: "5px 12px", fontSize: 11, background: "transparent", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 7, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>Book on Booking</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "history" && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Ticket price history — last 4 weeks</div>
            <svg width="100%" height="100" viewBox="0 0 600 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,40 L75,35 L150,55 L225,60 L300,45 L375,70 L450,50 L525,28 L600,20" fill="none" stroke="#dc2626" strokeWidth="2" />
              <path d="M0,40 L75,35 L150,55 L225,60 L300,45 L375,70 L450,50 L525,28 L600,20 L600,100 L0,100Z" fill="url(#g)" />
              <circle cx="375" cy="70" r="5" fill="#4ade80" />
              <rect x="340" y="76" width="70" height="18" rx="4" fill="rgba(74,222,128,0.15)" />
              <text x="375" y="88" textAnchor="middle" fontSize="10" fill="#4ade80" fontFamily="sans-serif">min 89€</text>
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>
              <span>1 Apr</span><span>8 Apr</span><span>15 Apr</span><span>22 Apr</span><span>Today</span>
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Set a price alert — free</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24, lineHeight: 1.6 }}>
              Track tickets, flights and hotels for this match. We'll email you when any of them drops below your target price. Always free.
            </div>
            {alertSet ? (
              <div style={{ background: "rgba(74,222,128,0.1)", border: "0.5px solid rgba(74,222,128,0.3)", borderRadius: 10, padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80", marginBottom: 6 }}>Alert set for {alertPrice}€</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>We'll notify {alertEmail} when tickets, flights or hotels drop.</div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Alert me when below</div>
                    <input value={alertPrice} onChange={e => setAlertPrice(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "#111", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} placeholder="80€" />
                  </div>
                  <div style={{ flex: 2 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Your email</div>
                    <input value={alertEmail} onChange={e => setAlertEmail(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "#111", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} placeholder="your@email.com" />
                  </div>
                </div>
                <button onClick={() => alertEmail && setAlertSet(true)} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #dc2626, #f97316)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  Set alert — free
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </main>
  );
}