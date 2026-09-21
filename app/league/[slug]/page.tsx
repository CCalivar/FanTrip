"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentSeasonLabel } from "@/lib/season";

const leagueInfo: Record<string, any> = {
  "champions-league": { name: "Champions League", emoji: "🏆", color: "#0a2a5e", code: "CL" },
  "premier-league": { name: "Premier League", emoji: "🔴", color: "#3D195B", code: "PL" },
  "laliga": { name: "LaLiga", emoji: "🟡", color: "#FF4B44", code: "PD" },
  "bundesliga": { name: "Bundesliga", emoji: "⚫", color: "#D3010C", code: "BL1" },
  "serie-a": { name: "Serie A", emoji: "🔵", color: "#1B3F8B", code: "SA" },
  "brasileirao": { name: "Brasileirão", emoji: "🇧🇷", color: "#2B4239", code: "BSA" },
};

// Rondas eliminatorias de Champions, en orden. El cuadro se arma con datos
// reales de la API (campo `stage` de football-data) cuando existen; hasta el
// sorteo de octavos (previsto feb 2027) la competición está en fase de liga y
// no hay cuadro que mostrar.
const KO_ORDER = ["LAST_16", "QUARTER_FINALS", "SEMI_FINALS", "FINAL"];
const KO_LABEL: Record<string, string> = {
  LAST_16: "Octavos",
  QUARTER_FINALS: "Cuartos",
  SEMI_FINALS: "Semifinales",
  FINAL: "Final",
};

export default function LeaguePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const league = leagueInfo[slug] || { name: "League", emoji: "⚽", color: "#2A2621", code: "" };
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const isUCL = slug === "champions-league";
  // Brasileirão runs Jan–Dec (calendar year), unlike the Aug–May European
  // season shown for every other league here.
  const seasonLabel = slug === "brasileirao" ? String(new Date().getFullYear()) : getCurrentSeasonLabel();

  useEffect(() => {
    fetch("/api/matches")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setMatches(data.filter((m: any) => m.league === league.name));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [league.name]);

  const s: any = {
    nav: { background: "#1C1B18", height: 56, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1.5px solid #B0492E", position: "sticky" as const, top: 0, zIndex: 100 },
    navInner: { maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center" },
    logo: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
    logoMark: { width: 30, height: 30, borderRadius: 8, overflow: "hidden" as const },
    logoText: { fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: -0.5 },
  };

  return (
    <main style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: "#F7F4EE", minHeight: "100vh", color: "#1a1a1a" }}>

      <nav style={s.nav}>
        <div style={s.navInner}>
          <div onClick={() => router.push("/")} style={s.logo}>
            <img src="/fantrip-logo.png" alt="FanTrip" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" as const }} />
            <span style={s.logoText}>Fan<span style={{ color: "#C79A4B" }}>Trip</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: "auto", marginRight: 16 }}>
            <span onClick={() => router.push("/")} style={{ cursor: "pointer" }}>Home</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{league.name}</span>
          </div>
          <button onClick={() => router.push("/")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>← Back</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: `linear-gradient(160deg,#1C1B18 0%,${league.color} 100%)`, padding: "32px 20px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20, flexWrap: "wrap" as const }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>{league.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 5 }}>{seasonLabel} Season</div>
              <h1 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, color: "#fff", letterSpacing: -1, marginBottom: 5 }}>{league.name}</h1>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                <span>{matches.length} upcoming matches</span>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <span style={{ color: "#60a5fa", fontWeight: 600 }}>Live prices</span>
                {isUCL && <><span style={{ color: "rgba(255,255,255,0.2)" }}>·</span><span style={{ color: "#fbbf24", fontWeight: 600 }}>Final: May 2027 · Madrid</span></>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              {[["Tickets from", `${matches[0]?.price || "—"}€`], ["Matches", matches.length || "—"]].map(([lbl, val]) => (
                <div key={lbl as string} style={{ padding: "0 20px", textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>{val}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* LEAGUE SELECTOR */}
          <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.08)", overflowX: "auto" }}>
            {Object.entries(leagueInfo).map(([s2, l]) => (
              <div key={s2} onClick={() => router.push(`/league/${s2}`)} style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: s2 === slug ? "#fff" : "rgba(255,255,255,0.45)", cursor: "pointer", borderBottom: s2 === slug ? "2px solid #B0492E" : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" as const }}>
                {l.emoji} {l.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ padding: "24px 20px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
          <div>

            {/* BRACKET — solo UCL. Datos reales de la API; placeholder honesto
                mientras la competición esté en fase de liga (sin eliminatorias). */}
            {isUCL && (() => {
              const knockout = matches.filter((m) => KO_ORDER.includes(m.stage));
              if (knockout.length === 0) {
                return (
                  <div style={{ background: "#fff", borderRadius: 14, marginBottom: 16, border: "1px solid #ebebeb", padding: "18px 20px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>🏆 Cuadro de eliminatorias</div>
                    <div style={{ fontSize: 12.5, color: "#8a8a8a", lineHeight: 1.55 }}>
                      La Champions está en <strong style={{ color: "#1a1a1a" }}>fase de liga</strong>. El cuadro se mostrará automáticamente en cuanto se sorteen los cruces (previsto febrero 2027). <strong style={{ color: "#B0492E" }}>Final: mayo 2027 · Estadio Metropolitano, Madrid.</strong>
                    </div>
                  </div>
                );
              }
              const stages = KO_ORDER.filter((st) => knockout.some((m) => m.stage === st));
              return (
                <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 16, border: "1px solid #ebebeb" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", fontSize: 14, fontWeight: 700, color: "#1a1a1a", display: "flex", alignItems: "center", gap: 8 }}>🏆 Cuadro de eliminatorias</div>
                  <div style={{ padding: "16px", overflowX: "auto" as const }}>
                    <div style={{ display: "flex", gap: 12, minWidth: stages.length * 200 }}>
                      {stages.map((st) => (
                        <div key={st} style={{ minWidth: 190, flex: "0 0 auto" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "0.06em", textAlign: "center" as const, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #f0f0f0" }}>{KO_LABEL[st]}</div>
                          {knockout.filter((m) => m.stage === st).map((m) => (
                            <div key={m.id} onClick={() => router.push(`/match/${m.id}`)} style={{ background: "#F8F8F8", borderRadius: 10, border: "1.5px solid #ebebeb", overflow: "hidden", marginBottom: 8, cursor: "pointer" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderBottom: "1px solid #f0f0f0", fontSize: 11, fontWeight: 700, color: "#1a1a1a" }}>{m.home}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", fontSize: 11, fontWeight: 700, color: "#1a1a1a" }}>{m.away}</div>
                              <div style={{ padding: "4px 10px", borderTop: "1px solid #f0f0f0", fontSize: 9, color: "#aaa" }}>{m.date}{m.venue && m.venue !== "TBC" ? ` · ${m.venue}` : ""}</div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* MATCHES */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>Upcoming matches</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #ebebeb" }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: 14 }}>Loading matches...</div>
              ) : matches.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: 14 }}>No upcoming matches found.</div>
              ) : matches.map((m, i) => (
                <div key={m.id} onClick={() => router.push(`/match/${m.id}`)}
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: i < matches.length - 1 ? "1px solid #f7f7f7" : "none", cursor: "pointer", background: hoveredId === m.id ? "#FAFAFA" : "#fff", transition: "background 0.1s" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{m.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{m.home} vs {m.away}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{m.date} · {m.venue || "TBC"}</div>
                  </div>
                  <div style={{ background: "#FFF5F3", border: "1px solid #FFD6CC", borderRadius: 7, padding: "5px 11px", flexShrink: 0, textAlign: "center" as const }}>
                    <div style={{ fontSize: 10, color: "#B0492E" }}>🎟✈🏨</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#B0492E" }}>from {m.tripFrom}€</div>
                    <div style={{ fontSize: 9, color: "#C79A4B" }}>full trip</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, minWidth: 80 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{m.price}€</div>
                    {m.drop
                      ? <div style={{ fontSize: 10, background: "#E8F5E9", color: "#1B5E20", padding: "1px 6px", borderRadius: 999, fontWeight: 700, display: "inline-block", marginTop: 2 }}>↓{Math.abs(m.drop)}%</div>
                      : <div style={{ fontSize: 10, background: "#FFF3E0", color: "#E65100", padding: "1px 6px", borderRadius: 999, fontWeight: 700, display: "inline-block", marginTop: 2 }}>↑ Hot</div>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <div>
            <div style={{ background: "#fff", borderRadius: 14, padding: "18px", marginBottom: 14, border: "2px solid #B0492E" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#B0492E", textTransform: "uppercase" as const, letterSpacing: 0.4, marginBottom: 6 }}>🔔 Price alerts</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>Alert me for {league.name}</div>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 14, lineHeight: 1.5 }}>Get notified when ticket or trip prices drop for any {league.name} match.</div>
              <input placeholder="your@email.com" style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 10 }} />
              <input defaultValue="Madrid (MAD)" style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 10 }} />
              <button style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#B0492E,#C79A4B)", border: "none", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Set alerts — free</button>
            </div>

            {matches.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #ebebeb" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 14 }}>🔥 Best value trips</div>
                {matches.slice(0, 3).map((m, i) => (
                  <div key={i} onClick={() => router.push(`/match/${m.id}`)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 2 ? "1px solid #f7f7f7" : "none", cursor: "pointer" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{m.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{m.home} vs {m.away}</div>
                      <div style={{ fontSize: 10, color: "#aaa" }}>{m.date}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#B0492E" }}>{m.tripFrom}€</div>
                      <div style={{ fontSize: 9, color: "#aaa" }}>full trip</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}