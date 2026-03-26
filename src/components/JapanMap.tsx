"use client";

import { useMemo, useState } from "react";
import { JAPAN_SVG_VIEWBOX, JAPAN_PREF_PATHS } from "@/lib/japanmap-data";
import { SHOPS, type Shop } from "@/lib/shops";
import * as store from "@/lib/store";

interface JapanMapProps {
  onPrefectureClick?: (prefecture: string) => void;
  selectedPrefecture?: string | null;
}

export default function JapanMap({ onPrefectureClick, selectedPrefecture }: JapanMapProps) {
  const [hoveredPref, setHoveredPref] = useState<string | null>(null);

  // Count shops and visited per prefecture
  const prefStats = useMemo(() => {
    const stats: Record<string, { total: number; visited: number }> = {};
    for (const shop of SHOPS) {
      if (!stats[shop.prefecture]) stats[shop.prefecture] = { total: 0, visited: 0 };
      stats[shop.prefecture].total++;
      if (store.isVisited(shop.name)) stats[shop.prefecture].visited++;
    }
    return stats;
  }, []);

  // Determine fill color for each prefecture
  const getFill = (prefName: string) => {
    const stat = prefStats[prefName];
    if (!stat || stat.total === 0) return "#ede5d8"; // cream-deep — no shops
    if (selectedPrefecture === prefName) return "#d4a76a"; // accent — selected
    if (hoveredPref === prefName) return "#b89070"; // choco-light — hover
    if (stat.visited === stat.total) return "#8b6244"; // choco-milk — fully visited
    if (stat.visited > 0) return "#d4a76a"; // accent — partially visited
    return "#f0e4c8"; // honey — has shops, not visited
  };

  const getStroke = (prefName: string) => {
    const stat = prefStats[prefName];
    if (!stat || stat.total === 0) return "#d8d0c4";
    if (selectedPrefecture === prefName) return "#3d2b1f";
    return "#c8bfb0";
  };

  return (
    <div className="glass-card p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif text-base font-semibold text-choco">Japan Map</h2>
        <div className="flex items-center gap-3 text-[10px] text-text-dim">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#f0e4c8" }} />
            ショップあり
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#d4a76a" }} />
            一部訪問
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#8b6244" }} />
            制覇
          </span>
        </div>
      </div>

      <svg
        viewBox={JAPAN_SVG_VIEWBOX}
        className="w-full"
        style={{ maxHeight: "420px" }}
      >
        {Object.entries(JAPAN_PREF_PATHS).map(([name, d]) => (
          <path
            key={name}
            d={d}
            fill={getFill(name)}
            stroke={getStroke(name)}
            strokeWidth="0.8"
            className="transition-colors duration-200 cursor-pointer"
            onMouseEnter={() => setHoveredPref(name)}
            onMouseLeave={() => setHoveredPref(null)}
            onClick={() => onPrefectureClick?.(name)}
          >
            <title>
              {name}
              {prefStats[name]
                ? ` (${prefStats[name].visited}/${prefStats[name].total})`
                : ""}
            </title>
          </path>
        ))}

        {/* Shop dots */}
        {SHOPS.map((shop) => {
          const coord = latLngToSVG(shop.lat, shop.lng);
          const visited = store.isVisited(shop.name);
          return (
            <circle
              key={shop.name}
              cx={coord.x}
              cy={coord.y}
              r="2.5"
              fill={visited ? "#3d2b1f" : "#d4a76a"}
              stroke="#fff"
              strokeWidth="0.8"
              className="transition-colors duration-200"
              opacity={0.85}
            >
              <title>{shop.name}</title>
            </circle>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredPref && prefStats[hoveredPref] && (
        <div className="text-center mt-2 text-xs text-text-dim animate-fade-in">
          <span className="font-medium text-choco">{hoveredPref}</span>
          {" — "}
          {prefStats[hoveredPref].visited}/{prefStats[hoveredPref].total} visited
        </div>
      )}
    </div>
  );
}

// Convert lat/lng to SVG coordinates
function latLngToSVG(lat: number, lng: number) {
  const latMin = 26, latMax = 46, lngMin = 127, lngMax = 146;
  const svgW = 480, svgH = 620;
  return {
    x: ((lng - lngMin) / (lngMax - lngMin)) * svgW,
    y: ((latMax - lat) / (latMax - latMin)) * svgH,
  };
}
