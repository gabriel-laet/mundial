import { getTournaments, getMatches, getGoals } from "@/lib/data";
import { TimelineClient } from "./timeline-client";

export const metadata = {
  title: "Timeline - Mundial",
  description:
    "Walk through World Cup history year by year, match by match, goal by goal.",
};

export default async function TimelinePage() {
  const tournaments = await getTournaments();
  const matches = await getMatches();
  const goals = await getGoals();

  return (
    <TimelineClient
      tournaments={tournaments}
      matches={matches}
      goals={goals}
    />
  );
}
