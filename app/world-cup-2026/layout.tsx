import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Tickets & Travel — USA, Canada, Mexico | FanTrip",
  description: "Everything you need to attend the 2026 FIFA World Cup. Compare ticket prices, book flights and hotels for all 104 matches across 16 host cities in USA, Canada and Mexico.",
};

export default function WorldCupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}