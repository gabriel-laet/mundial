import { cache } from "react";

// ── Types ───────────────────────────────────────────────────────────────────

export interface Tournament {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  hostCountry: string;
  winner: string;
  hostWon: boolean;
  countTeams: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  year: number;
  matchName: string;
  stageName: string;
  groupName: string | null;
  isGroupStage: boolean;
  isKnockout: boolean;
  date: string;
  time: string;
  stadium: string;
  city: string;
  country: string;
  homeTeam: {
    id: string;
    name: string;
    code: string;
    score: number;
    scorePenalties: number;
  };
  awayTeam: {
    id: string;
    name: string;
    code: string;
    score: number;
    scorePenalties: number;
  };
  score: string;
  extraTime: boolean;
  penaltyShootout: boolean;
  result: string;
  lat: number | null;
  lng: number | null;
}

export interface Goal {
  id: string;
  matchId: string;
  tournamentId: string;
  year: number;
  date: string;
  stageName: string;
  teamName: string;
  teamCode: string;
  playerName: string;
  familyName: string;
  givenName: string;
  minute: number;
  minuteStoppage: number;
  minuteLabel: string;
  matchPeriod: string;
  ownGoal: boolean;
  penalty: boolean;
  isHomeTeam: boolean;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  tournaments: number;
  tournamentIds: string[];
  worldCupWins: number;
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number | null;
  lat: number | null;
  lng: number | null;
}

export interface GroupStanding {
  tournamentId: string;
  year: number;
  groupName: string;
  position: number;
  teamName: string;
  teamCode: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  advanced: boolean;
}

export interface Stats {
  totalTournaments: number;
  totalMatches: number;
  totalGoals: number;
  totalTeams: number;
  totalPlayers: number;
  totalStadiums: number;
  yearRange: { first: number; last: number };
  topScorers: {
    name: string;
    goals: number;
    penalties: number;
    teams: string[];
    tournaments: number;
  }[];
  mostAppearanceTeams: {
    name: string;
    code: string;
    played: number;
    tournaments: number;
    worldCupWins: number;
  }[];
  goalsByTournament: {
    year: number;
    hostCountry: string;
    goals: number;
    matches: number;
    goalsPerMatch: number;
  }[];
}

// ── Data Loading (Server Components) ────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

async function loadJSON<T>(filename: string): Promise<T> {
  const fs = await import("fs");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "public", "data", filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export const getTournaments = cache(() =>
  loadJSON<Tournament[]>("tournaments.json")
);
export const getMatches = cache(() => loadJSON<Match[]>("matches.json"));
export const getGoals = cache(() => loadJSON<Goal[]>("goals.json"));
export const getTeams = cache(() => loadJSON<Team[]>("teams.json"));
export const getStadiums = cache(() => loadJSON<Stadium[]>("stadiums.json"));
export const getStandings = cache(() =>
  loadJSON<GroupStanding[]>("standings.json")
);
export const getStats = cache(() => loadJSON<Stats>("stats.json"));
