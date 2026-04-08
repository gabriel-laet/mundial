import Link from "next/link";
import { getStats, getTournaments } from "@/lib/data";
import { StatCard } from "@/components/stat-card";
import { GoalsChart } from "@/components/goals-chart";

export default async function Home() {
  const stats = await getStats();
  const tournaments = await getTournaments();

  const winners = tournaments.reduce(
    (acc, t) => {
      acc[t.winner] = (acc[t.winner] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const winnerList = Object.entries(winners)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          <span className="text-primary">Mundial</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore the complete history of the FIFA World Cup. Every match, every
          goal, every tournament from {stats.yearRange.first} to{" "}
          {stats.yearRange.last}.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/map"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Explore the Map
          </Link>
          <Link
            href="/timeline"
            className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            View Timeline
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <StatCard label="Tournaments" value={stats.totalTournaments} />
        <StatCard label="Matches Played" value={stats.totalMatches} />
        <StatCard label="Goals Scored" value={stats.totalGoals} />
        <StatCard label="Nations" value={stats.totalTeams} />
      </section>

      {/* Goals by Tournament Chart */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Goals per Tournament</h2>
        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
          <GoalsChart data={stats.goalsByTournament} />
        </div>
      </section>

      {/* Top Scorers + World Cup Winners */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* All-time top scorers */}
        <section>
          <h2 className="text-2xl font-bold mb-4">All-Time Top Scorers</h2>
          <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left px-4 py-3 font-medium">#</th>
                  <th className="text-left px-4 py-3 font-medium">Player</th>
                  <th className="text-right px-4 py-3 font-medium">Goals</th>
                  <th className="text-right px-4 py-3 font-medium">WCs</th>
                </tr>
              </thead>
              <tbody>
                {stats.topScorers.slice(0, 10).map((scorer, i) => (
                  <tr
                    key={scorer.name}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                      {i + 1}
                    </td>
                    <td className="px-4 py-2.5 font-medium">{scorer.name}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-primary">
                      {scorer.goals}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                      {scorer.tournaments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* World Cup Winners */}
        <section>
          <h2 className="text-2xl font-bold mb-4">World Cup Winners</h2>
          <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left px-4 py-3 font-medium">Country</th>
                  <th className="text-right px-4 py-3 font-medium">Titles</th>
                  <th className="text-left px-4 py-3 font-medium">Years</th>
                </tr>
              </thead>
              <tbody>
                {winnerList.map(([country, count]) => (
                  <tr
                    key={country}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 font-medium">
                      <Link
                        href={`/search?q=${encodeURIComponent(country)}`}
                        className="hover:text-primary transition-colors"
                      >
                        {country}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-accent">
                      {count}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">
                      {tournaments
                        .filter((t) => t.winner === country)
                        .map((t) => t.year)
                        .join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Quick Nav Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        <NavCard
          href="/map"
          title="Map Explorer"
          description="See where every World Cup match was played on an interactive world map."
        />
        <NavCard
          href="/timeline"
          title="Timeline"
          description="Walk through World Cup history year by year, match by match, goal by goal."
        />
        <NavCard
          href="/search"
          title="Search & Compare"
          description="Find any team, player, or match. Compare head-to-head records."
        />
      </section>
    </div>
  );
}

function NavCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
    >
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
