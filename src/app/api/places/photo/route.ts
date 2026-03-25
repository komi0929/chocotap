import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";

export async function GET(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const name = req.nextUrl.searchParams.get("name");
  const maxWidth = req.nextUrl.searchParams.get("maxWidth") || "400";

  if (!name) {
    return NextResponse.json({ error: "name param required" }, { status: 400 });
  }

  try {
    const url = `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${maxWidth}&key=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json({ error: "Photo fetch failed" }, { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
