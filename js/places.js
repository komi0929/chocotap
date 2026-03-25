/* ============================================ */
/*   chocotap — Google Places API Integration   */
/*   Fetches shop photos, ratings, open hours   */
/* ============================================ */

const PlacesService = (() => {
  'use strict';

  const CACHE_KEY = 'chocotap_places_cache';
  const API_KEY_KEY = 'chocotap_gmap_api_key';
  let cache = {};

  function getApiKey() {
    return localStorage.getItem(API_KEY_KEY) || '';
  }

  function setApiKey(key) {
    localStorage.setItem(API_KEY_KEY, key.trim());
  }

  function loadCache() {
    try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch(e) { cache = {}; }
  }

  function saveCache() {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }

  // Search for a place by shop name + prefecture
  async function searchPlace(shopName, prefecture) {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    // Check cache first
    const cacheKey = shopName;
    if (cache[cacheKey] && cache[cacheKey].ts > Date.now() - 7 * 24 * 60 * 60 * 1000) {
      return cache[cacheKey].data;
    }

    try {
      const query = `${shopName} ${prefecture || ''} チョコレート`;
      const res = await fetch(
        `https://places.googleapis.com/v1/places:searchText`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.photos,places.rating,places.userRatingCount,places.currentOpeningHours,places.formattedAddress,places.googleMapsUri'
          },
          body: JSON.stringify({
            textQuery: query,
            languageCode: 'ja',
            maxResultCount: 1
          })
        }
      );

      if (!res.ok) {
        console.warn(`Places API error for "${shopName}":`, res.status);
        return null;
      }

      const json = await res.json();
      const place = json.places?.[0];
      if (!place) return null;

      const result = {
        placeId: place.id,
        name: place.displayName?.text || shopName,
        rating: place.rating || null,
        ratingCount: place.userRatingCount || 0,
        address: place.formattedAddress || '',
        mapsUrl: place.googleMapsUri || '',
        isOpen: place.currentOpeningHours?.openNow ?? null,
        photos: (place.photos || []).slice(0, 3).map(p => p.name),
      };

      // Cache result
      cache[cacheKey] = { data: result, ts: Date.now() };
      saveCache();

      return result;
    } catch (err) {
      console.warn(`Places API fetch error for "${shopName}":`, err);
      return null;
    }
  }

  // Get photo URL from photo resource name
  function getPhotoUrl(photoName, maxWidth = 400) {
    const apiKey = getApiKey();
    if (!apiKey || !photoName) return '';
    return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${apiKey}`;
  }

  // Fetch all shops (with rate limiting)
  async function fetchAllShops(shopList, onProgress) {
    const apiKey = getApiKey();
    if (!apiKey) return;

    loadCache();
    let fetched = 0;

    for (let i = 0; i < shopList.length; i++) {
      const shop = shopList[i];
      const cacheKey = shop.name;

      // Skip already cached
      if (cache[cacheKey] && cache[cacheKey].ts > Date.now() - 7 * 24 * 60 * 60 * 1000) {
        fetched++;
        if (onProgress) onProgress(fetched, shopList.length, shop.name, true);
        continue;
      }

      await searchPlace(shop.name, shop.prefecture);
      fetched++;
      if (onProgress) onProgress(fetched, shopList.length, shop.name, false);

      // Rate limit: 300ms between requests
      if (i < shopList.length - 1) {
        await new Promise(r => setTimeout(r, 300));
      }
    }
  }

  // Get cached data for a shop
  function getCachedPlace(shopName) {
    loadCache();
    const c = cache[shopName];
    if (c && c.ts > Date.now() - 7 * 24 * 60 * 60 * 1000) return c.data;
    return null;
  }

  // Clear cache
  function clearCache() {
    cache = {};
    localStorage.removeItem(CACHE_KEY);
  }

  // Init
  loadCache();

  return {
    getApiKey,
    setApiKey,
    searchPlace,
    getPhotoUrl,
    fetchAllShops,
    getCachedPlace,
    clearCache,
  };
})();
