"use client";

import { useState, useEffect, useCallback } from "react";
import { SHOPS, type Shop } from "@/lib/shops";
import { getCachedPlace, getPhotoUrl, fetchAllShops, type PlaceData } from "@/lib/places";
import * as store from "@/lib/store";

type Tab = "map" | "collection" | "gallery" | "settings";

function StarRating({ rating, count }: { rating: number | null; count: number }) {
  if (!rating) return null;
  const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  return (
    <span className="stars">
      {stars} <span className="text-text-dim text-[10px]">({count})</span>
    </span>
  );
}

function ShopCard({ shop, onClick }: { shop: Shop; onClick: () => void }) {
  const visited = store.isVisited(shop.name);
  const place = getCachedPlace(shop.name);
  const photoUrl = place?.photos?.[0] ? getPhotoUrl(place.photos[0], 300) : "";

  return (
    <button
      onClick={onClick}
      className={`glass-card overflow-hidden text-left transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98] w-full ${
        visited ? "ring-2 ring-choco-milk/40" : ""
      }`}
    >
      {/* Photo */}
      <div className="aspect-[4/3] bg-cream-deep relative overflow-hidden">
        {photoUrl ? (
          <img src={photoUrl} alt={shop.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">🍫</div>
        )}
        {visited && (
          <div className="absolute top-2 right-2 bg-choco-milk text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            ✓ visited
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-choco truncate">{shop.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-text-dim">{shop.prefecture}</span>
          {place && <StarRating rating={place.rating} count={place.ratingCount} />}
        </div>
      </div>
    </button>
  );
}

function ShopModal({ shop, onClose }: { shop: Shop | null; onClose: () => void }) {
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    if (shop) setVisited(store.isVisited(shop.name));
  }, [shop]);

  if (!shop) return null;

  const place = getCachedPlace(shop.name);
  const photoUrl = place?.photos?.[0] ? getPhotoUrl(place.photos[0], 800) : "";

  const handleToggle = () => {
    const v = store.toggleVisit(shop.name);
    setVisited(v);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-choco/20 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-cream rounded-t-3xl p-6 pb-10 shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-cream-deep mx-auto mb-4" />
        <button onClick={onClose} className="absolute top-4 right-4 text-text-dim hover:text-choco text-lg">✕</button>

        {photoUrl && (
          <img src={photoUrl} alt={shop.name} className="w-full rounded-2xl mb-4 shadow-sm" />
        )}

        <h2 className="font-serif text-xl font-semibold text-choco">{shop.name}</h2>
        <p className="text-sm text-text-dim mt-1">{shop.prefecture}</p>

        {place && (
          <div className="mt-3 space-y-2">
            {place.rating && <StarRating rating={place.rating} count={place.ratingCount} />}
            {place.address && <p className="text-xs text-text-dim">{place.address}</p>}
            {place.mapsUrl && (
              <a
                href={place.mapsUrl}
                target="_blank"
                rel="noopener"
                className="inline-block text-xs text-choco-warm bg-cream-deep px-3 py-1.5 rounded-full hover:bg-cream-deep/80 transition"
              >
                📍 Google Maps で開く
              </a>
            )}
          </div>
        )}

        <button
          onClick={handleToggle}
          className={`mt-6 w-full py-3 rounded-2xl font-medium text-sm transition ${
            visited
              ? "bg-choco-milk text-white"
              : "bg-choco text-white hover:bg-choco-warm"
          }`}
        >
          {visited ? "✓ チェックイン済み — 取消す" : "🍫 チェックイン"}
        </button>
      </div>
    </div>
  );
}

function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: "map", label: "Map", icon: "🗺️" },
    { id: "collection", label: "Collection", icon: "⭐" },
    { id: "gallery", label: "Gallery", icon: "📷" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t border-cream-deep/40 safe-area-pb">
      <div className="flex max-w-lg mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex-1 flex flex-col items-center py-2.5 transition text-xs ${
              tab === item.id ? "text-choco font-semibold" : "text-text-dim"
            }`}
          >
            <span className="text-lg mb-0.5">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function SettingsTab() {
  const [fetchProgress, setFetchProgress] = useState("");
  const [fetching, setFetching] = useState(false);

  const handleFetch = async () => {
    setFetching(true);
    setFetchProgress("開始...");
    await fetchAllShops(SHOPS, (done, total) => {
      setFetchProgress(`${done} / ${total} 取得中...`);
    });
    setFetchProgress("✅ 完了！ページをリロードしてください");
    setFetching(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        <h3 className="font-serif text-lg font-semibold text-choco mb-2">Google Places API</h3>
        <p className="text-xs text-text-dim mb-3">
          APIキーは .env.local に設定済みです。「Fetch Photos」で全ショップの写真・評価を取得します。
        </p>
        <button
          onClick={handleFetch}
          disabled={fetching}
          className="w-full py-2.5 rounded-xl bg-choco text-white text-sm font-medium disabled:opacity-50 transition hover:bg-choco-warm"
        >
          {fetching ? "取得中..." : "📸 Fetch Photos"}
        </button>
        {fetchProgress && <p className="text-xs text-text-dim mt-2">{fetchProgress}</p>}
      </div>

      <div className="glass-card p-5">
        <h3 className="font-serif text-lg font-semibold text-choco mb-2">Statistics</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-cream-deep/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-serif font-bold text-choco">{SHOPS.length}</div>
            <div className="text-xs text-text-dim">Shops</div>
          </div>
          <div className="bg-cream-deep/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-serif font-bold text-choco-milk">{store.getVisitedCount()}</div>
            <div className="text-xs text-text-dim">Visited</div>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-serif text-lg font-semibold text-choco mb-2">リセット</h3>
        <button
          onClick={() => { if (confirm("全データをリセットしますか？")) { store.resetAll(); location.reload(); }}}
          className="w-full py-2.5 rounded-xl bg-red-100 text-red-600 text-sm font-medium hover:bg-red-200 transition"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("map");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [filter, setFilter] = useState<"all" | "visited" | "not-visited">("all");
  const [, forceUpdate] = useState(0);

  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const filteredShops = SHOPS.filter((s) => {
    if (filter === "visited") return store.isVisited(s.name);
    if (filter === "not-visited") return !store.isVisited(s.name);
    return true;
  });

  // Group by prefecture
  const grouped = filteredShops.reduce<Record<string, Shop[]>>((acc, s) => {
    (acc[s.prefecture] = acc[s.prefecture] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-lg mx-auto min-h-screen pb-nav">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-lg border-b border-cream-deep/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍫</span>
          <span className="font-serif text-lg font-semibold text-choco tracking-wide">chocotap</span>
        </div>
        <div className="text-sm text-text-dim">
          <span className="font-semibold text-choco-milk">{store.getVisitedCount()}</span>
          <span className="mx-0.5">/</span>
          <span>{SHOPS.length}</span>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        {tab === "map" && (
          <div className="tab-enter space-y-5">
            {/* Hero */}
            <div className="glass-card overflow-hidden">
              <div className="bg-gradient-to-br from-choco to-choco-warm p-6 text-white">
                <h1 className="font-serif text-2xl font-bold tracking-wide">Craft Chocolate Map</h1>
                <p className="text-sm opacity-80 mt-1">日本全国のクラフトチョコを巡ろう</p>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2">
              {(["all", "not-visited", "visited"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                    filter === f
                      ? "bg-choco text-white"
                      : "bg-white/60 text-text-dim hover:bg-cream-deep"
                  }`}
                >
                  {f === "all" ? "All" : f === "visited" ? "行った" : "行きたい"}
                </button>
              ))}
            </div>

            {/* Shop cards by prefecture */}
            {Object.entries(grouped).map(([pref, shops]) => (
              <div key={pref}>
                <h2 className="font-serif text-base font-semibold text-choco mb-2 px-1">{pref}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {shops.map((shop) => (
                    <ShopCard
                      key={shop.name}
                      shop={shop}
                      onClick={() => setSelectedShop(shop)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "collection" && (
          <div className="tab-enter text-center py-12">
            <h2 className="font-serif text-xl font-semibold text-choco mb-2">Collection</h2>
            <p className="text-sm text-text-dim">各地のショップを制覇してバッジを集めよう</p>
            <div className="mt-6 text-5xl opacity-30">🏆</div>
          </div>
        )}

        {tab === "gallery" && (
          <div className="tab-enter text-center py-12">
            <h2 className="font-serif text-xl font-semibold text-choco mb-2">Gallery</h2>
            <p className="text-sm text-text-dim">チェックインして写真を共有しよう</p>
            <div className="mt-6 text-5xl opacity-30">📷</div>
          </div>
        )}

        {tab === "settings" && (
          <div className="tab-enter">
            <h2 className="font-serif text-xl font-semibold text-choco mb-4">Settings</h2>
            <SettingsTab />
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedShop && (
        <ShopModal
          shop={selectedShop}
          onClose={() => { setSelectedShop(null); refresh(); }}
        />
      )}

      {/* Bottom Nav */}
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}
