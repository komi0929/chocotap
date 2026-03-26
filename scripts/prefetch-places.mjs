// Pre-fetch script: Run this to generate public/places-cache.json
// Usage: GOOGLE_PLACES_API_KEY=xxx node scripts/prefetch-places.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error("❌ Set GOOGLE_PLACES_API_KEY environment variable");
  process.exit(1);
}

// Import shop data
const shopsFile = fs.readFileSync(
  path.join(__dirname, "../src/lib/shops.ts"),
  "utf-8"
);

// Parse shop names and prefectures from TypeScript source
const shopRegex = /\{\s*name:\s*"([^"]+)",\s*lat:\s*[\d.]+,\s*lng:\s*[\d.]+,\s*prefecture:\s*"([^"]+)"\s*\}/g;
const shops = [];
let match;
while ((match = shopRegex.exec(shopsFile)) !== null) {
  shops.push({ name: match[1], prefecture: match[2] });
}

console.log(`Found ${shops.length} shops. Starting fetch...`);

// Load existing cache
const cacheFile = path.join(__dirname, "../public/places-cache.json");
let cache = {};
try {
  cache = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
} catch {
  /* first run */
}

async function searchPlace(shopName, prefecture) {
  const query = `${shopName} ${prefecture} チョコレート`;
  try {
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
      console.warn(`  ⚠ API error for "${shopName}": ${res.status}`);
      return null;
    }

    const json = await res.json();
    const place = json.places?.[0];
    if (!place) return null;

    return {
      placeId: place.id,
      name: place.displayName?.text || shopName,
      rating: place.rating ?? null,
      ratingCount: place.userRatingCount ?? 0,
      address: place.formattedAddress || "",
      mapsUrl: place.googleMapsUri || "",
      photos: (place.photos || []).slice(0, 3).map((p) => p.name),
    };
  } catch (err) {
    console.warn(`  ⚠ Fetch error for "${shopName}":`, err.message);
    return null;
  }
}

let fetched = 0;
let skipped = 0;

for (const shop of shops) {
  // Skip if already cached
  if (cache[shop.name]) {
    skipped++;
    process.stdout.write(`\r  ${skipped + fetched}/${shops.length} (${skipped} cached)`);
    continue;
  }

  const result = await searchPlace(shop.name, shop.prefecture);
  if (result) {
    cache[shop.name] = result;
  }
  fetched++;
  process.stdout.write(`\r  ${skipped + fetched}/${shops.length} (${fetched} fetched, ${skipped} cached)`);

  // Rate limit
  await new Promise((r) => setTimeout(r, 300));
}

// Save to public/
fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
console.log(`\n✅ Done! Saved ${Object.keys(cache).length} places to public/places-cache.json`);
