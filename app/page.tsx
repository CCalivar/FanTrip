"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const leagues = ["All", "Premier League", "LaLiga", "Champions League", "Bundesliga", "Serie A"];

export default function Home() {
  const [activeLeague, setActiveLeague] = useState("All");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/matches")
      .then(r => r.json())
      .then(data => { setMatches(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeLeague === "All" ? matches : matches.filter(m => m.league === activeLeague);
  const featured = filtered.filter(m => m.featured).slice(0, 3);
  const rest = filtered.filter(m => !m.featured);

  return (
    <main style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: "#F2F3F5", minHeight: "100vh", color: "#1a1a1a" }}>

      {/* NAV */}
      <nav style={{ background: "#0D0D0D", height: 56, display: "flex", alignItems: "center", padding: "0 28px", borderBottom: "1.5px solid #E8330A", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 36 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#E8330A,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✈</div>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Fan<span style={{ color: "#F97316" }}>Trip</span></span>
        </div>
        <div style={{ display: "flex", height: "100%" }}>
          {["Matches", "Travel", "Guides", "Alerts"].map(l => (
            <div key={l} style={{ padding: "0 18px", fontSize: 13, fontWeight: 500, color: l === "Matches" ? "#fff" : "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", cursor: "pointer", borderBottom: l === "Matches" ? "2px solid #E8330A" : "2px solid transparent", marginBottom: -1.5 }}>{l}</div>
          ))}
          <div style={{ padding: "0 18px", fontSize: 13, fontWeight: 500, color: "#60a5fa", display: "flex", alignItems: "center", cursor: "pointer", borderBottom: "2px solid transparent", marginBottom: -1.5 }}>🌍 World Cup 2026</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.7)", padding: "7px 16px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Sign in</button>
          <button style={{ background: "#E8330A", border: "none", color: "#fff", padding: "7px 16px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sign up free →</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(160deg,#0D0D0D 0%,#1a1a2e 60%,#16213e 100%)",padding: "40px 28px 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(232,51,10,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(232,51,10,0.12)", border: "1px solid rgba(232,51,10,0.3)", borderRadius: 999, padding: "5px 14px", fontSize: 11, color: "#FF6B4A", fontWeight: 600, marginBottom: 18, letterSpacing: 0.4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8330A", display: "inline-block" }} />
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          LIVE PRICES · 5 LEAGUES · UPDATED HOURLY
          </div>
        <h1 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: -1.5, marginBottom: 10 }}>
          The cheapest way<br />
          <span style={{ background: "linear-gradient(90deg,#E8330A,#F97316,#FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>to go to any match.</span>
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 28, lineHeight: 1.5 }}>
          Tickets + flights + hotels in <strong style={{ color: "rgba(255,255,255,0.75)" }}>one search.</strong> Prices calculated from <strong style={{ color: "rgba(255,255,255,0.75)" }}>your city.</strong>
        </p>
        </div>

        {/* ORIGIN */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, padding: "9px 14px", cursor: "pointer" }}>
            <span>📍</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Flying from</span>
            <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>Madrid (MAD)</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>▾</span>
          </div>
        </div>

        {/* SEARCH */}
        <div style={{ background: "#fff", borderRadius: 14, display: "flex", alignItems: "stretch", overflow: "hidden", maxWidth: 700, boxShadow: "0 8px 40px rgba(0,0,0,0.35)" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 18px", gap: 10 }}>
            <span style={{ color: "#999", fontSize: 16 }}>🔍</span>
            <input type="text" placeholder="Search team, match or tournament..." style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: "#1a1a1a", background: "transparent", padding: "16px 0" }} />
          </div>
          <div style={{ width: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <select style={{ border: "none", outline: "none", fontSize: 13, color: "#666", background: "transparent", cursor: "pointer", padding: "0 16px", fontWeight: 500 }}>
            {leagues.map(l => <option key={l}>{l}</option>)}
          </select>
          <div style={{ width: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <button style={{ background: "#E8330A", border: "none", color: "#fff", padding: "0 26px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Find trips →</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Popular:&nbsp;</span>
          {["🔥 El Clasico", "🏆 UCL Final", "⚡ Manchester Derby", "🌍 World Cup 2026"].map(h => (
            <div key={h} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "5px 13px", fontSize: 12, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontWeight: 500 }}>{h}</div>
          ))}
        </div>
      </div>

      {/* TRUST BAR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "12px 28px", display: "flex", gap: 28, alignItems: "center", overflowX: "auto" }}>
        {[["⚡", "Prices updated hourly"], ["🔍", "Compares StubHub, Viagogo & Ticketmaster"], ["✈", "Flights from your airport"], ["🏨", "Hotels near the stadium"], ["🔔", "Free price alerts"]].map(([icon, text], i) => (
          <>
            {i > 0 && <div key={`sep-${i}`} style={{ width: 1, height: 16, background: "#e8e8e8", flexShrink: 0 }} />}
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#666", fontWeight: 500, whiteSpace: "nowrap" }}>
              <span>{icon}</span>{text}
            </div>
          </>
        ))}
      </div>

      {/* MAIN */}
      <div style={{padding: "24px 28px", maxWidth: 1200, margin: "0 auto" }}>

        {/* WORLD CUP BANNER */}
        <div style={{ background: "linear-gradient(135deg,#0f2847,#1a3a6b,#0f3460)", borderRadius: 14, marginBottom: 24, display: "flex", overflow: "hidden", border: "1px solid rgba(96,165,250,0.2)" }}>
          <div style={{ padding: "20px 24px", flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#60a5fa", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 6 }}>⚽ Coming June 2026</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>FIFA World Cup 2026</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14, lineHeight: 1.5 }}>USA · Canada · Mexico · 48 teams · 104 matches.<br />Track prices now before they spike.</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button style={{ background: "#E8330A", border: "none", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Set World Cup alerts — free</button>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer", textDecoration: "underline" }}>Browse host cities →</span>
            </div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.15)", padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, minWidth: 200, borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
              {[["407", "Days"], ["14", "Hours"], ["32", "Min"]].map(([num, lbl]) => (
                <div key={lbl} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: -1 }}>{num}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 2 }}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>🇺🇸🇨🇦🇲🇽&nbsp; 16 host cities</div>
          </div>
        </div>

        {/* TOP MATCHES */}
        {!loading && featured.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: 8 }}>
                🔥 Top matches this week
                <span style={{ background: "#E8330A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>Editor's picks</span>
              </div>
              <span style={{ fontSize: 12, color: "#E8330A", fontWeight: 600, cursor: "pointer" }}>See all →</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
              {featured.map(m => (
                <div key={m.id} onClick={() => router.push(`/match/${m.id}`)}
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ background: "#fff", borderRadius: 12, overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: hoveredId === m.id ? "1px solid #E8330A" : "1px solid #f0f0f0", borderTop: "3px solid #E8330A", transition: "all 0.18s", transform: hoveredId === m.id ? "translateY(-2px)" : "none" }}>
                  <div style={{ padding: "12px 14px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#E8330A", textTransform: "uppercase", letterSpacing: 0.4 }}>{m.league}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, background: "#EDE7F6", color: "#4527A0", padding: "2px 8px", borderRadius: 999 }}>
                      {m.league === "Champions League" ? "UCL" : m.league.split(" ")[0]}
                    </div>
                  </div>
                  <div style={{ padding: "4px 14px 10px" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 2, letterSpacing: -0.3 }}>{m.home}</div>
                    <div style={{ fontSize: 11, color: "#999" }}>vs {m.away} · {m.date}</div>
                  </div>
                  <div style={{ padding: "10px 14px", borderTop: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#aaa", marginBottom: 2 }}>Ticket from</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", display: "flex", alignItems: "baseline", gap: 6 }}>
                        {m.price}€
                        {m.drop && <span style={{ fontSize: 10, background: "#E8F5E9", color: "#2E7D32", padding: "2px 7px", borderRadius: 999, fontWeight: 700 }}>↓ {Math.abs(m.drop)}%</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#aaa", marginBottom: 2 }}>🎟✈🏨 Full trip</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#E8330A" }}>{m.tripFrom}€</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ALL MATCHES */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.07em" }}>All matches</div>
          <span style={{ fontSize: 12, color: "#E8330A", fontWeight: 600, cursor: "pointer" }}>Filter & sort →</span>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #ebebeb", marginBottom: 24 }}>
          <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", padding: "0 0 0 16px", overflowX: "auto" }}>
            {leagues.map(l => (
              <button key={l} onClick={() => setActiveLeague(l)} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: activeLeague === l ? "#E8330A" : "#999", cursor: "pointer", whiteSpace: "nowrap", borderBottom: activeLeague === l ? "2px solid #E8330A" : "2px solid transparent", marginBottom: -1, background: "none", fontFamily: "inherit" }}>{l}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 24px", color: "#aaa", fontSize: 14 }}>Loading live matches...</div>
          ) : (
            rest.map(m => (
              <div key={m.id} onClick={() => router.push(`/match/${m.id}`)}
                onMouseEnter={() => setHoveredId(m.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: "1px solid #f7f7f7", cursor: "pointer", background: hoveredId === m.id ? "#FAFAFA" : "#fff", transition: "background 0.1s" }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{m.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 3 }}>{m.home} <span style={{ color: "rgba(0,0,0,0.35)", fontWeight: 400 }}>vs</span> {m.away}</div>
                  <div style={{ fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{m.date}</span><span style={{ color: "#ddd" }}>·</span><span>{m.league}</span>
                  </div>
                </div>
                <div style={{ background: "#FFF5F3", border: "1px solid #FFD6CC", borderRadius: 7, padding: "5px 11px", display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: "#E8330A", letterSpacing: 1 }}>🎟✈🏨</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#E8330A" }}>from {m.tripFrom}€</div>
                    <div style={{ fontSize: 10, color: "#F97316", fontWeight: 500 }}>full trip</div>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, minWidth: 90 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{m.price}€</div>
                  {m.drop
                    ? <div style={{ fontSize: 10, background: "#E8F5E9", color: "#1B5E20", padding: "2px 7px", borderRadius: 999, fontWeight: 700, marginTop: 3, display: "inline-block" }}>↓{Math.abs(m.drop)}%</div>
                    : <div style={{ fontSize: 10, background: "#FFF3E0", color: "#E65100", padding: "2px 7px", borderRadius: 999, fontWeight: 700, marginTop: 3, display: "inline-block" }}>↑ Hot</div>
                  }
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}