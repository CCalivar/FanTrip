import { NextResponse } from "next/server";

const API_KEY = process.env.MAILCHIMP_API_KEY || "";
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID || "";
const DC = "us8";

export async function POST(request: Request) {
  const { email, tags } = await request.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    const res = await fetch(
      `https://${DC}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `apikey ${API_KEY}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          tags: tags || ["fantrip"],
        }),
      }
    );
    const data = await res.json();
    if (data.title === "Member Exists") return NextResponse.json({ success: true });
    if (!res.ok) return NextResponse.json({ error: data.detail }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}