"use client";

import { useState, useMemo } from "react";
import type { Tournament, Match, Goal } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

interface Props {
  tournaments: Tournament[];
  matches: Match[];
  goals: Goal[];
}

export function TimelineClient({ tournaments, matches, goals }: Props) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const tournament = useMemo(
    () => tournaments.find((t) => t.year === selectedYear) || null,
    [selectedYear, tournaments]
  );

  const tournamentMatches = useMemo(
    () =>
      selectedYear
        ? matches
            .filter((m) => m.year === selectedYear)
            .sort(
              (a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )
        : [],
    [selectedYear, matches]
  );

  const matchGoals = useMemo(
    () =>
      selectedMatchId
        ? goals
            .filter((g) => g.matchId === selectedMatchId)
            .sort((a, b) => a.minute - b.minute)
        : [],
    [selectedMatchId, goals]
  );

  const selectedMatch = useMemo(
    () => tournamentMatches.find((m) => m.id === selectedMatchId) || null,
    [selectedMatchId, tournamentMatches]
  );

  // Group matches by stage
  const matchesByStage = useMemo(() => {
    const grouped: Record<string, Match[]> = {};
    for (const m of tournamentMatches) {
      const stage = m.stageName;
      if (!grouped[stage]) grouped[stage] = [];
      grouped[stage].push(m);
    }
    return grouped;
  }, [tournamentMatches]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Timeline</h1>
      <p className="text-muted-foreground mb-8">
        Select a World Cup year to explore its matches and goals.
      </p>

      {/* Year selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tournaments.map((t) => (
          <button
            key={t.year}
            onClick={() => {
              setSelectedYear(t.year);
              setSelectedMatchId(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedYear === t.year
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            {t.year}
          </button>
        ))}
      </div>

      {/* Tournament Info */}
      {tournament && (
        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold">{tournament.year}</h2>
            <Badge variant="secondary">{tournament.hostCountry}</Badge>
            <Badge className="bg-accent text-accent-foreground">
              Winner: {tournament.winner}
            </Badge>
            <Badge variant="outline">{tournament.countTeams} teams</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {tournament.startDate} to {tournament.endDate} &middot;{" "}
            {tournamentMatches.length} matches &middot;{" "}
            {goals.filter((g) => g.year === selectedYear).length} goals
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Match list */}
        {selectedYear && (
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(matchesByStage).map(([stage, stageMatches]) => (
              <div key={stage}>
                <h3 className="text-lg font-semibold mb-3 capitalize">
                  {stage}
                </h3>
                <div className="space-y-2">
                  {stageMatches.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMatchId(m.id)}
                      className={`w-full text-left rounded-lg border p-3 transition-all ${
                        selectedMatchId === m.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/50 bg-card hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs text-muted-foreground shrink-0">
                            {m.date}
                          </span>
                          <span className="font-medium truncate">
                            {m.homeTeam.name}
                          </span>
                          <span className="text-lg font-bold tabular-nums text-primary shrink-0">
                            {m.homeTeam.score} - {m.awayTeam.score}
                          </span>
                          <span className="font-medium truncate">
                            {m.awayTeam.name}
                          </span>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
                          {m.extraTime && (
                            <Badge variant="outline" className="text-[10px]">
                              AET
                            </Badge>
                          )}
                          {m.penaltyShootout && (
                            <Badge variant="outline" className="text-[10px]">
                              PEN
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {m.stadium}, {m.city}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Goal timeline for selected match */}
        {selectedMatch && (
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-border/50 bg-card p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-1">
                {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedMatch.date} &middot; {selectedMatch.stadium},{" "}
                {selectedMatch.city}
              </p>

              {/* Score */}
              <div className="flex items-center justify-center gap-4 py-4 mb-4 rounded-lg bg-muted/50">
                <div className="text-center">
                  <div className="text-sm font-medium mb-1">
                    {selectedMatch.homeTeam.name}
                  </div>
                  <div className="text-4xl font-bold text-primary tabular-nums">
                    {selectedMatch.homeTeam.score}
                  </div>
                </div>
                <div className="text-2xl text-muted-foreground">-</div>
                <div className="text-center">
                  <div className="text-sm font-medium mb-1">
                    {selectedMatch.awayTeam.name}
                  </div>
                  <div className="text-4xl font-bold text-primary tabular-nums">
                    {selectedMatch.awayTeam.score}
                  </div>
                </div>
              </div>

              {/* Goals minute by minute */}
              {matchGoals.length > 0 ? (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Goals
                  </h4>
                  <div className="space-y-0">
                    {matchGoals.map((g) => (
                      <div
                        key={g.id}
                        className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0"
                      >
                        {/* Minute indicator */}
                        <div className="w-12 text-right">
                          <span className="text-sm font-mono font-bold text-primary">
                            {g.minuteLabel}
                          </span>
                        </div>
                        {/* Goal line on pitch visualization */}
                        <div className="relative w-1 h-8 bg-border/50 rounded-full">
                          <div
                            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-card"
                            style={{
                              top: `${Math.min((g.minute / 120) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        {/* Scorer info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {g.playerName}
                            {g.ownGoal && (
                              <span className="text-destructive ml-1">
                                (OG)
                              </span>
                            )}
                            {g.penalty && (
                              <span className="text-muted-foreground ml-1">
                                (pen)
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {g.teamName}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No goals in this match
                </p>
              )}

              {selectedMatch.penaltyShootout && (
                <div className="mt-4 pt-4 border-t border-border/50 text-center">
                  <Badge className="bg-accent text-accent-foreground">
                    Penalties: {selectedMatch.homeTeam.scorePenalties} -{" "}
                    {selectedMatch.awayTeam.scorePenalties}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Placeholder when no match selected */}
        {selectedYear && !selectedMatch && (
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-dashed border-border/50 p-6 flex items-center justify-center h-48">
              <p className="text-sm text-muted-foreground text-center">
                Select a match to see its goals minute by minute
              </p>
            </div>
          </div>
        )}
      </div>

      {/* No year selected */}
      {!selectedYear && (
        <div className="rounded-xl border border-dashed border-border/50 p-12 flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Select a year above to explore that World Cup
          </p>
        </div>
      )}
    </div>
  );
}
