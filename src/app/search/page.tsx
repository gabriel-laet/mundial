import { Suspense } from "react";
import { getTeams, getMatches, getGoals, getTournaments } from "@/lib/data";
import { SearchClient } from "./search-client";

export const metadata = {
  title: "Search & Compare - Mundial",
  description: "Search for teams, players, and matches across World Cup history.",
};

export default async function SearchPage() {
  const teams = await getTeams();
  const matches = await getMatches();
  const goals = await getGoals();
  const tournaments = await getTournaments();

  // Build player stats from goals
  const playerMap: Record<
    string,
    { name: string; goals: number; teams: Set<string>; tournaments: Set<number> }
  > = {};
  for (const g of goals) {
    if (g.ownGoal) continue;
    if (!playerMap[g.playerName]) {
      playerMap[g.playerName] = {
        name: g.playerName,
        goals: 0,
        teams: new Set(),
        tournaments: new Set(),
      };
    }
    playerMap[g.playerName].goals++;
    playerMap[g.playerName].teams.add(g.teamName);
    playerMap[g.playerName].tournaments.add(g.year);
  }
  const players = Object.values(playerMap)
    .map((p) => ({
      name: p.name,
      goals: p.goals,
      teams: [...p.teams],
      tournaments: p.tournaments.size,
    }))
    .sort((a, b) => b.goals - a.goals);

  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading...</div>}>
      <SearchClient
        teams={teams}
        matches={matches}
        players={players}
        tournaments={tournaments}
      />
    </Suspense>
  );
}
