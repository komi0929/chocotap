"use client";

import type { Shop } from "./shops";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "";
const CACHE_KEY = "chocotap_places_v2";

export interface PlaceData {
  placeId: string;
  name: string;
  rating: number | null;
  ratingCount: number;
  address: string;
  mapsUrl: string;
  photos: string[];
}

let cache: Record<string, { data: PlaceData; ts: number }> = {};

function loadCache() {
  try {
    cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    cache = {};
  }
}

function saveCache() {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export function getCachedPlace(shopName: string): PlaceData | null {
  loadCache();
  const c = cache[shopName];
  if (c && c.ts > Date.now() - SEVEN_DAYS) return c.data;
  return null;
}

export async function searchPlace(shop: Shop): Promise<PlaceData | null> {
  if (!API_KEY) return null;

  const cacheKey = shop.name;
  loadCache();
  if (cache[cacheKey] && cache[cacheKey].ts > Date.now() - SEVEN_DAYS) {
    return cache[cacheKey].data;
  }

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.photos,places.rating,places.userRatingCount,places.formattedAddress,places.googleMapsUri",
      },
      body: JSON.stringify({
        textQuery: `${shop.name} ${shop.prefecture} チョコレート`,
        languageCode: "ja",
        maxResultCount: 1,
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const place = json.places?.[0];
    if (!place) return null;

    const result: PlaceData = {
      placeId: place.id,
      name: place.displayName?.text || shop.name,
      rating: place.rating ?? null,
      ratingCount: place.userRatingCount ?? 0,
      address: place.formattedAddress || "",
      mapsUrl: place.googleMapsUri || "",
      photos: (place.photos || []).slice(0, 3).map((p: { name: string }) => p.name),
    };

    cache[cacheKey] = { data: result, ts: Date.now() };
    saveCache();
    return result;
  } catch {
    return null;
  }
}

export function getPhotoUrl(photoName: string, maxWidth = 400): string {
  if (!API_KEY || !photoName) return "";
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${API_KEY}`;
}

export async function fetchAllShops(
  shops: Shop[],
  onProgress?: (done: number, total: number) => void
) {
  if (!API_KEY) return;
  loadCache();

  for (let i = 0; i < shops.length; i++) {
    const shop = shops[i];
    if (!cache[shop.name] || cache[shop.name].ts <= Date.now() - SEVEN_DAYS) {
      await searchPlace(shop);
      await new Promise((r) => setTimeout(r, 300));
    }
    onProgress?.(i + 1, shops.length);
  }
}
