import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing NewsAPI key" }, { status: 500 });
  }

  const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { error: error.message || "Failed to fetch news" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
