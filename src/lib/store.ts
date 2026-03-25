"use client";

const STORE_KEY = "chocotap_store_v2";

interface AppState {
  visited: Record<string, boolean>;
  photos: Record<string, string>; // shop name -> dataURL
}

function load(): AppState {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{"visited":{},"photos":{}}');
  } catch {
    return { visited: {}, photos: {} };
  }
}

function save(state: AppState) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function isVisited(name: string): boolean {
  return !!load().visited[name];
}

export function toggleVisit(name: string): boolean {
  const s = load();
  s.visited[name] = !s.visited[name];
  if (!s.visited[name]) delete s.visited[name];
  save(s);
  return !!s.visited[name];
}

export function getVisitedCount(): number {
  return Object.keys(load().visited).length;
}

export function savePhoto(name: string, dataUrl: string) {
  const s = load();
  s.photos[name] = dataUrl;
  save(s);
}

export function getPhoto(name: string): string | null {
  return load().photos[name] || null;
}

export function getAllPhotos(): Record<string, string> {
  return load().photos;
}

export function resetAll() {
  localStorage.removeItem(STORE_KEY);
}
