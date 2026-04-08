"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Team, Match, Tournament } from "@/lib/data";

interface Player {
  name: string;
  goals: number;
  teams: string[];
  tournaments: number;
}

interface Props {
  teams: Team[];
  matches: Match[];
  players: Player[];
  tournaments: Tournament[];
}

export function SearchClient({ teams, matches, players, tournaments }: Props) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [tab, setTab] = useState<"teams" | "players" | "matches">("teams");

  // Initialize Fuse search indices
  const fuseTeams = useMemo(
    () => new Fuse(teams, { keys: ["name", "code"], threshold: 0.3 }),
    [teams]
  );
  const fusePlayers = useMemo(
    () => new Fuse(players, { keys: ["name"], threshold: 0.3 }),
    [players]
  );
  const fuseMatches = useMemo(
    () =>
      new Fuse(matches, {
        keys: ["homeTeam.name", "awayTeam.name", "matchName", "city", "stadium"],
        threshold: 0.3,
      }),
    [matches]
  );

  // Search results
  const teamResults = useMemo(() => {
    if (!query.trim()) return teams.slice(0, 20);
    return fuseTeams.search(query).map((r) => r.item);
  }, [query, fuseTeams, teams]);

  const playerResults = useMemo(() => {
    if (!query.trim()) return players.slice(0, 30);
    return fusePlayers.search(query).map((r) => r.item);
  }, [query, fusePlayers, players]);

  const matchResults = useMemo(() => {
    if (!query.trim()) return [];
    return fuseMatches
      .search(query)
      .map((r) => r.item)
      .slice(0, 50);
  }, [query, fuseMatches, matches]);

  // Head-to-head comparison
  const [compareTeams, setCompareTeams] = useState<[string | null, string | null]>([null, null]);

  const h2hData = useMemo(() => {
    const [t1, t2] = compareTeams;
    if (!t1 || !t2) return null;

    const h2hMatches = matches.filter(
      (m) =>
        (m.homeTeam.name === t1 && m.awayTeam.name === t2) ||
        (m.homeTeam.name === t2 && m.awayTeam.name === t1)
    );

    let t1Wins = 0,
      t2Wins = 0,
      draws = 0;
    for (const m of h2hMatches) {
      if (m.result === "draw") draws++;
      else if (
        (m.homeTeam.name === t1 && m.result === "home team win") ||
        (m.awayTeam.name === t1 && m.result === "away team win")
      )
        t1Wins++;
      else t2Wins++;
    }

    return { matches: h2hMatches, t1Wins, t2Wins, draws };
  }, [compareTeams, matches]);

  // Set initial query from URL
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search & Compare</h1>
      <p className="text-muted-foreground mb-6">
        Find teams, players, and matches across World Cup history.
      </p>

      <Input
        type="search"
        placeholder="Search teams, players, matches, cities..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-lg mb-6 text-base h-12"
        autoFocus
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border/50">
        {(["teams", "players", "matches"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px capitalize ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Teams Tab */}
      {tab === "teams" && (
        <div>
          {/* Compare selector */}
          <div className="rounded-xl border border-border/50 bg-card p-4 mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Head-to-Head Compare
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="bg-muted rounded-lg px-3 py-2 text-sm border border-border/50"
                value={compareTeams[0] || ""}
                onChange={(e) =>
                  setCompareTeams([e.target.value || null, compareTeams[1]])
                }
              >
                <option value="">Select team 1</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              <span className="text-muted-foreground font-medium">vs</span>
              <select
                className="bg-muted rounded-lg px-3 py-2 text-sm border border-border/50"
                value={compareTeams[1] || ""}
                onChange={(e) =>
                  setCompareTeams([compareTeams[0], e.target.value || null])
                }
              >
                <option value="">Select team 2</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {h2hData && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">
                      {compareTeams[0]}
                    </div>
                    <div className="text-3xl font-bold text-primary tabular-nums">
                      {h2hData.t1Wins}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">
                      Draws
                    </div>
                    <div className="text-3xl font-bold tabular-nums">
                      {h2hData.draws}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">
                      {compareTeams[1]}
                    </div>
                    <div className="text-3xl font-bold text-primary tabular-nums">
                      {h2hData.t2Wins}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-center text-muted-foreground mb-3">
                  {h2hData.matches.length} World Cup{" "}
                  {h2hData.matches.length === 1 ? "match" : "matches"}
                </div>
                <div className="space-y-1">
                  {h2hData.matches.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between text-sm py-1.5 border-b border-border/30 last:border-0"
                    >
                      <span className="text-xs text-muted-foreground">
                        {m.year}
                      </span>
                      <span>
                        {m.homeTeam.name}{" "}
                        <span className="font-bold tabular-nums">
                          {m.homeTeam.score}-{m.awayTeam.score}
                        </span>{" "}
                        {m.awayTeam.name}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {m.stageName}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Team list */}
          <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left px-4 py-3 font-medium">Team</th>
                  <th className="text-right px-4 py-3 font-medium">P</th>
                  <th className="text-right px-4 py-3 font-medium">W</th>
                  <th className="text-right px-4 py-3 font-medium">D</th>
                  <th className="text-right px-4 py-3 font-medium">L</th>
                  <th className="text-right px-4 py-3 font-medium">GF</th>
                  <th className="text-right px-4 py-3 font-medium">GA</th>
                  <th className="text-right px-4 py-3 font-medium">GD</th>
                  <th className="text-right px-4 py-3 font-medium">WCs</th>
                </tr>
              </thead>
              <tbody>
                {teamResults.slice(0, 30).map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 font-medium">
                      {t.name}
                      {t.worldCupWins > 0 && (
                        <Badge className="ml-2 bg-accent text-accent-foreground text-[10px]">
                          {t.worldCupWins}x
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {t.played}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-green-500">
                      {t.won}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {t.drawn}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-red-400">
                      {t.lost}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {t.goalsFor}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {t.goalsAgainst}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                      {t.goalDifference > 0 ? "+" : ""}
                      {t.goalDifference}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {t.tournaments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Players Tab */}
      {tab === "players" && (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">Player</th>
                <th className="text-left px-4 py-3 font-medium">Team(s)</th>
                <th className="text-right px-4 py-3 font-medium">Goals</th>
                <th className="text-right px-4 py-3 font-medium">WCs</th>
              </tr>
            </thead>
            <tbody>
              {playerResults.slice(0, 50).map((p, i) => (
                <tr
                  key={p.name}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                    {i + 1}
                  </td>
                  <td className="px-4 py-2.5 font-medium">{p.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">
                    {p.teams.join(", ")}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-primary">
                    {p.goals}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                    {p.tournaments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Matches Tab */}
      {tab === "matches" && (
        <div>
          {query.trim() ? (
            <div className="space-y-2">
              {matchResults.map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-border/50 bg-card p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {m.year}
                      </span>
                      <span className="font-medium">{m.homeTeam.name}</span>
                      <span className="text-lg font-bold tabular-nums text-primary">
                        {m.homeTeam.score}-{m.awayTeam.score}
                      </span>
                      <span className="font-medium">{m.awayTeam.name}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {m.stageName}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {m.stadium}, {m.city} &middot; {m.date}
                  </div>
                </div>
              ))}
              {matchResults.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No matches found for &quot;{query}&quot;
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Type a team name, city, or stadium to search matches
            </p>
          )}
        </div>
      )}
    </div>
  );
}
