"use client";

import type { Shop } from "./shops";

export interface PlaceData {
  placeId: string;
  name: string;
  rating: number | null;
  ratingCount: number;
  address: string;
  mapsUrl: string;
  photos: string[]; // photo resource names
}

// Static cache loaded from pre-fetched JSON (built by scripts/prefetch-places.mjs)
let staticCache: Record<string, PlaceData> | null = null;
let loadPromise: Promise<void> | null = null;

async function ensureLoaded() {
  if (staticCache) return;
  if (loadPromise) { await loadPromise; return; }
  loadPromise = (async () => {
    try {
      const res = await fetch("/places-cache.json");
      if (res.ok) {
        staticCache = await res.json();
      } else {
        staticCache = {};
      }
    } catch {
      staticCache = {};
    }
  })();
  await loadPromise;
}

export function getCachedPlace(shopName: string): PlaceData | null {
  if (!staticCache) return null;
  return staticCache[shopName] || null;
}

export async function loadPlacesCache(): Promise<Record<string, PlaceData>> {
  await ensureLoaded();
  return staticCache || {};
}

// Photo URL via server-side proxy (API key hidden)
export function getPhotoUrl(photoName: string, maxWidth = 400): string {
  if (!photoName) return "";
  return `/api/places/photo?name=${encodeURIComponent(photoName)}&maxWidth=${maxWidth}`;
}
