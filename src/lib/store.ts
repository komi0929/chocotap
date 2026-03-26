"use client";

const STORE_KEY = "chocotap_store_v3";

/* ========================================
   Data Model — Supabase-ready structure
   ======================================== */

export interface CheckinPhoto {
  id: string;          // uuid
  dataUrl: string;     // base64 data URL (localStorage) / storage URL (Supabase)
  caption?: string;
  createdAt: string;   // ISO timestamp
}

export interface Checkin {
  id: string;          // uuid
  shopName: string;
  prefecture: string;
  photos: CheckinPhoto[];
  memo?: string;
  createdAt: string;   // ISO timestamp
}

interface AppState {
  checkins: Record<string, Checkin>; // key: shopName
}

/* ========== Migrate from v2 ========== */
function migrateFromV2(): AppState | null {
  try {
    const raw = localStorage.getItem("chocotap_store_v2");
    if (!raw) return null;
    const v2 = JSON.parse(raw);
    const state: AppState = { checkins: {} };
    if (v2.visited) {
      for (const name of Object.keys(v2.visited)) {
        if (v2.visited[name]) {
          const photo = v2.photos?.[name];
          state.checkins[name] = {
            id: crypto.randomUUID(),
            shopName: name,
            prefecture: "",
            photos: photo
              ? [{ id: crypto.randomUUID(), dataUrl: photo, createdAt: new Date().toISOString() }]
              : [],
            createdAt: new Date().toISOString(),
          };
        }
      }
    }
    return state;
  } catch {
    return null;
  }
}

/* ========== Core IO ========== */
function load(): AppState {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
    // Try migration from v2
    const migrated = migrateFromV2();
    if (migrated) {
      save(migrated);
      return migrated;
    }
    return { checkins: {} };
  } catch {
    return { checkins: {} };
  }
}

function save(state: AppState) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

/* ========== Checkin Operations ========== */

export function isVisited(name: string): boolean {
  return !!load().checkins[name];
}

export function getCheckin(name: string): Checkin | null {
  return load().checkins[name] || null;
}

export function getAllCheckins(): Checkin[] {
  const s = load();
  return Object.values(s.checkins).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getVisitedCount(): number {
  return Object.keys(load().checkins).length;
}

/** Create or toggle a checkin */
export function toggleVisit(name: string, prefecture?: string): boolean {
  const s = load();
  if (s.checkins[name]) {
    delete s.checkins[name];
    save(s);
    return false;
  } else {
    s.checkins[name] = {
      id: crypto.randomUUID(),
      shopName: name,
      prefecture: prefecture || "",
      photos: [],
      createdAt: new Date().toISOString(),
    };
    save(s);
    return true;
  }
}

/** Add a photo to a checkin */
export function addPhoto(
  shopName: string,
  dataUrl: string,
  caption?: string
): CheckinPhoto | null {
  const s = load();
  const checkin = s.checkins[shopName];
  if (!checkin) return null;

  const photo: CheckinPhoto = {
    id: crypto.randomUUID(),
    dataUrl,
    caption,
    createdAt: new Date().toISOString(),
  };
  checkin.photos.push(photo);
  save(s);
  return photo;
}

/** Remove a photo from a checkin */
export function removePhoto(shopName: string, photoId: string) {
  const s = load();
  const checkin = s.checkins[shopName];
  if (!checkin) return;
  checkin.photos = checkin.photos.filter((p) => p.id !== photoId);
  save(s);
}

/** Update checkin memo */
export function updateMemo(shopName: string, memo: string) {
  const s = load();
  const checkin = s.checkins[shopName];
  if (!checkin) return;
  checkin.memo = memo;
  save(s);
}

/** Get all user photos across all checkins (for Gallery) */
export function getAllPhotos(): { photo: CheckinPhoto; shopName: string; prefecture: string }[] {
  const s = load();
  const all: { photo: CheckinPhoto; shopName: string; prefecture: string }[] = [];
  for (const checkin of Object.values(s.checkins)) {
    for (const photo of checkin.photos) {
      all.push({ photo, shopName: checkin.shopName, prefecture: checkin.prefecture });
    }
  }
  return all.sort((a, b) => new Date(b.photo.createdAt).getTime() - new Date(a.photo.createdAt).getTime());
}

export function resetAll() {
  localStorage.removeItem(STORE_KEY);
  localStorage.removeItem("chocotap_store_v2");
}
