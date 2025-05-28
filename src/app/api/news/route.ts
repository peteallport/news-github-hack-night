import { NextResponse } from "next/server";
import { friendli } from "@friendliai/ai-provider";
import { generateText } from "ai";

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

export async function POST(req: Request) {
  const token = process.env.FRIENDLI_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Missing Friendli token" },
      { status: 500 }
    );
  }

  let articleText = "";
  try {
    const body = await req.json();
    articleText = body.article || body.text || "";
    if (!articleText) {
      return NextResponse.json(
        { error: "Missing article text in request body" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  try {
    const { text } = await generateText({
      model: friendli("meta-llama-3.3-70b-instruct"),
      prompt: `Rewrite the following news article to be as neutral and unbiased as possible.\n\n${articleText}`,
    });
    return NextResponse.json({ neutralSummary: text });
  } catch (err: unknown) {
    let message = "Failed to generate neutral summary";
    function hasMessage(e: unknown): e is { message: string } {
      return (
        typeof e === "object" &&
        e !== null &&
        "message" in e &&
        typeof (e as { message: unknown }).message === "string"
      );
    }
    if (hasMessage(err)) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
