#!/usr/bin/env node
/**
 * Process Fjelstul World Cup CSVs into app-ready JSON files.
 * Also geocodes stadium cities using Nominatim (OpenStreetMap).
 *
 * Usage: node scripts/process-data.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = join(__dirname, "..", "data", "raw");
const OUT_DIR = join(__dirname, "..", "public", "data");

// ── CSV Parser ──────────────────────────────────────────────────────────────

function parseCSV(filename) {
  const raw = readFileSync(join(RAW_DIR, filename), "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      let val = values[i] || "";
      // Auto-convert numbers
      if (/^\d+$/.test(val)) val = parseInt(val, 10);
      else if (/^\d+\.\d+$/.test(val)) val = parseFloat(val);
      obj[h] = val;
    });
    return obj;
  });
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

// ── Coordinates (embedded) ──────────────────────────────────────────────────

import { CITY_COORDS } from "./city-coords.mjs";

function lookupCoords(city, country) {
  const key = `${city},${country}`;
  return CITY_COORDS[key] || null;
}

// ── Main Processing ─────────────────────────────────────────────────────────

function main() {
  console.log("📦 Loading raw CSVs...");

  const tournaments = parseCSV("tournaments.csv");
  const matches = parseCSV("matches.csv");
  const goals = parseCSV("goals.csv");
  const teams = parseCSV("teams.csv");
  const stadiums = parseCSV("stadiums.csv");
  const players = parseCSV("players.csv");
  const groupStandings = parseCSV("group_standings.csv");
  const awardWinners = parseCSV("award_winners.csv");
  const hostCountries = parseCSV("host_countries.csv");
  const qualifiedTeams = parseCSV("qualified_teams.csv");
  const bookings = parseCSV("bookings.csv");
  const substitutions = parseCSV("substitutions.csv");
  const penaltyKicks = parseCSV("penalty_kicks.csv");

  console.log(`  ${tournaments.length} tournaments`);
  console.log(`  ${matches.length} matches`);
  console.log(`  ${goals.length} goals`);
  console.log(`  ${teams.length} teams`);
  console.log(`  ${stadiums.length} stadiums`);
  console.log(`  ${players.length} players`);

  // ── Resolve City Coordinates ──────────────────────────────────────────────

  console.log("\n🌍 Resolving city coordinates...");
  const coordCache = {};
  let found = 0, missing = 0;
  const missingCities = [];
  for (const s of stadiums) {
    const key = `${s.city_name},${s.country_name}`;
    if (coordCache[key] !== undefined) continue;
    const coords = lookupCoords(s.city_name, s.country_name);
    coordCache[key] = coords;
    if (coords) found++;
    else { missing++; missingCities.push(key); }
  }
  console.log(`  Found: ${found}, Missing: ${missing}`);
  if (missingCities.length > 0) {
    console.log(`  Missing cities: ${missingCities.slice(0, 10).join(", ")}${missingCities.length > 10 ? '...' : ''}`);
  }

  // ── Process Tournaments ─────────────────────────────────────────────────

  console.log("\n⚙️  Processing tournaments...");
  const tournamentsOut = tournaments.map((t) => ({
    id: t.tournament_id,
    name: t.tournament_name,
    year: t.year,
    startDate: t.start_date,
    endDate: t.end_date,
    hostCountry: t.host_country,
    winner: t.winner,
    hostWon: t.host_won === 1,
    countTeams: t.count_teams,
    hasGroupStage: t.group_stage === 1,
    hasRoundOf16: t.round_of_16 === 1,
    hasQuarterFinals: t.quarter_finals === 1,
    hasSemiFinals: t.semi_finals === 1,
    hasFinal: t.final === 1,
  }));

  // ── Process Matches ─────────────────────────────────────────────────────

  console.log("⚙️  Processing matches...");
  const matchesOut = matches.map((m) => {
    const cityKey = `${m.city_name},${m.country_name}`;
    const coords = coordCache[cityKey] || null;
    return {
      id: m.match_id,
      tournamentId: m.tournament_id,
      year: parseInt(m.tournament_id.split("-")[1]),
      matchName: m.match_name,
      stageName: m.stage_name,
      groupName: m.group_name || null,
      isGroupStage: m.group_stage === 1,
      isKnockout: m.knockout_stage === 1,
      date: m.match_date,
      time: m.match_time,
      stadium: m.stadium_name,
      city: m.city_name,
      country: m.country_name,
      homeTeam: {
        id: m.home_team_id,
        name: m.home_team_name,
        code: m.home_team_code,
        score: m.home_team_score,
        scorePenalties: m.home_team_score_penalties,
      },
      awayTeam: {
        id: m.away_team_id,
        name: m.away_team_name,
        code: m.away_team_code,
        score: m.away_team_score,
        scorePenalties: m.away_team_score_penalties,
      },
      score: m.score,
      extraTime: m.extra_time === 1,
      penaltyShootout: m.penalty_shootout === 1,
      result: m.result,
      lat: coords?.lat || null,
      lng: coords?.lng || null,
    };
  });

  // ── Process Goals ───────────────────────────────────────────────────────

  console.log("⚙️  Processing goals...");
  const goalsOut = goals.map((g) => ({
    id: g.goal_id,
    matchId: g.match_id,
    tournamentId: g.tournament_id,
    year: parseInt(g.tournament_id.split("-")[1]),
    date: g.match_date,
    stageName: g.stage_name,
    teamName: g.team_name,
    teamCode: g.team_code,
    playerName: `${g.given_name} ${g.family_name}`.trim(),
    familyName: g.family_name,
    givenName: g.given_name,
    minute: g.minute_regulation,
    minuteStoppage: g.minute_stoppage,
    minuteLabel: g.minute_label,
    matchPeriod: g.match_period,
    ownGoal: g.own_goal === 1,
    penalty: g.penalty === 1,
    isHomeTeam: g.home_team === 1,
  }));

  // ── Process Teams ───────────────────────────────────────────────────────

  console.log("⚙️  Processing teams...");

  // Calculate team stats from matches
  const teamStats = {};
  for (const m of matches) {
    for (const side of ["home", "away"]) {
      const id = m[`${side}_team_id`];
      const name = m[`${side}_team_name`];
      const code = m[`${side}_team_code`];
      if (!teamStats[id]) {
        teamStats[id] = {
          id,
          name,
          code,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          tournaments: new Set(),
        };
      }
      teamStats[id].played++;
      teamStats[id].tournaments.add(m.tournament_id);
      const scored = parseInt(m[`${side}_team_score`]) || 0;
      const conceded =
        parseInt(m[`${side === "home" ? "away" : "home"}_team_score`]) || 0;
      teamStats[id].goalsFor += scored;
      teamStats[id].goalsAgainst += conceded;
      if (m[`${side}_team_win`] === 1) teamStats[id].won++;
      else if (m.draw === 1) teamStats[id].drawn++;
      else teamStats[id].lost++;
    }
  }

  // Get World Cup wins
  const wcWins = {};
  for (const t of tournaments) {
    if (!wcWins[t.winner]) wcWins[t.winner] = 0;
    wcWins[t.winner]++;
  }

  const teamsOut = Object.values(teamStats).map((t) => ({
    ...t,
    tournaments: t.tournaments.size,
    tournamentIds: [...t.tournaments],
    goalDifference: t.goalsFor - t.goalsAgainst,
    worldCupWins: wcWins[t.name] || 0,
  }));
  teamsOut.sort((a, b) => b.played - a.played);

  // ── Process Stadiums ────────────────────────────────────────────────────

  console.log("⚙️  Processing stadiums...");
  const stadiumsOut = stadiums.map((s) => {
    const cityKey = `${s.city_name},${s.country_name}`;
    const coords = coordCache[cityKey] || null;
    return {
      id: s.stadium_id,
      name: s.stadium_name,
      city: s.city_name,
      country: s.country_name,
      capacity: s.stadium_capacity || null,
      lat: coords?.lat || null,
      lng: coords?.lng || null,
    };
  });

  // ── Process Group Standings ─────────────────────────────────────────────

  console.log("⚙️  Processing group standings...");
  const standingsOut = groupStandings.map((gs) => ({
    tournamentId: gs.tournament_id,
    year: parseInt(gs.tournament_id.split("-")[1]),
    groupName: gs.group_name,
    position: gs.position,
    teamName: gs.team_name,
    teamCode: gs.team_code,
    played: gs.played,
    wins: gs.wins,
    draws: gs.draws,
    losses: gs.losses,
    goalsFor: gs.goals_for,
    goalsAgainst: gs.goals_against,
    goalDifference: gs.goal_difference,
    points: gs.points,
    advanced: gs.advanced === 1,
  }));

  // ── Process Award Winners ───────────────────────────────────────────────

  console.log("⚙️  Processing awards...");
  const awardsOut = awardWinners.map((a) => ({
    tournamentId: a.tournament_id,
    year: parseInt(a.tournament_id.split("-")[1]),
    awardName: a.award_name,
    playerName: a.player_name,
    teamName: a.team_name,
  }));

  // ── Aggregate Stats ─────────────────────────────────────────────────────

  console.log("⚙️  Computing aggregate stats...");
  const stats = {
    totalTournaments: tournaments.length,
    totalMatches: matches.length,
    totalGoals: goals.length,
    totalTeams: teams.length,
    totalPlayers: players.length,
    totalStadiums: stadiums.length,
    yearRange: {
      first: tournaments[0]?.year,
      last: tournaments[tournaments.length - 1]?.year,
    },
    topScorers: computeTopScorers(goals, 20),
    mostAppearanceTeams: teamsOut.slice(0, 10).map((t) => ({
      name: t.name,
      code: t.code,
      played: t.played,
      tournaments: t.tournaments,
      worldCupWins: t.worldCupWins,
    })),
    goalsByTournament: computeGoalsByTournament(goals, tournaments, matches),
  };

  // ── Write Output ────────────────────────────────────────────────────────

  console.log("\n💾 Writing output files...");
  const files = {
    "tournaments.json": tournamentsOut,
    "matches.json": matchesOut,
    "goals.json": goalsOut,
    "teams.json": teamsOut,
    "stadiums.json": stadiumsOut,
    "standings.json": standingsOut,
    "awards.json": awardsOut,
    "stats.json": stats,
  };

  for (const [filename, data] of Object.entries(files)) {
    const path = join(OUT_DIR, filename);
    writeFileSync(path, JSON.stringify(data));
    const sizeMB = (Buffer.byteLength(JSON.stringify(data)) / 1024).toFixed(1);
    console.log(
      `  ${filename}: ${Array.isArray(data) ? data.length + " records" : "object"} (${sizeMB} KB)`
    );
  }

  console.log("\n✅ Done!");
}

// ── Helper Functions ──────────────────────────────────────────────────────

function computeTopScorers(goals, limit) {
  const scorers = {};
  for (const g of goals) {
    if (g.own_goal === 1) continue;
    const name = `${g.given_name} ${g.family_name}`.trim();
    if (!scorers[name]) {
      scorers[name] = {
        name,
        goals: 0,
        penalties: 0,
        teams: new Set(),
        tournaments: new Set(),
      };
    }
    scorers[name].goals++;
    if (g.penalty === 1) scorers[name].penalties++;
    scorers[name].teams.add(g.team_name);
    scorers[name].tournaments.add(g.tournament_id);
  }

  return Object.values(scorers)
    .map((s) => ({
      name: s.name,
      goals: s.goals,
      penalties: s.penalties,
      teams: [...s.teams],
      tournaments: s.tournaments.size,
    }))
    .sort((a, b) => b.goals - a.goals)
    .slice(0, limit);
}

function computeGoalsByTournament(goals, tournaments, matches) {
  const goalsByT = {};
  const matchesByT = {};
  for (const g of goals) {
    goalsByT[g.tournament_id] = (goalsByT[g.tournament_id] || 0) + 1;
  }
  for (const m of matches) {
    matchesByT[m.tournament_id] = (matchesByT[m.tournament_id] || 0) + 1;
  }
  return tournaments.map((t) => {
    const g = goalsByT[t.tournament_id] || 0;
    const m = matchesByT[t.tournament_id] || 0;
    return {
      year: t.year,
      hostCountry: t.host_country,
      goals: g,
      matches: m,
      goalsPerMatch: m > 0 ? +(g / m).toFixed(2) : 0,
    };
  });
}

try { main(); } catch(e) { console.error(e); process.exit(1); }
