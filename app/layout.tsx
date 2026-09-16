import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FanTrip — Cheap Tickets, Flights & Hotels for Any Football Match",
    template: "%s | FanTrip",
  },
  description: "Find the cheapest way to attend any football match in Europe. Compare ticket prices, flights and hotels in one search. Prices from your city.",
  openGraph: {
    siteName: "FanTrip",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name='impact-site-verification' content='edf0ddc2-0fa3-4dec-b987-dad0c24d283e' />
        {/* Organization schema: helps both classic search (Google rich
            results / Knowledge Panel) and AI answer engines (ChatGPT,
            Perplexity, Google AI Overviews) correctly identify what FanTrip
            is when citing or summarizing it — part of the GEO (Generative
            Engine Optimization) work, alongside /llms.txt. */}
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FanTrip",
              url: SITE_URL,
              logo: `${SITE_URL}/fantrip-logo.png`,
              description:
                "FanTrip compares match tickets, flights and hotels so football fans can find the cheapest way to attend any match, with prices from their own city.",
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Script
          id="impact-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7243249-d625-4eab-8b38-e5775e4381ef1.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`,
          }}
        />
        {children}
      </body>
    </html>
  );
}