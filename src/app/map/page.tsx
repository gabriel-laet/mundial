import { getMatches, getTournaments } from "@/lib/data";
import { MapClient } from "./map-client";

export const metadata = {
  title: "Map Explorer - Mundial",
  description: "See where every World Cup match was played on an interactive world map.",
};

export default async function MapPage() {
  const matches = await getMatches();
  const tournaments = await getTournaments();
  const years = tournaments.map((t) => t.year);

  return <MapClient matches={matches} years={years} />;
}
