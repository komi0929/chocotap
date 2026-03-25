"use client";

import type { Shop } from "./shops";

const CACHE_KEY = "chocotap_places_v2";

export interface PlaceData {
  placeId: string;
  name: string;
  rating: number | null;
  ratingCount: number;
  address: string;
  mapsUrl: string;
  photos: string[]; // photo resource names
}

let cache: Record<string, { data: PlaceData; ts: number }> = {};
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

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

export function getCachedPlace(shopName: string): PlaceData | null {
  loadCache();
  const c = cache[shopName];
  if (c && c.ts > Date.now() - SEVEN_DAYS) return c.data;
  return null;
}

// Calls the server-side API route (API key is hidden)
export async function searchPlace(shop: Shop): Promise<PlaceData | null> {
  const cacheKey = shop.name;
  loadCache();
  if (cache[cacheKey] && cache[cacheKey].ts > Date.now() - SEVEN_DAYS) {
    return cache[cacheKey].data;
  }

  try {
    const res = await fetch("/api/places/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopName: shop.name, prefecture: shop.prefecture }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (!json.place) return null;

    cache[cacheKey] = { data: json.place, ts: Date.now() };
    saveCache();
    return json.place;
  } catch {
    return null;
  }
}

// Photo URL via server-side proxy (API key hidden)
export function getPhotoUrl(photoName: string, maxWidth = 400): string {
  if (!photoName) return "";
  return `/api/places/photo?name=${encodeURIComponent(photoName)}&maxWidth=${maxWidth}`;
}

export async function fetchAllShops(
  shops: Shop[],
  onProgress?: (done: number, total: number) => void
) {
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
