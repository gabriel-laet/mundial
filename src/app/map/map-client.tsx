"use client";

import dynamic from "next/dynamic";
import type { Match } from "@/lib/data";

const WorldMap = dynamic(
  () => import("@/components/world-map").then((mod) => mod.WorldMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-card">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    ),
  }
);

export function MapClient({
  matches,
  years,
}: {
  matches: Match[];
  years: number[];
}) {
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <WorldMap matches={matches} years={years} />
    </div>
  );
}
