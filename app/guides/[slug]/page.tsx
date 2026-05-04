import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { notFound } from "next/navigation";
import Link from "next/link";

const guidesDir = path.join(process.cwd(), "content/guides");

export async function generateStaticParams() {
  const files = fs.readdirSync(guidesDir);
  return files.map((f) => ({ slug: f.replace(".md", "") }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const file = fs.readFileSync(path.join(guidesDir, `${params.slug}.md`), "utf8");
    const { data } = matter(file);
    return {
      title: `${data.title} | FanTrip Guides`,
      description: data.description,
      openGraph: { title: data.title, description: data.description, siteName: "FanTrip" },
    };
  } catch {
    return { title: "Guide | FanTrip" };
  }
}

const categoryColors: Record<string, { bg: string; color: string; label: string }> = {
  tickets: { bg: "#FFF3E0", color: "#E65100", label: "🎟 Tickets" },
  insurance: { bg: "#EDE7F6", color: "#4527A0", label: "🛡️ Insurance" },
  esim: { bg: "#E3F2FD", color: "#0D47A1", label: "📱 eSIM" },
  money: { bg: "#F5F5F5", color: "#424242", label: "💳 Money" },
  worldcup: { bg: "#E8F5E9", color: "#1B5E20", label: "🌍 World Cup" },
  destination: { bg: "#FFF8E1", color: "#F57F17", label: "🏟 Stadium Guide" },
  planning: { bg: "#E8F5E9", color: "#1B5E20", label: "📋 Planning" },
};

export default async function GuidePage({ params }: { params: { slug: string } }) {
  let content, frontmatter;
  try {
    const file = fs.readFileSync(path.join(guidesDir, `${params.slug}.md`), "utf8");
    const { data, content: mdContent } = matter(file);
    frontmatter = data;
    const processed = await remark().use(html).process(mdContent);
    content = processed.toString();
  } catch {
    notFound();
  }

  const cat = categoryColors[frontmatter.category] || { bg: "#F5F5F5", color: "#666", label: frontmatter.category };

  // Related affiliate based on category
  const affiliates: Record<string, { name: string; desc: string; btnText: string; btnBg: string; url: string }[]> = {
    tickets: [
      { name: "StubHub", desc: "Best available tickets · E-ticket instant", btnText: "Find tickets →", btnBg: "#E8330A", url: "https://stubhubinternational.sjv.io/gRWRRv" },
    ],
    insurance: [
      { name: "Chapka Assurances", desc: "Covers event cancellation · from 12€", btnText: "Get insured →", btnBg: "#7B1FA2", url: "https://www.chapka-assurances.com" },
      { name: "Heymondo", desc: "Best for World Cup 2026 USA · from 15€", btnText: "Get insured →", btnBg: "#1565C0", url: "https://www.heymondo.com" },
    ],
    esim: [
      { name: "Airalo", desc: "5GB Europe from €4.50 · instant activation", btnText: "Get eSIM →", btnBg: "#1565C0", url: "https://tp.media/r?marker=723474.FT&trs=523774&p=8310&u=https%3A%2F%2Fairalo.com&campaign_id=541" },
      { name: "YeSIM", desc: "150+ countries · from €3.50", btnText: "Get eSIM →", btnBg: "#0D47A1", url: "https://tp.media/r?marker=723474.FT&trs=523774&p=5998&u=https%3A%2F%2Fyesim.tech&campaign_id=224" },
    ],
    money: [
      { name: "Revolut", desc: "Zero FX fees · free account · 5 min setup", btnText: "Get Revolut →", btnBg: "#1a1a1a", url: "https://www.revolut.com" },
    ],
    worldcup: [
      { name: "Airalo (North America)", desc: "USA + Canada + Mexico in one eSIM", btnText: "Get eSIM →", btnBg: "#1565C0", url: "https://tp.media/r?marker=723474.FT&trs=523774&p=8310&u=https%3A%2F%2Fairalo.com&campaign_id=541" },
      { name: "Chapka Assurances", desc: "Travel insurance · covers event cancellation", btnText: "Get insured →", btnBg: "#7B1FA2", url: "https://www.chapka-assurances.com" },
    ],
    destination: [
      { name: "GetTransfer", desc: "Fixed price airport transfer · from €28", btnText: "Book transfer →", btnBg: "#00695C", url: "https://tp.media/r?marker=723474.FT&trs=523774&p=4439&u=https%3A%2F%2Fgettransfer.com&campaign_id=147" },
    ],
    planning: [
      { name: "Chapka Assurances", desc: "Travel insurance · from 12€ per trip", btnText: "Get insured →", btnBg: "#7B1FA2", url: "https://www.chapka-assurances.com" },
    ],
  };

  const relatedAffs = affiliates[frontmatter.category] || [];

  return (
    <main style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: "#F2F3F5", minHeight: "100vh", color: "#1a1a1a" }}>

      {/* NAV */}
      <nav style={{ background: "#0D0D0D", height: 56, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1.5px solid #E8330A", position: "sticky" as const, top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 28, textDecoration: "none" }}>
            <img src="/ChatGPT_Image_30_abr_2026__01_53_03.png" alt="FanTrip" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" as const }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Fan<span style={{ color: "#F97316" }}>Trip</span></span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: "auto", marginRight: 16 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <Link href="/travel" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Guides</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{frontmatter.title?.substring(0, 40)}...</span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(160deg,#0D0D0D 0%,#1a1a2e 100%)", padding: "40px 20px 36px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: cat.bg, color: cat.color, marginBottom: 16 }}>
            {cat.label}
          </div>
          <h1 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, color: "#fff", letterSpacing: -1, lineHeight: 1.1, marginBottom: 12 }}>
            {frontmatter.title}
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 16, maxWidth: 600 }}>
            {frontmatter.description}
          </p>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", display: "flex", gap: 16 }}>
            <span>📖 {frontmatter.readTime} min read</span>
            <span>📅 {frontmatter.date}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 60px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>

        {/* ARTICLE */}
        <div>
          <div style={{ background: "#fff", borderRadius: 14, padding: "32px 36px", border: "1px solid #ebebeb", lineHeight: 1.8 }}>
            <style>{`
              .guide-content h2 { font-size: 22px; font-weight: 800; color: #1a1a1a; margin: 32px 0 12px; letter-spacing: -0.5px; }
              .guide-content h3 { font-size: 17px; font-weight: 700; color: #1a1a1a; margin: 24px 0 8px; }
              .guide-content p { font-size: 15px; color: #444; line-height: 1.8; margin-bottom: 16px; }
              .guide-content ul, .guide-content ol { padding-left: 24px; margin-bottom: 16px; }
              .guide-content li { font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 6px; }
              .guide-content strong { color: #1a1a1a; font-weight: 700; }
              .guide-content hr { border: none; border-top: 2px solid #f0f0f0; margin: 32px 0; }
              .guide-content table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
              .guide-content th { background: #E8330A; color: #fff; padding: 10px 14px; text-align: left; font-weight: 700; }
              .guide-content td { padding: 10px 14px; border-bottom: 1px solid #f0f0f0; color: #444; }
              .guide-content tr:nth-child(even) td { background: #FAFAFA; }
              .guide-content blockquote { border-left: 3px solid #E8330A; padding-left: 16px; margin: 20px 0; color: #666; font-style: italic; }
            `}</style>
            <div className="guide-content" dangerouslySetInnerHTML={{ __html: content }} />
          </div>

          {/* BACK LINK */}
          <div style={{ marginTop: 20 }}>
            <Link href="/travel" style={{ fontSize: 13, color: "#E8330A", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              ← Back to all guides
            </Link>
          </div>
        </div>

        {/* SIDEBAR */}
        <div>
          {/* AFFILIATE CARDS */}
          {relatedAffs.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 14, padding: "18px", marginBottom: 14, border: "1px solid #ebebeb" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 14 }}>
                Recommended
              </div>
              {relatedAffs.map((aff, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: i < relatedAffs.length - 1 ? "1px solid #f7f7f7" : "none" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 3 }}>{aff.name}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginBottom: 10 }}>{aff.desc}</div>
                  <a href={aff.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", padding: "9px", background: aff.btnBg, color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textAlign: "center" as const, textDecoration: "none" }}>
                    {aff.btnText}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* FIND A MATCH */}
          <div style={{ background: "linear-gradient(135deg,#E8330A,#F97316)", borderRadius: 14, padding: "18px", marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Find your next match</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 14, lineHeight: 1.5 }}>
              Tickets, flights and hotels in one search. Prices from your city.
            </div>
            <Link href="/" style={{ display: "block", background: "#fff", color: "#E8330A", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 700, textAlign: "center" as const, textDecoration: "none" }}>
              Browse matches →
            </Link>
          </div>

          {/* MORE GUIDES */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #ebebeb" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 14 }}>More guides</div>
            {[
              { title: "How to not get locked out of a match", slug: "how-to-not-get-locked-out-of-a-football-match" },
              { title: "Champions League away trip guide", slug: "champions-league-away-trip-guide" },
              { title: "World Cup 2026 tickets guide", slug: "world-cup-2026-tickets-guide" },
              { title: "Best travel cards for away trips", slug: "best-zero-fee-cards-football-travel" },
              { title: "When do ticket prices drop?", slug: "when-do-football-ticket-prices-drop" },
            ].filter(g => g.slug !== params.slug).slice(0, 4).map((g, i) => (
              <Link key={i} href={`/guides/${g.slug}`} style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#1a1a1a", padding: "8px 0", borderBottom: i < 3 ? "1px solid #f7f7f7" : "none", textDecoration: "none" }}>
                → {g.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}