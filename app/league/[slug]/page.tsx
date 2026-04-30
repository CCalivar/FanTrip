"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const leagueInfo: Record<string, any> = {
  "champions-league": { name: "Champions League", emoji: "🏆", color: "#1a3a6b", code: "CL" },
  "premier-league": { name: "Premier League", emoji: "🔴", color: "#3D195B", code: "PL" },
  "laliga": { name: "LaLiga", emoji: "🟡", color: "#FF4B44", code: "PD" },
  "bundesliga": { name: "Bundesliga", emoji: "⚫", color: "#D3010C", code: "BL1" },
  "serie-a": { name: "Serie A", emoji: "🔵", color: "#1B3F8B", code: "SA" },
};

export default function LeaguePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const league = leagueInfo[slug] || { name: "League", emoji: "⚽", color: "#1a1a2e", code: "" };
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/matches")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMatches(data.filter((m: any) => m.league === league.name));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [league.name]);

  return (
    <main style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: "#F2F3F5", minHeight: "100vh", color: "#1a1a1a" }}>

      {/* NAV */}
      <nav style={{ background: "#0D0D0D", height: 56, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1.5px solid #E8330A", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center" }}>
          <div onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 28, cursor: "pointer" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#E8330A,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}><img src="/ChatGPT_Image_30_abr_2026__01_53_03.png" alt="FanTrip" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" }} /></div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Fan<span style={{ color: "#F97316" }}>Trip</span></span>
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
      <div style={{ background: `linear-gradient(160deg,#0D0D0D 0%,${league.color} 100%)`, padding: "32px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{league.emoji}</div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>2024/25 Season</div>
              <h1 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "#fff", letterSpacing: -1 }}>{league.name}</h1>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 20 }}>
              {[["Matches", matches.length || "—"], ["Updated", "1h ago"]].map(([lbl, val]) => (
                <div key={lbl as string} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>{val}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LEAGUE SELECTOR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 20px", overflowX: "auto" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0 }}>
          {Object.entries(leagueInfo).map(([s, l]) => (
            <div key={s} onClick={() => router.push(`/league/${s}`)} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: s === slug ? "#E8330A" : "#999", cursor: "pointer", borderBottom: s === slug ? "2px solid #E8330A" : "2px solid transparent", whiteSpace: "nowrap" }}>
              {l.emoji} {l.name}
            </div>
          ))}
        </div>
      </div>

      {/* MATCHES */}
      <div style={{ padding: "20px 20px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Upcoming matches · {league.name}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #ebebeb" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: 14 }}>Loading matches...</div>
            ) : matches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: 14 }}>No upcoming matches found.</div>
            ) : (
              matches.map((m, i) => (
                <div key={m.id} onClick={() => router.push(`/match/${m.id}`)}
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: i < matches.length - 1 ? "1px solid #f7f7f7" : "none", cursor: "pointer", background: hoveredId === m.id ? "#FAFAFA" : "#fff", transition: "background 0.1s" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{m.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.home} vs {m.away}</div>
                    <div style={{ fontSize: 11, color: "#aaa", display: "flex", gap: 6 }}>
                      <span>{m.date}</span><span style={{ color: "#ddd" }}>·</span><span>{m.venue || "TBC"}</span>
                    </div>
                  </div>
                  <div style={{ background: "#FFF5F3", border: "1px solid #FFD6CC", borderRadius: 7, padding: "5px 11px", flexShrink: 0, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#E8330A", letterSpacing: 1 }}>🎟✈🏨</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#E8330A" }}>from {m.tripFrom}€</div>
                    <div style={{ fontSize: 9, color: "#F97316" }}>full trip</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, minWidth: 80 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{m.price}€</div>
                    {m.drop
                      ? <div style={{ fontSize: 10, background: "#E8F5E9", color: "#1B5E20", padding: "1px 6px", borderRadius: 999, fontWeight: 700, display: "inline-block", marginTop: 2 }}>↓{Math.abs(m.drop)}%</div>
                      : <div style={{ fontSize: 10, background: "#FFF3E0", color: "#E65100", padding: "1px 6px", borderRadius: 999, fontWeight: 700, display: "inline-block", marginTop: 2 }}>↑ Hot</div>
                    }
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}