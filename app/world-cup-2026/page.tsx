"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const hostCities = [
  { city: "New York / NJ", country: "United States", flag: "🇺🇸", stadium: "MetLife Stadium", capacity: "82,500", matches: 8, tripFrom: 780, final: true, color: "#1a3a6b" },
  { city: "Los Angeles", country: "United States", flag: "🇺🇸", stadium: "SoFi Stadium", capacity: "70,240", matches: 7, tripFrom: 820, final: false, color: "#1a3a6b" },
  { city: "Mexico City", country: "Mexico", flag: "🇲🇽", stadium: "Estadio Azteca", capacity: "87,500", matches: 5, tripFrom: 640, final: false, color: "#004400" },
  { city: "Dallas", country: "United States", flag: "🇺🇸", stadium: "AT&T Stadium", capacity: "80,000", matches: 6, tripFrom: 710, final: false, color: "#1a3a6b" },
  { city: "Toronto", country: "Canada", flag: "🇨🇦", stadium: "BMO Field", capacity: "45,000", matches: 6, tripFrom: 690, final: false, color: "#5a0000" },
  { city: "Miami", country: "United States", flag: "🇺🇸", stadium: "Hard Rock Stadium", capacity: "65,326", matches: 6, tripFrom: 750, final: false, color: "#0a3a5e" },
  { city: "San Francisco", country: "United States", flag: "🇺🇸", stadium: "Levi's Stadium", capacity: "68,500", matches: 6, tripFrom: 840, final: false, color: "#1a3a6b" },
  { city: "Seattle", country: "United States", flag: "🇺🇸", stadium: "Lumen Field", capacity: "69,000", matches: 5, tripFrom: 810, final: false, color: "#1a3a6b" },
  { city: "Guadalajara", country: "Mexico", flag: "🇲🇽", stadium: "Estadio Akron", capacity: "49,850", matches: 5, tripFrom: 620, final: false, color: "#004400" },
];

const keyMatches = [
  { icon: "🎉", bg: "#E8F5E9", title: "Opening Match — Mexico vs TBD", date: "11 Jun 2026", venue: "Estadio Azteca", city: "Mexico City", tripFrom: 640, tag: "Opening", tagBg: "#E8F5E9", tagColor: "#1B5E20" },
  { icon: "🏆", bg: "#EDE7F6", title: "World Cup Final", date: "19 Jul 2026", venue: "MetLife Stadium", city: "New York / NJ", tripFrom: 1780, tag: "Final", tagBg: "#EDE7F6", tagColor: "#4527A0" },
  { icon: "⚡", bg: "#FFF3E0", title: "Semi Final 1", date: "14 Jul 2026", venue: "SoFi Stadium", city: "Los Angeles", tripFrom: 1200, tag: "Semi", tagBg: "#FFF3E0", tagColor: "#E65100" },
  { icon: "⚡", bg: "#FFF3E0", title: "Semi Final 2", date: "15 Jul 2026", venue: "AT&T Stadium", city: "Dallas", tripFrom: 1100, tag: "Semi", tagBg: "#FFF3E0", tagColor: "#E65100" },
  { icon: "🌍", bg: "#E3F2FD", title: "Spain — Group Stage matches", date: "~Jun 18 2026", venue: "Multiple cities", city: "USA", tripFrom: 750, tag: "Group", tagBg: "#E3F2FD", tagColor: "#0D47A1" },
  { icon: "🇦🇷", bg: "#FFF3E0", title: "Argentina — Group Stage", date: "~Jun 20 2026", venue: "Multiple cities", city: "USA", tripFrom: 680, tag: "Group", tagBg: "#E3F2FD", tagColor: "#0D47A1" },
];

const pricePhases = [
  { name: "Group Stage", date: "Jun 11 – Jul 2", range: "180–320€", barW: "28%", barClass: "low", tag: "✓ Buy early", tagBg: "#E8F5E9", tagColor: "#1B5E20" },
  { name: "Round of 32", date: "Jul 3–6", range: "250–450€", barW: "38%", barClass: "low", tag: "Set alert", tagBg: "#E3F2FD", tagColor: "#0D47A1" },
  { name: "Quarter Finals", date: "Jul 9–12", range: "400–750€", barW: "55%", barClass: "mid", tag: "↑ Buy early", tagBg: "#FFF3E0", tagColor: "#E65100" },
  { name: "Semi Finals", date: "Jul 14–15", range: "600–1.400€", barW: "74%", barClass: "high", tag: "↑↑ Very high", tagBg: "#FFEBEE", tagColor: "#B71C1C" },
  { name: "Final · NY", date: "Jul 19", range: "1.500–5.000€", barW: "92%", barClass: "high", tag: "🔔 Alert now", tagBg: "#FFEBEE", tagColor: "#B71C1C" },
];

export default function WorldCup2026() {
  const router = useRouter();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSet, setAlertSet] = useState(false);
  const [selectedAlerts, setSelectedAlerts] = useState(["final", "semis"]);

  useEffect(() => {
    const worldCup = new Date("2026-06-11T00:00:00");
    const timer = setInterval(() => {
      const diff = worldCup.getTime() - Date.now();
      if (diff <= 0) return;
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleAlert = (key: string) => {
    setSelectedAlerts(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const barColor = (c: string) => c === "low" ? "linear-gradient(90deg,#2E7D32,#43A047)" : c === "mid" ? "linear-gradient(90deg,#F57F17,#FBC02D)" : "linear-gradient(90deg,#E8330A,#EF5350)";

  return (
    <main style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: "#F2F3F5", minHeight: "100vh", color: "#1a1a1a" }}>

      {/* NAV */}
      <nav style={{ background: "#0D0D0D", height: 56, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1.5px solid #E8330A", position: "sticky" as const, top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center" }}>
          <div onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginRight: 28 }}>
            <img src="/ChatGPT_Image_30_abr_2026__01_53_03.png" alt="FanTrip" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" as const }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Fan<span style={{ color: "#F97316" }}>Trip</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: "auto", marginRight: 16 }}>
            <span onClick={() => router.push("/")} style={{ cursor: "pointer" }}>Home</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <span style={{ color: "#60a5fa", fontWeight: 600 }}>🌍 World Cup 2026</span>
          </div>
          <button onClick={() => router.push("/")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>← Back</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(160deg,#050510 0%,#0a1628 40%,#0d2444 70%,#0f3060 100%)", padding: "52px 20px 0", position: "relative", overflow: "hidden", minHeight: 340 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(1px 1px at 15% 25%,rgba(255,255,255,0.2) 0%,transparent 100%),radial-gradient(1px 1px at 55% 15%,rgba(255,255,255,0.15) 0%,transparent 100%),radial-gradient(1px 1px at 75% 55%,rgba(255,255,255,0.18) 0%,transparent 100%)", pointerEvents: "none" as const }} />
        <div style={{ position: "absolute", top: -150, left: "50%", transform: "translateX(-50%)", width: 800, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(96,165,250,0.08) 0%,transparent 65%)", pointerEvents: "none" as const }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 999, padding: "5px 16px", fontSize: 11, color: "#60a5fa", fontWeight: 700, marginBottom: 20, letterSpacing: 0.5, textTransform: "uppercase" as const }}>
            🌍 FIFA World Cup · June–July 2026
          </div>
          <h1 style={{ fontSize: "clamp(36px,7vw,72px)", fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: -3, marginBottom: 12 }}>
            World Cup{" "}
            <span style={{ background: "linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2026</span>
          </h1>
          <p style={{ fontSize: "clamp(13px,2vw,16px)", color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.6, maxWidth: 520 }}>
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>48 teams · 104 matches · 16 host cities.</strong><br />
            Track ticket & travel prices now — before they spike.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" as const }}>
            {[["🇺🇸", "USA", "11 cities"], ["🇨🇦", "Canada", "2 cities"], ["🇲🇽", "Mexico", "3 cities"]].map(([flag, country, cities]) => (
              <div key={country} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px" }}>
                <span style={{ fontSize: 18 }}>{flag}</span>
                <div><div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{country}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{cities}</div></div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: 36 }}>
            <button style={{ background: "linear-gradient(135deg,#E8330A,#F97316)", border: "none", color: "#fff", padding: "13px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(232,51,10,0.3)" }}>🔔 Set price alerts — free</button>
            <button style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "13px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🏟 Browse host cities</button>
          </div>
        </div>
      </div>

      {/* COUNTDOWN */}
      <div style={{ background: "linear-gradient(135deg,#0a1628,#0d2444)", borderTop: "1px solid rgba(96,165,250,0.15)", padding: "20px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", flexWrap: "wrap" as const, gap: 0 }}>
          {[["Days", countdown.days], ["Hours", countdown.hours], ["Min", countdown.mins], ["Sec", countdown.secs]].map(([lbl, val], i) => (
            <div key={lbl as string} style={{ flex: 1, textAlign: "center" as const, borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none", padding: "8px 0", minWidth: 60 }}>
              <div style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: -2 }}>{String(val).padStart(2, "0")}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: 1, marginTop: 4 }}>{lbl}</div>
            </div>
          ))}
          <div style={{ flex: 3, paddingLeft: 28, borderLeft: "1px solid rgba(255,255,255,0.06)", minWidth: 200 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#60a5fa", marginBottom: 4 }}>⚽ Kick-off: 11 June 2026 · Estadio Azteca, Mexico City</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>Ticket sales expected early 2026. Set a free alert — we'll notify you the moment prices go live.</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ padding: "28px 20px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          <div>

            {/* CITIES */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" as const, letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: 8 }}>
                🏟 Host cities
                <span style={{ background: "#1565C0", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>16 cities</span>
              </div>
              <span style={{ fontSize: 12, color: "#E8330A", fontWeight: 600, cursor: "pointer" }}>View all →</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 10, marginBottom: 24 }}>
              {hostCities.slice(0, 6).map(c => (
                <div key={c.city} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", cursor: "pointer", border: "1px solid #ebebeb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "all 0.15s" }}>
                  <div style={{ height: 72, background: `linear-gradient(135deg,${c.color},${c.color}dd)`, display: "flex", alignItems: "flex-end", padding: "10px 12px", position: "relative" as const }}>
                    <span style={{ position: "absolute" as const, top: 8, right: 10, fontSize: 20 }}>{c.flag}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{c.city}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{c.country}</div>
                    </div>
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>{c.stadium}</div>
                    <div style={{ fontSize: 10, color: "#aaa", marginBottom: 7, display: "flex", alignItems: "center", gap: 6 }}>
                      {c.matches} matches
                      {c.final && <span style={{ background: "#EDE7F6", color: "#4527A0", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 999 }}>FINAL</span>}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#E8330A" }}>{c.matches} matches</span>
                      <span style={{ fontSize: 11, color: "#aaa" }}>from <strong style={{ color: "#1a1a1a" }}>{c.tripFrom}€</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PRICE TRACKER */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" as const, letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: 8 }}>
                📊 Expected ticket prices
                <span style={{ background: "#E8330A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>Historical data</span>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 24, border: "1px solid #ebebeb" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center" }}>📈</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Price forecast by phase</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>Based on 2018, 2022 & 2026 data · from Madrid</div>
                </div>
              </div>
              {pricePhases.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", borderBottom: i < pricePhases.length - 1 ? "1px solid #f7f7f7" : "none", flexWrap: "wrap" as const, gap: 12 }}>
                  <div style={{ width: 110, flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: "#aaa" }}>{p.date}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 100, height: 26, background: "#f5f5f5", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ width: p.barW, height: "100%", background: barColor(p.barClass), borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 10, fontSize: 10, fontWeight: 700, color: p.barClass === "mid" ? "#333" : "#fff" }}>
                      {p.range}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: p.tagBg, color: p.tagColor }}>{p.tag}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* KEY MATCHES */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>⚽ Key matches to watch</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #ebebeb", marginBottom: 24 }}>
              {keyMatches.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: i < keyMatches.length - 1 ? "1px solid #f7f7f7" : "none", flexWrap: "wrap" as const }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{m.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 3 }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: "#aaa", display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                      <span>{m.date}</span><span style={{ color: "#ddd" }}>·</span><span>{m.venue}</span>
                    </div>
                  </div>
                  <div style={{ background: "#FFF5F3", border: "1px solid #FFD6CC", borderRadius: 7, padding: "5px 11px", flexShrink: 0, textAlign: "center" as const }}>
                    <div style={{ fontSize: 10, color: "#E8330A" }}>🎟✈🏨</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#E8330A" }}>est. {m.tripFrom}€</div>
                    <div style={{ fontSize: 9, color: "#F97316" }}>full trip</div>
                  </div>
                  <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a" }}>TBC</div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: m.tagBg, color: m.tagColor, marginTop: 3, display: "inline-block" }}>{m.tag}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* GUIDES */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>📖 World Cup 2026 travel guides</div>
              <span style={{ fontSize: 12, color: "#E8330A", fontWeight: 600, cursor: "pointer" }}>All guides →</span>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #ebebeb" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr" }}>
                <div style={{ padding: "18px 20px", borderRight: "1px solid #f0f0f0", cursor: "pointer" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#E8330A", textTransform: "uppercase" as const, letterSpacing: 0.4, marginBottom: 8 }}>🌍 Complete Guide</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 8, letterSpacing: -0.3 }}>How to buy FIFA World Cup 2026 tickets — complete guide</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, marginBottom: 12 }}>When ticket sales open, how the ballot works, resale options and prices by phase.</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#ccc" }}>14 min read</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#E8330A" }}>Read →</span>
                  </div>
                </div>
                <div style={{ padding: "16px", borderRight: "1px solid #f0f0f0", cursor: "pointer", display: "flex", flexDirection: "column" as const }}>
                  <div style={{ fontSize: 10, fontWeight: 700, background: "#E3F2FD", color: "#0D47A1", padding: "2px 8px", borderRadius: 999, display: "inline-block", marginBottom: 8 }}>✈ Flights</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, flex: 1, marginBottom: 8 }}>Flying to USA — when to book and cheapest routes</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#E8330A" }}>Read →</span>
                </div>
                <div style={{ padding: "16px", cursor: "pointer", display: "flex", flexDirection: "column" as const }}>
                  <div style={{ fontSize: 10, fontWeight: 700, background: "#E8F5E9", color: "#1B5E20", padding: "2px 8px", borderRadius: 999, display: "inline-block", marginBottom: 8 }}>🛡️ Insurance</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, flex: 1, marginBottom: 8 }}>Travel insurance for World Cup trips</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#E8330A" }}>Read →</span>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #f0f0f0", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
                {[
                  { cat: "💳 Money", catBg: "#F5F5F5", catColor: "#424242", title: "Best cards for USA — avoid 3–5% FX fee" },
                  { cat: "📱 eSIM", catBg: "#E3F2FD", catColor: "#0D47A1", title: "Best eSIM for USA & North America" },
                  { cat: "🏟 Stadium", catBg: "#FFF3E0", catColor: "#E65100", title: "Guide to MetLife Stadium — World Cup Final" },
                ].map((g, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderRight: i < 2 ? "1px solid #f0f0f0" : "none", cursor: "pointer" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, background: g.catBg, color: g.catColor, padding: "2px 8px", borderRadius: 999, display: "inline-block", marginBottom: 8 }}>{g.cat}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 8 }}>{g.title}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#E8330A" }}>Read →</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SIDEBAR */}
          <div>
            <div style={{ background: "#fff", borderRadius: 14, padding: "18px", marginBottom: 14, border: "2px solid #E8330A" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#E8330A", textTransform: "uppercase" as const, letterSpacing: 0.4, marginBottom: 6 }}>🔔 Don't miss out</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 4, letterSpacing: -0.3 }}>Set World Cup alerts</div>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 16, lineHeight: 1.5 }}>We'll alert you the moment ticket prices go live — and when they drop.</div>
              <input placeholder="your@email.com" value={alertEmail} onChange={e => setAlertEmail(e.target.value)} style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 10 }} />
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 14 }}>
                {[
                  { key: "final", icon: "🏆", bg: "#EDE7F6", title: "Final — New York", sub: "19 Jul · MetLife Stadium" },
                  { key: "semis", icon: "⚡", bg: "#FFF3E0", title: "Semi Finals", sub: "14–15 Jul · LA & Dallas" },
                  { key: "opening", icon: "🎉", bg: "#E8F5E9", title: "Opening match", sub: "11 Jun · Mexico City" },
                  { key: "groups", icon: "⚽", bg: "#E3F2FD", title: "Any Group Stage match", sub: "Jun 11 – Jul 2" },
                ].map(opt => (
                  <div key={opt.key} onClick={() => toggleAlert(opt.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${selectedAlerts.includes(opt.key) ? "#E8330A" : "#ebebeb"}`, background: selectedAlerts.includes(opt.key) ? "#FFF5F3" : "#fff", cursor: "pointer" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: opt.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{opt.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{opt.title}</div>
                      <div style={{ fontSize: 10, color: "#aaa" }}>{opt.sub}</div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selectedAlerts.includes(opt.key) ? "#E8330A" : "#ddd"}`, background: selectedAlerts.includes(opt.key) ? "#E8330A" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>
                      {selectedAlerts.includes(opt.key) ? "✓" : ""}
                    </div>
                  </div>
                ))}
              </div>
              {alertSet ? (
                <div style={{ background: "#E8F5E9", borderRadius: 8, padding: "12px", textAlign: "center" as const }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#2E7D32" }}>✅ Alerts set!</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>We'll notify {alertEmail}</div>
                </div>
              ) : (
                <button onClick={() => alertEmail && setAlertSet(true)} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#E8330A,#F97316)", border: "none", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Set alerts — free</button>
              )}
            </div>

            <div style={{ background: "linear-gradient(135deg,#050510,#0a1628)", borderRadius: 14, padding: "18px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 14 }}>By the numbers</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["48", "Teams", "#60a5fa"], ["104", "Matches", "#60a5fa"], ["16", "Cities", "#F97316"], ["3", "Countries", "#F97316"], ["39", "Days", "#fff"], ["5M+", "Tickets", "#fff"]].map(([num, lbl, color]) => (
                  <div key={lbl} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "12px", textAlign: "center" as const }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: -0.5, marginBottom: 2 }}>{num}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: "18px", border: "1px solid #ebebeb" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>💡 Smart traveller tips</div>
              {[
                { icon: "📅", bg: "#E8F5E9", tip: "Book flights 6–8 months early.", detail: "Transatlantic routes sell out fast — prices are lower before ticket sales open." },
                { icon: "💳", bg: "#E3F2FD", tip: "Get a zero-fee card.", detail: "Paying in USD costs 3–5% extra. Use Revolut or Wise to save on every purchase." },
                { icon: "📱", bg: "#EDE7F6", tip: "eSIM for North America.", detail: "Cover USA, Canada and Mexico with one eSIM from Airalo. From €8." },
                { icon: "🛡️", bg: "#FFF3E0", tip: "Insure your tickets.", detail: "Make sure your travel insurance covers event ticket cancellation specifically." },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 3 ? 12 : 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{t.icon}</div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}><strong style={{ color: "#1a1a1a" }}>{t.tip}</strong> {t.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .wc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}