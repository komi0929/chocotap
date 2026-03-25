import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { shopName, prefecture } = body;

    if (!shopName) {
      return NextResponse.json({ error: "shopName required" }, { status: 400 });
    }

    const query = `${shopName} ${prefecture || ""} チョコレート`;
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.photos,places.rating,places.userRatingCount,places.formattedAddress,places.googleMapsUri",
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "ja",
        maxResultCount: 1,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Places API error" }, { status: res.status });
    }

    const json = await res.json();
    const place = json.places?.[0];
    if (!place) {
      return NextResponse.json({ place: null });
    }

    return NextResponse.json({
      place: {
        placeId: place.id,
        name: place.displayName?.text || shopName,
        rating: place.rating ?? null,
        ratingCount: place.userRatingCount ?? 0,
        address: place.formattedAddress || "",
        mapsUrl: place.googleMapsUri || "",
        photos: (place.photos || []).slice(0, 3).map((p: { name: string }) => p.name),
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
