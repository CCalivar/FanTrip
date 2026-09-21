"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/theme";

const leagues = ["All", "Premier League", "LaLiga", "Champions League", "Bundesliga", "Serie A", "Brasileirão"];
const { color: C, font: F } = theme;

export default function Home() {
  const [activeLeague, setActiveLeague] = useState("All");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [departureCity, setDepartureCity] = useState("Madrid (MAD)");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("departureCity");
    if (saved) setDepartureCity(saved);
  }, []);

  useEffect(() => {
    fetch("/api/matches")
      .then(r => r.json())
      .then(data => { setMatches(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeLeague === "All" ? matches : matches.filter(m => m.league === activeLeague);
  const featured = filtered.filter(m => m.featured).slice(0, 3);
  const rest = filtered.filter(m => !m.featured);

  const handleDepartureClick = () => {
    const city = prompt("Enter your departure city (e.g. Madrid, London, Paris):");
    if (city) { localStorage.setItem("departureCity", city); setDepartureCity(city); }
  };

  return (
    <main style={{ fontFamily: F.sans, background: C.paper, minHeight: "100vh", color: C.ink }}>

      {/* NAV */}
      <nav style={{ background: C.ink, height: 56, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: `1.5px solid ${C.accent}`, position: "sticky" as const, top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", height: "100%" }}>
          <div onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 28, flexShrink: 0, cursor: "pointer" }}>
            <img src="/fantrip-logo.png" alt="FanTrip" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" as const }} />
            <span style={{ fontFamily: F.display, fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>Fan<span style={{ color: C.gold }}>Trip</span></span>
          </div>
          <div style={{ display: "flex", height: "100%" }}>
            {[["Matches", "/"], ["Travel", "/travel"], ["Guides", "/guides"]].map(([label, path]) => (
              <div key={label} onClick={() => router.push(path)} style={{ padding: "0 14px", fontSize: 13, fontWeight: 500, color: label === "Matches" ? "#fff" : "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", cursor: "pointer", height: "100%", borderBottom: label === "Matches" ? `2px solid ${C.accent}` : "2px solid transparent" }}>{label}</div>
            ))}
            <div onClick={() => router.push("/league/champions-league")} style={{ padding: "0 14px", fontSize: 13, fontWeight: 500, color: "#D9C58A", display: "flex", alignItems: "center", cursor: "pointer", height: "100%", borderBottom: "2px solid transparent" }}>🏆 Champions League</div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: `linear-gradient(160deg, ${C.ink} 0%, #2A2621 55%, #33291F 100%)`, padding: "44px 20px 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(176,73,46,0.16) 0%, transparent 70%)`, pointerEvents: "none" as const }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(199,154,75,0.14)", border: "1px solid rgba(199,154,75,0.35)", borderRadius: 999, padding: "5px 14px", fontSize: 11, color: C.gold, fontWeight: 600, marginBottom: 18, letterSpacing: 0.4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, display: "inline-block" }} />
            LIVE PRICES · 6 LEAGUES · UPDATED HOURLY
          </div>
          <h1 style={{ fontFamily: F.display, fontSize: "clamp(30px,5vw,54px)", fontWeight: 600, color: "#fff", lineHeight: 1.08, letterSpacing: -1, marginBottom: 14 }}>
            The cheapest way<br />
            <span style={{ fontStyle: "italic", color: "#E0B98F" }}>to go to any match.</span>
          </h1>
          <p style={{ fontSize: "clamp(13px,2vw,16px)", color: "rgba(255,255,255,0.5)", marginBottom: 26, lineHeight: 1.5, maxWidth: 500 }}>
            Tickets + flights + hotels in <strong style={{ color: "rgba(255,255,255,0.85)" }}>one search.</strong> Prices from <strong style={{ color: "rgba(255,255,255,0.85)" }}>your city.</strong>
          </p>
          <div style={{ marginBottom: 14 }}>
            <div onClick={handleDepartureClick} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
              <span>📍</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Flying from</span>
              <span style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>{departureCity}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>▾</span>
            </div>
          </div>
          <div style={{ background: C.surface, borderRadius: 12, display: "flex", alignItems: "stretch", overflow: "hidden", maxWidth: 680, boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 16px", gap: 8, minWidth: 0 }}>
              <span style={{ color: "#bbb", fontSize: 15, flexShrink: 0 }}>🔍</span>
              <input type="text" placeholder="Search team, match or tournament..." style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: C.ink, background: "transparent", padding: "15px 0", minWidth: 0 }} />
            </div>
            <div style={{ width: 1, background: C.border, margin: "10px 0", flexShrink: 0 }} />
            <select style={{ border: "none", outline: "none", fontSize: 12, color: C.muted, background: "transparent", cursor: "pointer", padding: "0 12px", flexShrink: 0 }}>
              {leagues.map(l => <option key={l}>{l}</option>)}
            </select>
            <div style={{ width: 1, background: C.border, margin: "10px 0", flexShrink: 0 }} />
            <button style={{ background: C.accent, border: "none", color: "#fff", padding: "0 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" as const }}>Find trips →</button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" as const, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Popular:</span>
            {[["🔥 El Clasico", "/league/laliga"], ["🏆 UCL Final: Madrid", "/league/champions-league"], ["⚡ Man Derby", "/league/premier-league"]].map(([h, path]) => (
              <div key={h as string} onClick={() => path && router.push(path)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 12px", fontSize: 11, color: "rgba(255,255,255,0.6)", cursor: path ? "pointer" : "default" }}>{h}</div>
            ))}
          </div>
        </div>
      </div>

      {/* TRUST BAR */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 20px", overflowX: "auto" as const }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 20, alignItems: "center", minWidth: "max-content" }}>
          {[["⚡", "Updated hourly"], ["🔍", "Compares StubHub, Viagogo & Ticketmaster"], ["✈", "Flights from your airport"], ["🏨", "Hotels near stadium"], ["🌎", "Coverage across Europe & South America"]].map(([icon, text], i) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, fontWeight: 500, whiteSpace: "nowrap" as const }}>
              {i > 0 && <span style={{ color: C.border, marginRight: 20 }}>|</span>}
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ padding: "20px 20px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* FEATURED TOURNAMENT — Champions League */}
          <div style={{ background: `linear-gradient(135deg, ${C.forest}, #1B2E27)`, borderRadius: 14, marginBottom: 24, display: "flex", flexWrap: "wrap" as const, overflow: "hidden", border: "1px solid rgba(199,154,75,0.25)", cursor: "pointer" }} onClick={() => router.push("/league/champions-league")}>
            <div style={{ padding: "22px 24px", flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: 0.6, textTransform: "uppercase" as const, marginBottom: 6 }}>🏆 Featured tournament</div>
              <div style={{ fontFamily: F.display, fontSize: "clamp(17px,3vw,22px)", fontWeight: 600, color: "#fff", marginBottom: 4 }}>UEFA Champions League 2026/27</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 16, lineHeight: 1.5 }}>The final returns to Madrid — Estadio Metropolitano, May 2027.<br />Compare tickets, flights and hotels for every matchday.</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, alignItems: "center" }}>
                <button onClick={e => { e.stopPropagation(); router.push("/league/champions-league"); }} style={{ background: C.gold, border: "none", color: "#20241B", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  See Champions League matches
                </button>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>Path to the final →</span>
              </div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.18)", padding: "22px 28px", display: "flex", flexDirection: "column" as const, justifyContent: "center", alignItems: "center", gap: 8, borderLeft: "1px solid rgba(255,255,255,0.06)", minWidth: 200 }}>
              <div style={{ fontSize: 34, lineHeight: 1 }}>🏟️</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", textAlign: "center" as const }}>Estadio Metropolitano</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textAlign: "center" as const }}>Madrid, España · 2027 Final</div>
            </div>
          </div>

          {/* TOP MATCHES */}
          {!loading && featured.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: "uppercase" as const, letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: 8 }}>
                  🔥 Top matches this week
                  <span style={{ background: C.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>Editor's picks</span>
                </div>
                <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, cursor: "pointer" }}>See all →</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 24 }}>
                {featured.map(m => (
                  <div key={m.id} onClick={() => router.push(`/match/${m.id}`)}
                    onMouseEnter={() => setHoveredId(m.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ background: C.surface, borderRadius: 12, overflow: "hidden", cursor: "pointer", border: hoveredId === m.id ? `1px solid ${C.accent}` : `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, boxShadow: "0 1px 4px rgba(28,27,24,0.06)", transition: "all 0.18s", transform: hoveredId === m.id ? "translateY(-2px)" : "none" }}>
                    <div style={{ padding: "12px 14px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase" as const, letterSpacing: 0.3 }}>{m.league}</div>
                      {m.drop && <span style={{ fontSize: 10, background: C.successSoft, color: C.success, padding: "2px 7px", borderRadius: 999, fontWeight: 700 }}>↓ {Math.abs(m.drop)}%</span>}
                    </div>
                    <div style={{ padding: "4px 14px 10px" }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 2 }}>{m.home} vs {m.away}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{m.date} · {m.venue}</div>
                    </div>
                    <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>Ticket from</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{m.price}€</div>
                      </div>
                      <div style={{ textAlign: "right" as const }}>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>🎟✈🏨 Full trip</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.accent }}>{m.tripFrom}€</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ALL MATCHES */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>All matches</div>
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, cursor: "pointer" }}>Filter →</span>
          </div>
          <div style={{ background: C.surface, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 24 }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, overflowX: "auto" as const }}>
              {leagues.map(l => (
                <button key={l} onClick={() => setActiveLeague(l)} style={{ padding: "11px 14px", fontSize: 12, fontWeight: 600, color: activeLeague === l ? C.accent : C.muted, cursor: "pointer", whiteSpace: "nowrap" as const, borderBottom: activeLeague === l ? `2px solid ${C.accent}` : "2px solid transparent", marginBottom: -1, background: "none", border: "none", fontFamily: "inherit" }}>{l}</button>
              ))}
            </div>
            {loading ? (
              <div style={{ textAlign: "center" as const, padding: "40px", color: C.muted, fontSize: 14 }}>Loading live matches...</div>
            ) : rest.length === 0 ? (
              <div style={{ textAlign: "center" as const, padding: "40px", color: C.muted, fontSize: 14 }}>No matches found.</div>
            ) : (
              rest.map(m => (
                <div key={m.id} onClick={() => router.push(`/match/${m.id}`)}
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${C.paper}`, cursor: "pointer", background: hoveredId === m.id ? C.paper : C.surface, transition: "background 0.1s" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{m.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{m.home} vs {m.away}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{m.date} · {m.league}</div>
                  </div>
                  <div style={{ background: C.accentSoft, border: `1px solid ${C.accentSoft}`, borderRadius: 7, padding: "4px 10px", flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, color: C.accent }}>🎟✈🏨</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.accent }}>from {m.tripFrom}€</div>
                      <div style={{ fontSize: 9, color: C.accentDeep }}>full trip</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" as const, flexShrink: 0, minWidth: 70 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{m.price}€</div>
                    {m.drop
                      ? <div style={{ fontSize: 10, background: C.successSoft, color: C.success, padding: "1px 6px", borderRadius: 999, fontWeight: 700, display: "inline-block", marginTop: 2 }}>↓{Math.abs(m.drop)}%</div>
                      : <div style={{ fontSize: 10, background: "#F5EBD8", color: "#8A6116", padding: "1px 6px", borderRadius: 999, fontWeight: 700, display: "inline-block", marginTop: 2 }}>↑ Hot</div>
                    }
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          <div style={{ background: C.ink, borderRadius: 14, padding: "28px 24px", marginTop: 8 }}>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 32, marginBottom: 24 }}>
              <div style={{ flex: "1 1 200px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <img src="/fantrip-logo.png" alt="FanTrip" style={{ width: 26, height: 26, borderRadius: 7, objectFit: "cover" as const }} />
                  <span style={{ fontFamily: F.display, fontSize: 15, fontWeight: 700, color: "#fff" }}>Fan<span style={{ color: C.gold }}>Trip</span></span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 220 }}>The smartest way to plan football away trips. Tickets, flights and hotels from your city.</div>
              </div>
              {[
                { title: "Leagues", links: [["Champions League", "/league/champions-league"], ["Premier League", "/league/premier-league"], ["LaLiga", "/league/laliga"], ["Bundesliga", "/league/bundesliga"], ["Serie A", "/league/serie-a"], ["Brasileirão", "/league/brasileirao"]] },
                { title: "Guides", links: [["How to buy tickets", "/guides/how-to-not-get-locked-out-of-a-football-match"], ["Best eSIMs for travel", "/guides/best-esim-premier-league-away-games"], ["Travel insurance", "/guides/travel-insurance-football-away-trips"], ["Price analysis", "/guides/when-do-football-ticket-prices-drop"]] },
                { title: "FanTrip", links: [["Travel & Guides", "/travel"], ["About", "/"], ["Affiliate disclosure", "/"]] },
              ].map(col => (
                <div key={col.title} style={{ flex: "1 1 120px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 12 }}>{col.title}</div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                    {col.links.map(([label, path]) => (
                      <span key={label} onClick={() => router.push(path)} style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>{label}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, display: "flex", flexWrap: "wrap" as const, gap: 12, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>© 2026 FanTrip · Affiliate links · Prices from StubHub, Ticketmaster, Viagogo, Aviasales & Booking.com</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["EN", "ES"].map(l => (
                  <span key={l} style={{ fontSize: 11, color: l === "EN" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)", padding: "2px 8px", border: `1px solid ${l === "EN" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}`, borderRadius: 4, cursor: "pointer" }}>{l}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
        }
      `}</style>

    </main>
  );
}
