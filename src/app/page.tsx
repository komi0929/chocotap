"use client";

import { useState, useCallback, useEffect } from "react";
import { SHOPS, type Shop } from "@/lib/shops";
import { getCachedPlace, getPhotoUrl, loadPlacesCache } from "@/lib/places";
import * as store from "@/lib/store";
import Splash from "@/components/Splash";
import AuthPrompt from "@/components/AuthPrompt";
import JapanMap from "@/components/JapanMap";
import {
  MapIcon, CollectionIcon, GalleryIcon, SettingsIcon,
  StarIcon, LocationIcon, ExternalLinkIcon, CloseIcon,
  CheckIcon, ChocolateIcon, UserIcon,
} from "@/components/Icons";
import Image from "next/image";

type Tab = "map" | "collection" | "gallery" | "settings";
type Filter = "all" | "not-visited" | "visited";

/* ==================== STAR RATING ==================== */
function Stars({ rating, count }: { rating: number | null; count: number }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} className="w-3 h-3" filled={i <= Math.round(rating)} />
      ))}
      <span className="text-[10px] text-text-dim ml-1">({count})</span>
    </div>
  );
}

/* ==================== SHOP CARD ==================== */
function ShopCard({ shop, onClick }: { shop: Shop; onClick: () => void }) {
  const visited = store.isVisited(shop.name);
  const place = getCachedPlace(shop.name);
  const photoUrl = place?.photos?.[0] ? getPhotoUrl(place.photos[0], 300) : "";

  return (
    <button onClick={onClick} className="glass-card-hover overflow-hidden text-left w-full group">
      {/* Photo area */}
      <div className="aspect-[4/3] bg-cream-deep relative overflow-hidden">
        {photoUrl ? (
          <img src={photoUrl} alt={shop.name} className="photo-card-img" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChocolateIcon className="w-10 h-10 opacity-15" />
          </div>
        )}
        {/* Visited badge */}
        {visited && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-choco-milk/90 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
            <CheckIcon className="w-3 h-3" />
            visited
          </div>
        )}
        {/* Rating overlay */}
        {place?.rating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/85 backdrop-blur-sm text-[10px] text-choco px-2 py-0.5 rounded-full">
            <StarIcon className="w-3 h-3 star-filled" filled />
            {place.rating.toFixed(1)}
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <h3 className="text-[13px] font-medium text-choco truncate leading-tight">{shop.name}</h3>
        <div className="flex items-center gap-1 mt-1.5 text-text-dim">
          <LocationIcon className="w-3 h-3 flex-shrink-0" />
          <span className="text-[11px] truncate">{shop.prefecture}</span>
        </div>
      </div>
    </button>
  );
}

/* ==================== SHOP MODAL ==================== */
function ShopModal({
  shop,
  onClose,
  onCheckin,
}: {
  shop: Shop;
  onClose: () => void;
  onCheckin: (shop: Shop) => void;
}) {
  const visited = store.isVisited(shop.name);
  const place = getCachedPlace(shop.name);
  const photoUrl = place?.photos?.[0] ? getPhotoUrl(place.photos[0], 800) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="modal-backdrop" />
      <div
        className="relative w-full max-w-lg bg-cream rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up z-[51]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + Close */}
        <div className="sticky top-0 z-10 flex items-center justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-cream-deep" />
        </div>
        <button onClick={onClose} className="absolute top-3 right-4 z-20 p-1 text-text-dim hover:text-choco transition">
          <CloseIcon />
        </button>

        <div className="px-5 pb-8">
          {/* Photo */}
          {photoUrl && (
            <div className="rounded-2xl overflow-hidden mb-4 shadow-sm">
              <img src={photoUrl} alt={shop.name} className="w-full object-cover max-h-64" />
            </div>
          )}

          {/* Title */}
          <h2 className="font-serif text-xl font-semibold text-choco leading-tight">{shop.name}</h2>
          <div className="flex items-center gap-1.5 mt-1.5 text-text-dim">
            <LocationIcon className="w-3.5 h-3.5" />
            <span className="text-sm">{shop.prefecture}</span>
          </div>

          {/* Place details */}
          {place && (
            <div className="mt-4 space-y-3">
              {place.rating && <Stars rating={place.rating} count={place.ratingCount} />}
              {place.address && (
                <p className="text-xs text-text-dim leading-relaxed">{place.address}</p>
              )}
              {place.mapsUrl && (
                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-choco-warm bg-cream-deep/60 px-3 py-1.5 rounded-full hover:bg-cream-deep transition"
                >
                  <LocationIcon className="w-3 h-3" />
                  Google Maps で開く
                  <ExternalLinkIcon className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Checkin button */}
          <button
            onClick={() => onCheckin(shop)}
            className={`mt-6 ${visited ? "btn-soft" : "btn-primary"}`}
          >
            {visited ? (
              <span className="flex items-center justify-center gap-1.5">
                <CheckIcon className="w-4 h-4 text-choco-milk" />
                チェックイン済み — 取消す
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <ChocolateIcon className="w-5 h-5" />
                チェックイン
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================== BOTTOM NAV ==================== */
function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "map", label: "Map", Icon: MapIcon },
    { id: "collection", label: "Collection", Icon: CollectionIcon },
    { id: "gallery", label: "Gallery", Icon: GalleryIcon },
    { id: "settings", label: "Settings", Icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 nav-glass">
      <div className="flex max-w-lg mx-auto py-1 safe-area-pb">
        {items.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center py-2 transition-all duration-200 ${
              tab === id ? "text-choco" : "text-text-dim"
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 transition-transform ${tab === id ? "scale-110" : ""}`} />
            <span className={`text-[10px] ${tab === id ? "font-semibold" : ""}`}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ==================== SETTINGS TAB ==================== */
function SettingsTab() {
  return (
    <div className="space-y-4 animate-fade-up">
      {/* Profile section */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-cream-deep flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-text-dim" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-choco">ゲストユーザー</p>
            <p className="text-xs text-text-dim">ログインすると記録がクラウドに保存されます</p>
          </div>
        </div>
        <button className="btn-primary mt-4 text-sm">
          ログイン / アカウント作成
        </button>
      </div>

      {/* Stats */}
      <div className="glass-card p-5">
        <h3 className="font-serif text-base font-semibold text-choco mb-3">Statistics</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-cream-deep/40 rounded-xl p-3 text-center">
            <div className="text-xl font-serif font-bold text-choco">{SHOPS.length}</div>
            <div className="text-[10px] text-text-dim mt-0.5">Shops</div>
          </div>
          <div className="bg-cream-deep/40 rounded-xl p-3 text-center">
            <div className="text-xl font-serif font-bold text-choco-milk">{store.getVisitedCount()}</div>
            <div className="text-[10px] text-text-dim mt-0.5">Visited</div>
          </div>
          <div className="bg-cream-deep/40 rounded-xl p-3 text-center">
            <div className="text-xl font-serif font-bold text-accent">
              {SHOPS.length > 0 ? Math.round((store.getVisitedCount() / SHOPS.length) * 100) : 0}%
            </div>
            <div className="text-[10px] text-text-dim mt-0.5">Progress</div>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="glass-card p-5">
        <button
          onClick={() => {
            if (confirm("チェックイン記録をリセットしますか？")) {
              store.resetAll();
              location.reload();
            }
          }}
          className="w-full py-2.5 rounded-xl text-sm text-red-400 hover:text-red-500 hover:bg-red-50 transition"
        >
          チェックイン記録をリセット
        </button>
      </div>
    </div>
  );
}

/* ==================== MAIN PAGE ==================== */
export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState<Tab>("map");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [showAuth, setShowAuth] = useState(false);
  const [pendingCheckin, setPendingCheckin] = useState<Shop | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  // Load static places cache on mount
  useEffect(() => {
    loadPlacesCache().then(() => refresh());
  }, [refresh]);

  const handleCheckin = (shop: Shop) => {
    const isLoggedIn = false; // TODO: integrate Supabase auth
    const isGuest = store.getVisitedCount() > 0; // has used guest mode before

    if (!isLoggedIn && !isGuest && !store.isVisited(shop.name)) {
      setPendingCheckin(shop);
      setShowAuth(true);
      return;
    }

    store.toggleVisit(shop.name);
    refresh();
  };

  const handleGuestContinue = () => {
    setShowAuth(false);
    if (pendingCheckin) {
      store.toggleVisit(pendingCheckin.name);
      setPendingCheckin(null);
      refresh();
    }
  };

  const filteredShops = SHOPS.filter((s) => {
    if (selectedPrefecture && s.prefecture !== selectedPrefecture) return false;
    if (filter === "visited") return store.isVisited(s.name);
    if (filter === "not-visited") return !store.isVisited(s.name);
    return true;
  });

  // Group by prefecture
  const grouped = filteredShops.reduce<Record<string, Shop[]>>((acc, s) => {
    (acc[s.prefecture] = acc[s.prefecture] || []).push(s);
    return acc;
  }, {});

  if (showSplash) {
    return <Splash onDone={() => setShowSplash(false)} />;
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen pb-nav animate-fade-in">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-30 nav-glass px-4 py-3 flex items-center justify-between border-b border-white/30">
        <div className="flex items-center gap-2">
          <ChocolateIcon className="w-6 h-6" />
          <span className="font-serif text-lg font-semibold text-choco tracking-wide">chocotap</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="font-semibold text-choco-milk">{store.getVisitedCount()}</span>
          <span className="text-text-dim">/</span>
          <span className="text-text-dim">{SHOPS.length}</span>
        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <main className="px-4 py-4">
        {/* ===== MAP TAB ===== */}
        {tab === "map" && (
          <div className="animate-fade-up space-y-5">
            {/* Hero */}
            <div className="glass-card overflow-hidden relative">
              <Image
                src="/hero.png"
                alt="Craft Chocolate Map"
                width={600}
                height={200}
                className="w-full h-40 object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-choco/70 via-choco/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h1 className="font-serif text-2xl font-bold text-white tracking-wide drop-shadow-lg">
                  Craft Chocolate Map
                </h1>
                <p className="text-sm text-white/80 mt-0.5">
                  日本全国のクラフトチョコを巡ろう
                </p>
              </div>
            </div>

            {/* Japan Map */}
            <JapanMap
              selectedPrefecture={selectedPrefecture}
              onPrefectureClick={(pref) => {
                setSelectedPrefecture(selectedPrefecture === pref ? null : pref);
              }}
            />

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              {([
                { id: "all" as Filter, label: `All (${SHOPS.length})` },
                { id: "not-visited" as Filter, label: "行きたい" },
                { id: "visited" as Filter, label: `行った (${store.getVisitedCount()})` },
              ]).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={filter === id ? "pill-active" : "pill-inactive"}
                >
                  {label}
                </button>
              ))}
              {selectedPrefecture && (
                <button
                  onClick={() => setSelectedPrefecture(null)}
                  className="pill-active flex items-center gap-1"
                >
                  {selectedPrefecture} ✕
                </button>
              )}
            </div>

            {/* Shop grid by prefecture */}
            {Object.entries(grouped).map(([pref, shops], idx) => (
              <div key={pref} className="animate-fade-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex items-center gap-2 mb-2.5 px-1">
                  <LocationIcon className="w-3.5 h-3.5 text-choco-milk" />
                  <h2 className="font-serif text-sm font-semibold text-choco">{pref}</h2>
                  <span className="text-[10px] text-text-dim">({shops.length})</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {shops.map((shop) => (
                    <ShopCard key={shop.name} shop={shop} onClick={() => setSelectedShop(shop)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== COLLECTION TAB ===== */}
        {tab === "collection" && (
          <div className="animate-fade-up text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-deep/50 flex items-center justify-center">
              <CollectionIcon className="w-8 h-8 text-text-dim" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-choco mb-1.5">Collection</h2>
            <p className="text-sm text-text-dim">各地のショップを制覇してバッジを集めよう</p>
            <Image src="/regional_badges.png" alt="badges" width={300} height={200} className="mx-auto mt-6 rounded-2xl opacity-80" />
          </div>
        )}

        {/* ===== GALLERY TAB ===== */}
        {tab === "gallery" && (
          <div className="animate-fade-up text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-deep/50 flex items-center justify-center">
              <GalleryIcon className="w-8 h-8 text-text-dim" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-choco mb-1.5">Gallery</h2>
            <p className="text-sm text-text-dim">チェックインして写真を共有しよう</p>
            <Image src="/stamps_and_pins.png" alt="stamps" width={300} height={200} className="mx-auto mt-6 rounded-2xl opacity-80" />
          </div>
        )}

        {/* ===== SETTINGS TAB ===== */}
        {tab === "settings" && (
          <div className="animate-fade-up">
            <h2 className="font-serif text-xl font-semibold text-choco mb-4">Settings</h2>
            <SettingsTab />
          </div>
        )}
      </main>

      {/* ===== MODAL ===== */}
      {selectedShop && (
        <ShopModal
          shop={selectedShop}
          onClose={() => { setSelectedShop(null); refresh(); }}
          onCheckin={handleCheckin}
        />
      )}

      {/* ===== AUTH PROMPT ===== */}
      {showAuth && (
        <AuthPrompt
          onClose={() => { setShowAuth(false); setPendingCheckin(null); }}
          onContinueAsGuest={handleGuestContinue}
        />
      )}

      {/* ===== BOTTOM NAV ===== */}
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}
