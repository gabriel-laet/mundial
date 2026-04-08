# World Cup Data Sources Research

> Research compiled April 2026 for the World Cup visualization project.

---

## TL;DR - Top Recommendations

| Source | Best For | Cost | Data Depth |
|--------|----------|------|------------|
| **Fjelstul World Cup DB** | Historical analysis (1930-2022) | Free | 27 datasets, 1.58M data points |
| **StatsBomb Open Data** | Deep event-level analysis (select tournaments) | Free | Event-level with 360 freeze frames |
| **Kaggle piterfm dataset** | Quick start, match-level analysis | Free | Match results, all World Cups |
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
- **Coverage:** Select tournaments including 2018 WC, 2022 WC, 2023 Women's WC
- **Format:** JSON (exported from StatsBomb Data API)
- **License:** Free for non-commercial use (attribution required)

**Data includes:**
- **Event data:** Every on-ball event (passes, shots, carries, dribbles, tackles, pressures, clearances, etc.)
- **360 freeze frames:** Position of every visible player at the moment of each event
- **Match metadata:** Lineups, formations, managers
- **Shot data:** xG (expected goals), end location, body part, technique

**Verdict:** The deepest, most granular free football data available. Not all World Cups covered, but for the ones that are, you get professional-grade analytics data. Great for tactical analysis, shot maps, pass networks, and advanced metrics.

---

### 1.3 Kaggle Datasets

#### piterfm: FIFA World Cup 1930-2022
- **URL:** https://www.kaggle.com/datasets/piterfm/fifa-football-world-cup
- **Files:** `matches_1930_2022.csv` and related files
- **Coverage:** All World Cups 1930-2022
- **Best for:** Quick-start match-level analysis

#### jahaidulislam: FIFA World Cup All Goals 1930-2022
- **URL:** https://www.kaggle.com/datasets/jahaidulislam/fifa-world-cup-all-goals-1930-2022-dataset
- **Coverage:** Every goal scored in World Cup history
- **Best for:** Goal-scoring analysis, top scorers, goal distribution

#### iamsouravbanerjee: FIFA Football World Cup Dataset
- **URL:** https://www.kaggle.com/datasets/iamsouravbanerjee/fifa-football-world-cup-dataset
- **Coverage:** Comprehensive World Cup data
- **Best for:** Tournament-level summaries and statistics

#### die9origephit: FIFA World Cup 2022 Complete Dataset
- **URL:** https://www.kaggle.com/datasets/die9origephit/fifa-world-cup-2022-complete-dataset
- **Coverage:** Qatar 2022 only, detailed
- **Best for:** Deep dive into the most recent completed World Cup

#### abecklas: FIFA World Cup
- **URL:** https://www.kaggle.com/datasets/abecklas/fifa-world-cup
- **Coverage:** Historical summary data
- **Best for:** High-level tournament comparisons

---

### 1.4 OpenFootball (worldcup.json)

- **URL:** https://github.com/openfootball/worldcup.json
- **Coverage:** Multiple World Cups including 2018, 2022, 2026
- **Format:** JSON, no API key required
- **License:** Public domain
- **Best for:** Simple match data in JSON format, easy to consume programmatically

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

### 2.2 BALLDONTLIE FIFA API

- **URL:** https://fifa.balldontlie.io/
- **Cost:** Free account available
- **Coverage:** World Cup 2026
- **Data:** Teams, stadiums, matches, standings, odds, futures
- **Best for:** 2026 World Cup live data

### 2.3 WC2026 API

- **URL:** https://www.wc2026api.com/
- **Cost:** Free tier (no credit card), Pro plan available
- **Coverage:** World Cup 2026 (104 matches)
- **Data:** Real-time scores, fixtures, group standings, stadium data
- **Best for:** 2026-specific real-time data

---

## 3. Paid APIs

### 3.1 API-Football (via RapidAPI)

- **URL:** https://www.api-football.com / https://rapidapi.com/api-sports/api/api-football
- **Cost:** From $19/month (all plans include all competitions)
- **Coverage:** 1,200+ leagues and cups, several years of historical data
- **Data:** Livescore, standings, events, lineups, players, pre-match odds, statistics
- **Best for:** Production apps needing broad football coverage

### 3.2 Sportmonks

- **URL:** https://www.sportmonks.com/football-api/world-cup-api/
- **Cost:** Paid (early-bird pricing available for WC 2026)
- **Coverage:** Historical World Cup data from past editions + 2026
- **Data:** Comparison tools, historical dashboards, long-term analytics
- **Best for:** Enterprise-grade applications

### 3.3 SportsDataIO

- **URL:** https://sportsdata.io/fifa-world-cup-api
- **Cost:** Paid
- **Coverage:** FIFA World Cup
- **Best for:** US-focused sports data platforms

### 3.4 Data Sports Group (DSG)

- **URL:** https://datasportsgroup.com/fifa-world-cup-data/
- **Cost:** Paid
- **Data:** Live widgets, feeds, historical data
- **Best for:** Embeddable widgets and commercial applications

### 3.5 Statorium

- **URL:** https://statorium.com/fifa-world-cup-2026-api
- **Cost:** Paid
- **Coverage:** World Cup 2026
- **Best for:** 2026-specific API needs

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
