"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
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
  SearchIcon, SortIcon, ShopListIcon,
} from "@/components/Icons";
import Image from "next/image";

type Tab = "map" | "shops" | "collection" | "gallery" | "settings";
type Filter = "all" | "not-visited" | "visited";
type SortBy = "name" | "rating" | "prefecture";

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

/* ==================== SHOPS TAB ==================== */
function ShopsTab({ onShopClick }: { onShopClick: (shop: Shop) => void }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("prefecture");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [prefFilter, setPrefFilter] = useState<string | null>(null);
  const [visitFilter, setVisitFilter] = useState<Filter>("all");

  // Get unique prefectures
  const prefectures = useMemo(() => {
    const set = new Set(SHOPS.map((s) => s.prefecture));
    return Array.from(set).sort();
  }, []);

  // Filter and sort shops
  const results = useMemo(() => {
    let list = [...SHOPS];

    // Text search
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.prefecture.includes(q)
      );
    }

    // Prefecture filter
    if (prefFilter) {
      list = list.filter((s) => s.prefecture === prefFilter);
    }

    // Visit filter
    if (visitFilter === "visited") list = list.filter((s) => store.isVisited(s.name));
    if (visitFilter === "not-visited") list = list.filter((s) => !store.isVisited(s.name));

    // Sort
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "rating") {
      list.sort((a, b) => {
        const ra = getCachedPlace(a.name)?.rating ?? 0;
        const rb = getCachedPlace(b.name)?.rating ?? 0;
        return rb - ra;
      });
    } else {
      // prefecture (default)
      list.sort((a, b) => a.prefecture.localeCompare(b.prefecture) || a.name.localeCompare(b.name));
    }

    return list;
  }, [query, prefFilter, visitFilter, sortBy]);

  const sortLabels: Record<SortBy, string> = {
    name: "名前順",
    rating: "評価順",
    prefecture: "都道府県順",
  };

  return (
    <div className="animate-fade-up space-y-3">
      {/* Search bar */}
      <div className="glass-card flex items-center gap-2 px-3 py-2.5">
        <SearchIcon className="w-4 h-4 text-text-dim flex-shrink-0" />
        <input
          type="text"
          placeholder="ショップ名・都道府県で検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-choco placeholder:text-text-dim/60 outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-text-dim hover:text-choco">
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2">
        {/* Visit filter pills */}
        {([
          { id: "all" as Filter, label: `全て (${SHOPS.length})` },
          { id: "visited" as Filter, label: `行った (${store.getVisitedCount()})` },
          { id: "not-visited" as Filter, label: "未訪問" },
        ]).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setVisitFilter(id)}
            className={visitFilter === id ? "pill-active" : "pill-inactive"}
          >
            {label}
          </button>
        ))}

        {/* Sort button */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="pill-inactive flex items-center gap-1"
          >
            <SortIcon className="w-3.5 h-3.5" />
            {sortLabels[sortBy]}
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-1 glass-card py-1 min-w-[120px] shadow-lg z-20 animate-fade-in">
              {(["prefecture", "name", "rating"] as SortBy[]).map((s) => (
                <button
                  key={s}
                  onClick={() => { setSortBy(s); setShowSortMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs transition ${
                    sortBy === s ? "text-choco font-semibold bg-cream-deep/30" : "text-text-dim hover:text-choco hover:bg-cream-deep/20"
                  }`}
                >
                  {sortLabels[s]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prefecture filter (horizontal scroll) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          onClick={() => setPrefFilter(null)}
          className={!prefFilter ? "pill-active text-[10px]" : "pill-inactive text-[10px]"}
        >
          全地域
        </button>
        {prefectures.map((p) => (
          <button
            key={p}
            onClick={() => setPrefFilter(prefFilter === p ? null : p)}
            className={prefFilter === p ? "pill-active text-[10px] whitespace-nowrap" : "pill-inactive text-[10px] whitespace-nowrap"}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-[11px] text-text-dim px-1">
        {results.length} 件表示
        {prefFilter && <span> — {prefFilter}</span>}
      </p>

      {/* Shop list */}
      <div className="space-y-2">
        {results.map((shop) => {
          const visited = store.isVisited(shop.name);
          const place = getCachedPlace(shop.name);
          const photoUrl = place?.photos?.[0] ? getPhotoUrl(place.photos[0], 200) : "";

          return (
            <button
              key={shop.name}
              onClick={() => onShopClick(shop)}
              className="glass-card-hover w-full flex items-center gap-3 p-2.5 text-left"
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-deep flex-shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt={shop.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ChocolateIcon className="w-6 h-6 opacity-15" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-medium text-choco truncate">{shop.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <LocationIcon className="w-3 h-3 text-text-dim flex-shrink-0" />
                  <span className="text-[11px] text-text-dim">{shop.prefecture}</span>
                </div>
                {place?.rating && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <StarIcon className="w-3 h-3 star-filled" filled />
                    <span className="text-[10px] text-text-dim">
                      {place.rating.toFixed(1)} ({place.ratingCount})
                    </span>
                  </div>
                )}
              </div>

              {/* Visit badge */}
              {visited && (
                <div className="flex-shrink-0">
                  <CheckIcon className="w-5 h-5 text-choco-milk" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12">
          <ChocolateIcon className="w-10 h-10 mx-auto opacity-20 mb-3" />
          <p className="text-sm text-text-dim">該当するショップが見つかりません</p>
        </div>
      )}
    </div>
  );
}

/* ==================== BOTTOM NAV ==================== */
function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "map", label: "Map", Icon: MapIcon },
    { id: "shops", label: "Shops", Icon: ShopListIcon },
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
      setSelectedShop(null); // close shop modal first
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

        {/* ===== SHOPS TAB ===== */}
        {tab === "shops" && (
          <div className="animate-fade-up">
            <h2 className="font-serif text-xl font-semibold text-choco mb-4">Shops</h2>
            <ShopsTab onShopClick={(shop) => setSelectedShop(shop)} />
          </div>
        )}

        {/* ===== COLLECTION TAB ===== */}
        {tab === "collection" && (
          <div className="animate-fade-up space-y-5">
            <div>
              <h2 className="font-serif text-xl font-semibold text-choco mb-1">Collection</h2>
              <p className="text-xs text-text-dim">各地のショップを制覇してバッジを集めよう</p>
            </div>

            {/* Overall progress */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-dim">全国制覇</span>
                <span className="text-xs font-semibold text-choco">
                  {store.getVisitedCount()} / {SHOPS.length}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-cream-deep overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-choco-milk to-accent transition-all duration-500"
                  style={{ width: `${SHOPS.length > 0 ? (store.getVisitedCount() / SHOPS.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Region badges grid */}
            <div className="grid grid-cols-3 gap-3">
              {(() => {
                const regions: Record<string, string[]> = {};
                SHOPS.forEach((s) => {
                  if (!regions[s.prefecture]) regions[s.prefecture] = [];
                  regions[s.prefecture].push(s.name);
                });
                return Object.entries(regions)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([pref, names]) => {
                    const visited = names.filter((n) => store.isVisited(n)).length;
                    const total = names.length;
                    const complete = visited === total;
                    const percent = total > 0 ? (visited / total) * 100 : 0;

                    return (
                      <div
                        key={pref}
                        className={`glass-card p-3 text-center transition-all duration-300 ${
                          complete ? "ring-2 ring-accent/50" : ""
                        }`}
                      >
                        {/* Badge circle */}
                        <div className="relative w-12 h-12 mx-auto mb-2">
                          <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                            <circle
                              cx="18" cy="18" r="15.5"
                              fill="none" stroke="#ede5d8" strokeWidth="3"
                            />
                            <circle
                              cx="18" cy="18" r="15.5"
                              fill="none"
                              stroke={complete ? "#d4a76a" : "#8b6244"}
                              strokeWidth="3"
                              strokeDasharray={`${percent * 0.975} 100`}
                              strokeLinecap="round"
                              className="transition-all duration-700"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            {complete ? (
                              <CheckIcon className="w-5 h-5 text-accent" />
                            ) : (
                              <span className="text-[10px] font-bold text-choco">
                                {visited}/{total}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] font-medium text-choco leading-tight">{pref}</p>
                        {complete && (
                          <p className="text-[9px] text-accent font-semibold mt-0.5">COMPLETE</p>
                        )}
                      </div>
                    );
                  });
              })()}
            </div>
          </div>
        )}

        {/* ===== GALLERY TAB ===== */}
        {tab === "gallery" && (
          <div className="animate-fade-up space-y-4">
            <div>
              <h2 className="font-serif text-xl font-semibold text-choco mb-1">Gallery</h2>
              <p className="text-xs text-text-dim">全国のクラフトチョコショップ</p>
            </div>

            {/* Photo grid from places cache */}
            <div className="grid grid-cols-3 gap-1.5">
              {SHOPS.map((shop) => {
                const place = getCachedPlace(shop.name);
                const photoUrl = place?.photos?.[0] ? getPhotoUrl(place.photos[0], 200) : "";
                if (!photoUrl) return null;

                return (
                  <button
                    key={shop.name}
                    onClick={() => setSelectedShop(shop)}
                    className="relative aspect-square rounded-xl overflow-hidden group"
                  >
                    <img
                      src={photoUrl}
                      alt={shop.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-choco/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-[9px] text-white font-medium truncate">{shop.name}</p>
                    </div>
                    {store.isVisited(shop.name) && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-choco-milk/90 flex items-center justify-center">
                        <CheckIcon className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
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
