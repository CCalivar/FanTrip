import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

const guidesDir = path.join(process.cwd(), "content/guides");

export const metadata = {
  title: "Travel Guides | FanTrip",
  description:
    "Everything away fans need to know before a match: how to get tickets, where to stay, what to pack, and how to not get locked out on match day.",
  openGraph: {
    title: "Travel Guides | FanTrip",
    description:
      "Everything away fans need to know before a match: tickets, travel, stadiums and money-saving tips.",
    siteName: "FanTrip",
  },
};

const categoryColors: Record<string, { bg: string; color: string; label: string }> = {
  tickets: { bg: "#FFF3E0", color: "#E65100", label: "🎟 Tickets" },
  insurance: { bg: "#EDE7F6", color: "#4527A0", label: "🛡️ Insurance" },
  esim: { bg: "#E3F2FD", color: "#0D47A1", label: "📱 eSIM" },
  money: { bg: "#F5F5F5", color: "#424242", label: "💳 Money" },
  worldcup: { bg: "#E8F5E9", color: "#1B5E20", label: "🌍 World Cup" },
  destination: { bg: "#FFF8E1", color: "#F57F17", label: "🏟 Stadium Guide" },
  planning: { bg: "#E8F5E9", color: "#1B5E20", label: "📋 Planning" },
};

function getGuides() {
  const files = fs.readdirSync(guidesDir).filter((f) => f.endsWith(".md"));
  const guides = files.map((f) => {
    const file = fs.readFileSync(path.join(guidesDir, f), "utf8");
    const { data } = matter(file);
    return {
      slug: data.slug || f.replace(".md", ""),
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
      category: data.category as string,
      readTime: data.readTime as number,
    };
  });
  // Most recent first, stable fallback to title for a deterministic order.
  return guides.sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return dateDiff !== 0 ? dateDiff : a.title.localeCompare(b.title);
  });
}

export default function GuidesPage() {
  const guides = getGuides();

  return (
    <main style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: "#F7F4EE", minHeight: "100vh", color: "#1a1a1a" }}>

      {/* NAV */}
      <nav style={{ background: "#1C1B18", height: 56, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1.5px solid #B0492E", position: "sticky" as const, top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 28, textDecoration: "none" }}>
            <img src="/fantrip-logo.png" alt="FanTrip" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" as const }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Fan<span style={{ color: "#C79A4B" }}>Trip</span></span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: "auto", marginRight: 16 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Guides</span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(160deg,#1C1B18 0%,#2A2621 100%)", padding: "40px 20px 36px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, color: "#fff", letterSpacing: -1, lineHeight: 1.1, marginBottom: 12 }}>
            Travel Guides
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 600 }}>
            Tickets, stadiums, money and everything else away fans need to know before match day.
          </p>
        </div>
      </div>

      {/* GUIDES GRID */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div
          className="guides-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
        >
          {guides.map((g) => {
            const cat = categoryColors[g.category] || { bg: "#F5F5F5", color: "#666", label: g.category };
            return (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                style={{ display: "block", background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #ebebeb", textDecoration: "none", color: "inherit" }}
              >
                <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: cat.bg, color: cat.color, marginBottom: 12 }}>
                  {cat.label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", letterSpacing: -0.3, lineHeight: 1.3, marginBottom: 8 }}>
                  {g.title}
                </div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 14 }}>
                  {g.description}
                </div>
                <div style={{ fontSize: 11, color: "#bbb", display: "flex", gap: 12 }}>
                  <span>📖 {g.readTime} min read</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .guides-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .guides-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
