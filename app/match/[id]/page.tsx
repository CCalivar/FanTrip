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
      .then(data => { setMatches(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeLeague === "All" ? matches : matches.filter(m => m.league === activeLeague);
  const featured = filtered.filter(m => m.featured).slice(0, 2);
  const rest = filtered.filter(m => !m.featured);

  return (
    <main style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#080808", minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>

      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.12) 0%, transparent 70%)" }} />

      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", background: "rgba(8,8,8,0.85)", backdropFilter: "blur(20px)", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #dc2626, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✈</div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>FanTrip</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Tickets", "Travel", "Alerts"].map(l => (
            <a key={l} href="#" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none" }}>{l}</a>
          ))}
          <button style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>Sign up free</button>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", padding: "72px 24px 48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(220,38,38,0.1)", border: "0.5px solid rgba(220,38,38,0.3)", borderRadius: 999, padding: "5px 14px", fontSize: 11, color: "#f87171", marginBottom: 28, fontWeight: 500, letterSpacing: 0.3 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />
            LIVE PRICES · 5 LEAGUES · REAL-TIME
          </div>
          <h1 style={{ fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 20, letterSpacing: -2 }}>
            Your match.<br />
            <span style={{ background: "linear-gradient(90deg, #dc2626, #f97316, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your trip. All sorted.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, lineHeight: 1.7, marginBottom: 40, maxWidth: 460, margin: "0 auto 40px" }}>
            Tickets, flights and hotels for any match in Europe.<br />One search. Best price. No switching tabs.
          </p>
          <div style={{ display: "flex", maxWidth: 580, margin: "0 auto 16px", background: "#111", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 14, overflow: "hidden" }}>
            <span style={{ padding: "0 16px", display: "flex", alignItems: "center", color: "#444", fontSize: 16 }}>🔍</span>
            <input type="text" placeholder="Search team, match or competition..." style={{ flex: 1, padding: "16px 0", background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 14 }} />
            <select style={{ background: "transparent", border: "none", outline: "none", borderLeft: "0.5px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontSize: 12, padding: "0 14px", cursor: "pointer" }}>
              {leagues.map(l => <option key={l} style={{ background: "#111" }}>{l}</option>)}
            </select>
            <button style={{ background: "linear-gradient(135deg, #dc2626, #f97316)", color: "#fff", border: "none", padding: "16px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Search</button>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["🔥 El Clasico", "🏆 UCL Final", "⚡ Manchester Derby", "🌟 North London Derby"].map(h => (
              <button key={h} style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>{h}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", maxWidth: 560, margin: "0 auto 56px", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          {[{ num: "12,400+", label: "Matches tracked" }, { num: "3", label: "Platforms compared" }, { num: "89k", label: "Alerts sent" }, { num: "€28", label: "Avg saving/trip" }].map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: "18px 16px", textAlign: "center", borderRight: i < 3 ? "0.5px solid rgba(255,255,255,0.07)" : "none" }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>{s.num}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
            Loading matches...
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div style={{ padding: "0 24px 20px", maxWidth: 760, margin: "0 auto" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Featured matches</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {featured.map(m => (
                    <div key={m.id} onClick={() => router.push(`/match/${m.id}`)}
                      onMouseEnter={() => setHoveredId(m.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ background: hoveredId === m.id ? "rgba(220,38,38,0.08)" : "rgba(255,255,255,0.03)", border: hoveredId === m.id ? "0.5px solid rgba(220,38,38,0.3)" : "0.5px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 22px 18px", cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(220,38,38,0.06)", pointerEvents: "none" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.4, color: "#fbbf24", textTransform: "uppercase" }}>{m.league}</div>
                        <span style={{ fontSize: 22 }}>{m.emoji}</span>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2, marginBottom: 4 }}>{m.home}</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>vs {m.away}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>{m.date} · {m.venue}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
                        <div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>Ticket from</div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                            <span style={{ fontSize: 24, fontWeight: 700 }}>{m.price}€</span>
                            {m.drop && <span style={{ fontSize: 11, background: "rgba(74,222,128,0.1)", color: "#4ade80", padding: "2px 7px", borderRadius: 999, fontWeight: 600 }}>↓ {Math.abs(m.drop)}%</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>Full trip from</div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: "#fbbf24" }}>{m.tripFrom}€</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ padding: "24px 24px 0", maxWidth: 760, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>All matches</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {leagues.map(l => (
                    <button key={l} onClick={() => setActiveLeague(l)} style={{ background: activeLeague === l ? "rgba(220,38,38,0.15)" : "transparent", border: activeLeague === l ? "0.5px solid rgba(220,38,38,0.4)" : "0.5px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "4px 12px", fontSize: 11, color: activeLeague === l ? "#f87171" : "rgba(255,255,255,0.35)", cursor: "pointer", whiteSpace: "nowrap" }}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 60 }}>
                {rest.map(m => (
                  <div key={m.id} onClick={() => router.push(`/match/${m.id}`)}
                    onMouseEnter={() => setHoveredId(m.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ background: hoveredId === m.id ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{m.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{m.home} <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>vs</span> {m.away}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{m.date} · <span style={{ color: "rgba(255,255,255,0.45)" }}>{m.league}</span></div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 12px" }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>🎟 + ✈ + 🏨</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>from {m.tripFrom}€</span>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, minWidth: 90 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, justifyContent: "flex-end" }}>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{m.price}€</span>
                        {m.drop ? <span style={{ fontSize: 10, background: "rgba(74,222,128,0.1)", color: "#4ade80", padding: "2px 6px", borderRadius: 999, fontWeight: 600 }}>↓{Math.abs(m.drop)}%</span>
                          : <span style={{ fontSize: 10, background: "rgba(248,113,113,0.1)", color: "#f87171", padding: "2px 6px", borderRadius: 999, fontWeight: 600 }}>↑ Hot</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>ticket only</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
