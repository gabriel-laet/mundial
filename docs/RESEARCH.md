# World Cup Data Sources Research

> Research compiled April 2026 for the World Cup visualization project.

---

## TL;DR - Top Recommendations

| Source | Best For | Cost | Data Depth |
|--------|----------|------|------------|
| **Fjelstul World Cup DB** | Historical analysis (1930-2022) | Free | 27 datasets, 1.58M data points |
| **StatsBomb Open Data** | Deep event-level analysis (select tournaments) | Free | Event-level with 360 freeze frames |
| **Mart Jurisoo Intl Results** | Broadest match coverage (1872-2025) | Free | 49K matches, goals, shootouts |
| **Kaggle piterfm dataset** | Quick start, match-level with xG | Free | Match results + xG, all World Cups |
| **football-data.org** | API-based access, prototyping | Free tier | Matches, scores, standings |
| **API-Football** | Live + historical via REST API | From $19/mo | Full coverage, 1200+ leagues |

---

## 1. Free Datasets (Downloadable)

### 1.1 Fjelstul World Cup Database (BEST for comprehensive historical data)

- **URL:** https://github.com/jfjelstul/worldcup
- **Coverage:** All 22 men's tournaments (1930-2022) + 8 women's tournaments (1991-2019)
- **Format:** CSV, SQLite, R package
- **License:** CC-BY-SA 4.0
- **Data Points:** 1.58 million across 27 datasets

**Datasets include:**
- Tournaments, hosts, and stadiums
- Matches (date, stage, group, score, penalties, extra time)
- Teams and squads (every player called up)
- Goals (scorer, minute, assist, own goal, penalty)
- Bookings (yellow/red cards, minute, player)
- Substitutions (player in/out, minute)
- Penalty shootouts (each kick, order, result)
- Managers and referees
- Standings and group tables
- Awards (Golden Ball, Golden Boot, etc.)

**Verdict:** This is the gold standard for historical World Cup data. Extremely well-structured, relational data that's ready for analysis. Perfect for building dashboards and visualizations spanning the full history of the tournament.

---

### 1.2 StatsBomb Open Data (BEST for granular event-level analysis)

- **URL:** https://github.com/statsbomb/open-data
- **Coverage:** Men's WC: **2022, 2018, 1990, 1986, 1974, 1970, 1962, 1958**. Women's WC: **2023, 2019**. Also FIFA U20 WC 1979.
- **Format:** JSON (exported from StatsBomb Data API)
- **License:** Free for non-commercial use (attribution required)

**Data includes:**
- **Event data:** Every on-ball event (passes, shots, carries, dribbles, tackles, pressures, clearances, etc.)
- **360 freeze frames:** Position of every visible player at the moment of each event
- **Match metadata:** Lineups, formations, managers
- **Shot data:** xG (expected goals), end location, body part, technique

**Verdict:** The deepest, most granular free football data available. Not all World Cups covered, but for the ones that are, you get professional-grade analytics data. Great for tactical analysis, shot maps, pass networks, and advanced metrics.

---

### 1.3 International Football Results 1872-2026 (Mart Jurisoo)

- **URL:** https://www.kaggle.com/datasets/martj42/international-football-results-from-1872-to-2017
- **GitHub:** https://github.com/martj42/international_results
- **Format:** CSV (4 files, ~1.26 MB)
- **License:** CC0 Public Domain
- **Downloads:** 130,000+ on Kaggle
- **Last Updated:** April 2026 (actively maintained with daily updates!)
- **Coverage:** 1872-2025, **49,016 matches** — ALL international football, not just World Cup

**Files:**
1. `results.csv` — date, home_team, away_team, home_score, away_score, tournament, city, country, neutral
2. `goalscorers.csv` — date, teams, scorer, own_goal, penalty (no minute data)
3. `shootouts.csv` — date, teams, winner, first_shooter
4. `former_names.csv` — historical team name changes

**Verdict:** The most comprehensive international results dataset. Filter by `tournament = "FIFA World Cup"` for WC data. Also gives you qualifiers, friendlies, and every other competition for context. Actively maintained — the most current free source available.

---

### 1.4 Kaggle Datasets

#### piterfm: FIFA World Cup 1930-2022
- **URL:** https://www.kaggle.com/datasets/piterfm/fifa-football-world-cup
- **Files:** `matches_1930_2022.csv`, `fifa_ranking_2022-10-06.csv`, `world_cup.csv` (~184 KB)
- **Coverage:** All World Cups 1930-2022
- **Includes:** Scores, xG, managers, captains, goal scorers, penalty takers, cards, substitutions, attendance, venue, referee
- **Best for:** Rich match-level analysis with xG data — unique among historical datasets

#### jahaidulislam: FIFA World Cup All Goals 1930-2022
- **URL:** https://www.kaggle.com/datasets/jahaidulislam/fifa-world-cup-all-goals-1930-2022-dataset
- **Coverage:** Every goal scored in World Cup history
- **Best for:** Goal-scoring analysis, top scorers, goal distribution

#### abecklas: FIFA World Cup (95K+ downloads)
- **URL:** https://www.kaggle.com/datasets/abecklas/fifa-world-cup
- **Files:** `WorldCupMatches.csv`, `WorldCups.csv`, `WorldCupPlayers.csv`
- **Coverage:** 1930-2014 (does NOT include 2018 or 2022)
- **Best for:** One of the most popular/cited WC datasets. Good starting point but outdated.

#### die9origephit: FIFA World Cup 2022 Complete Dataset
- **URL:** https://www.kaggle.com/datasets/die9origephit/fifa-world-cup-2022-complete-dataset
- **Coverage:** Qatar 2022 only — possession, crosses, passes, fouls, attempts, offsides, cards, assists
- **Best for:** Detailed per-match statistics for the most recent completed World Cup

#### swaptr: FIFA World Cup 2022 Player Data
- **URL:** https://www.kaggle.com/datasets/swaptr/fifa-world-cup-2022-player-data
- **Source:** FBref
- **Coverage:** 2022 World Cup, player-level statistics
- **Best for:** Individual player performance analysis for Qatar 2022

#### iamsouravbanerjee: FIFA Football World Cup Dataset
- **URL:** https://www.kaggle.com/datasets/iamsouravbanerjee/fifa-football-world-cup-dataset
- **Source:** fifa.com
- **Coverage:** 1930-2022 tournament-level records
- **Best for:** Tournament-level summaries and statistics

---

### 1.5 OpenFootball (worldcup.json)

- **URL:** https://github.com/openfootball/worldcup.json
- **Coverage:** Multiple World Cups from 1930 through 2026
- **Format:** JSON, no API key required
- **License:** Public domain
- **Best for:** Simple match data in JSON format, easy to consume programmatically

---

### 1.6 FBref / worldfootballR (Programmatic Access)

- **FBref:** https://fbref.com/en/comps/1/World-Cup-Stats
- **R package:** https://jaseziv.github.io/worldfootballR/
- **Python:** https://pypi.org/project/ScraperFC/
- **Format:** Scrape to CSV/DataFrame
- **Coverage:** Complete World Cup history with detailed player statistics (powered by StatsBomb for recent seasons)
- **Best for:** Most detailed player-level stats available. Not a downloadable dataset but clean programmatic access via R/Python packages.

---

### 1.7 Maven Analytics World Cup Dataset

- **URL:** https://mavenanalytics.io/data-playground/world-cup
- **Format:** CSV
- **License:** Public Domain
- **Records:** 499 records, 25 fields
- **Best for:** Curated dataset designed for analytics practice

---

## 2. Free APIs

### 2.1 football-data.org

- **URL:** https://www.football-data.org
- **Cost:** Free tier (rate-limited), paid tiers available
- **Auth:** API key (free registration)
- **Coverage:** World Cup + many domestic leagues
- **Data:** Matches, scores, standings, squads, lineups
- **Rate limit:** 10 requests/minute on free tier
- **Best for:** Prototyping, hobby projects, dashboards

### 2.2 TheSportsDB

- **URL:** https://www.thesportsdb.com
- **Cost:** Free (use API key "3"); Premium $9/mo via Patreon
- **Coverage:** FIFA World Cup listed as supported league
- **Data (Free):** Events/fixtures, results, team info, player info, logos/banners/fanart
- **Data (Premium):** 2-minute livescores, video highlights, V2 API
- **Best for:** Basic match results + team/player lookups + sports artwork/media

### 2.3 World Cup JSON (worldcupjson.net)

- **URL:** https://worldcupjson.net
- **Cost:** Completely free, no API key
- **Coverage:** WC 2014, 2018, 2022; Women's WC 2015, 2019; likely 2026
- **Data:** Match results, scores, events (goals/subs/cards), team records, filtering by country/date
- **Best for:** Quick prototyping, lightweight access, no auth required

### 2.4 BALLDONTLIE FIFA API

- **URL:** https://fifa.balldontlie.io/
- **Cost:** Free ($0, 5 req/min, Teams & Stadiums only); ALL-STAR $9.99/mo; GOAT $39.99/mo
- **Coverage:** World Cup 2026 only (no historical data)
- **Data:** Teams, stadiums, group standings, match fixtures/scores, betting odds (DraftKings/FanDuel)
- **Best for:** 2026-specific applications, especially with betting data

### 2.5 WC2026 API

- **URL:** https://www.wc2026api.com/
- **Cost:** Free tier (no credit card), Pro plan available
- **Coverage:** World Cup 2026 (104 matches)
- **Data:** Real-time scores, fixtures, group standings, stadium data
- **Best for:** 2026-specific real-time data

---

## 3. Paid APIs

### 3.1 API-Football (via RapidAPI)

- **URL:** https://www.api-football.com / https://rapidapi.com/api-sports/api/api-football
- **Pricing:** Free $0 (100 req/day, limited seasons) | Pro $19/mo (7,500/day) | Ultra $29/mo (75K/day) | Mega $39/mo (150K/day)
- **Coverage:** 1,200+ leagues and cups, several years of historical data. All plans include all competitions and endpoints.
- **Data:** Fixtures, livescores, lineups, match events, standings, top scorers, player info, coaches, transfers, trophies, injuries, odds, statistics, predictions, H2H
- **Best for:** Best value paid option. Production apps needing broad football coverage.

### 3.2 Sportmonks

- **URL:** https://www.sportmonks.com/football-api/world-cup-api/
- **Pricing:** Starter 29 EUR/mo (5 leagues) | Growth 99 EUR/mo (30 leagues) | Pro 249 EUR/mo (120 leagues) | **WC 2026 Special: 69 EUR one-time** | WC 2026 All-in: 129 EUR one-time | 14-day free trial
- **Coverage:** 2,500+ leagues. Historical World Cup data from past editions + 2026
- **Data:** Fixtures, live scores, in-game events, squads, player stats, advanced analytics (xG, pressure), lineups, venues, broadcasts, injuries, standings, groups, knockout info
- **Best for:** Advanced analytics with xG. The 69 EUR one-time WC special is great value.

### 3.3 Live-Score-API

- **URL:** https://live-score-api.com
- **Pricing:** Free trial 14 days (1,500 req/day) | Starter 11 EUR/mo | Professional 26 EUR/mo | Premium 69 EUR/mo | Commentary 190 EUR/mo (**92 years of historical data**)
- **Coverage:** World Cup included. Top tier claims history back to ~1930s.
- **Data:** Live scores, fixtures, match events, standings, historical data, lineups, H2H, odds, multi-language
- **Best for:** Maximum historical depth at the Commentary tier

### 3.4 SportsDataIO

- **URL:** https://sportsdata.io/fifa-world-cup-api
- **Cost:** Contact sales (no public pricing). No free WC tier.
- **Data:** Real-time scores, lineups, stats, betting odds (20+ sportsbooks), fantasy projections, historical data via "Vault" product
- **Best for:** Enterprise/commercial applications, betting platforms, fantasy sports

### 3.5 Data Sports Group (DSG)

- **URL:** https://datasportsgroup.com/fifa-world-cup-data/
- **Cost:** Paid (contact sales)
- **Data:** Live widgets, feeds, historical data
- **Best for:** Embeddable widgets and commercial applications

### 3.6 Statorium

- **URL:** https://statorium.com/fifa-world-cup-2026-api
- **Cost:** Premium package (fixed price, not publicly listed)
- **Data:** Live scores, player events (goals/penalties/cards/assists), match stats (fouls, shots, possession, corners)
- **Best for:** Real-time 2026 match coverage

---

## 4. Data Depth Comparison

| Data Level | Fjelstul DB | StatsBomb | Kaggle (piterfm) | football-data.org | API-Football |
|------------|:-----------:|:---------:|:-----------------:|:-----------------:|:------------:|
| Tournament summaries | Yes | - | Yes | Yes | Yes |
| Match results & scores | Yes | Yes | Yes | Yes | Yes |
| Group standings | Yes | - | Yes | Yes | Yes |
| Goal scorers & minute | Yes | Yes | Some | - | Yes |
| Assists | Yes | Yes | - | - | Yes |
| Lineups & squads | Yes | Yes | - | Yes | Yes |
| Substitutions | Yes | Yes | - | - | Yes |
| Bookings (cards) | Yes | Yes | - | - | Yes |
| Penalty shootout detail | Yes | Yes | - | - | Yes |
| Manager/referee data | Yes | Yes | - | - | - |
| Awards | Yes | - | - | - | - |
| xG / advanced metrics | - | Yes | - | - | - |
| Pass/shot/event data | - | Yes | - | - | - |
| 360 player positions | - | Yes | - | - | - |
| Women's World Cup | Yes | Yes | - | - | Yes |
| Coverage span | 1930-2022 | Select WCs | 1930-2022 | Recent | Recent |

---

## 5. Recommended Approach for This Project

### Primary data sources:
1. **Fjelstul World Cup DB** - Main backbone for all historical analysis (1930-2022)
2. **StatsBomb Open Data** - For deep tactical visualizations on 2018/2022 tournaments
3. **Kaggle datasets** - Supplementary data and quick validation

### For 2026 live data (when the tournament starts):
4. **football-data.org** or **BALLDONTLIE** for free API access
5. **API-Football** if budget allows ($19/mo) for richer real-time data

### Possible visualization ideas by data source:
- **Fjelstul:** All-time records, goal timelines, country performance evolution, manager tenures, referee stats, penalty shootout analysis
- **StatsBomb:** Shot maps, pass networks, xG analysis, player heatmaps, formation analysis
- **Kaggle + Fjelstul combined:** Head-to-head histories, World Cup "dynasties", underdog stories, host nation advantage analysis
