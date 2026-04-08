"use client";

import { useEffect, useRef, useState } from "react";
import type { Match } from "@/lib/data";

interface WorldMapProps {
  matches: Match[];
  years: number[];
}

interface L {
  map: any;
  tileLayer: any;
  circleMarker: any;
  popup: any;
}

const TOURNAMENT_COLORS: Record<string, string> = {};
const COLOR_PALETTE = [
  "#22c55e", "#eab308", "#3b82f6", "#ef4444", "#a855f7",
  "#f97316", "#06b6d4", "#ec4899", "#84cc16", "#6366f1",
  "#14b8a6", "#f59e0b", "#8b5cf6", "#10b981", "#f43f5e",
  "#0ea5e9", "#d946ef", "#78716c", "#64748b", "#fb923c",
  "#2dd4bf", "#a3e635",
];

export function WorldMap({ matches, years }: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [leaflet, setLeaflet] = useState<L | null>(null);

  // Assign colors to years
  years.forEach((y, i) => {
    TOURNAMENT_COLORS[y] = COLOR_PALETTE[i % COLOR_PALETTE.length];
  });

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = await import("leaflet");
      if (cancelled) return;
      setLeaflet(L as any);

      if (!mapRef.current || mapInstance.current) return;

      const map = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 15,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      mapInstance.current = map;
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Update markers when year filter changes
  useEffect(() => {
    if (!mapInstance.current || !leaflet) return;
    const L = leaflet;
    const map = mapInstance.current;

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    const filtered =
      selectedYear === "all"
        ? matches
        : matches.filter((m) => m.year === selectedYear);

    // Group matches by location to avoid overlapping markers
    const grouped: Record<string, Match[]> = {};
    for (const m of filtered) {
      if (m.lat == null || m.lng == null) continue;
      const key = `${m.lat.toFixed(2)},${m.lng.toFixed(2)}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(m);
    }

    for (const [, group] of Object.entries(grouped)) {
      const first = group[0];
      const color =
        selectedYear === "all"
          ? TOURNAMENT_COLORS[first.year] || "#22c55e"
          : "#22c55e";

      const radius = Math.min(4 + Math.log2(group.length + 1) * 3, 14);

      const marker = L.circleMarker([first.lat!, first.lng!], {
        radius,
        fillColor: color,
        color: "rgba(255,255,255,0.3)",
        weight: 1,
        fillOpacity: 0.75,
      }).addTo(map);

      const matchList = group
        .slice(0, 8)
        .map(
          (m) =>
            `<div class="mb-1"><strong>${m.homeTeam.name} ${m.homeTeam.score} - ${m.awayTeam.score} ${m.awayTeam.name}</strong><br/><span style="color:#999">${m.stageName} &middot; ${m.year}</span></div>`
        )
        .join("");
      const more = group.length > 8 ? `<div style="color:#999">+${group.length - 8} more matches</div>` : "";

      marker.bindPopup(
        `<div style="max-width:250px;max-height:200px;overflow-y:auto;font-size:12px">
          <div style="font-weight:600;margin-bottom:6px;color:#22c55e">${first.city}, ${first.country}</div>
          <div style="color:#999;margin-bottom:6px">${first.stadium} &middot; ${group.length} match${group.length > 1 ? "es" : ""}</div>
          ${matchList}${more}
        </div>`,
        { maxWidth: 280 }
      );

      markersRef.current.push(marker);
    }
  }, [selectedYear, matches, leaflet]);

  return (
    <div className="relative h-full w-full">
      {/* Year filter */}
      <div className="absolute top-4 right-4 z-[1000] bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg p-3 max-h-[80vh] overflow-y-auto">
        <div className="text-xs font-medium text-muted-foreground mb-2">
          Filter by Year
        </div>
        <button
          onClick={() => setSelectedYear("all")}
          className={`block w-full text-left px-2 py-1 rounded text-sm ${
            selectedYear === "all"
              ? "bg-primary/20 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Years
        </button>
        {[...years].reverse().map((y) => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded text-sm ${
              selectedYear === y
                ? "bg-primary/20 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: TOURNAMENT_COLORS[y] }}
            />
            {y}
          </button>
        ))}
      </div>
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
