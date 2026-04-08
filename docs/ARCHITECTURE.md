# Mundial - World Cup Data Explorer

> "Mundial" — the universal word for the World Cup, understood across languages.

## Vision

An interactive, visually rich explorer for FIFA World Cup history (1930-2022).
Browse matches on a world map, walk through time with an animated timeline,
search and compare anything with AI-powered generative UI.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (App Router) | Best DX, Vercel-native, RSC for data |
| **Hosting** | Vercel | Free tier, edge functions, AI SDK integration |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI, beautiful defaults |
| **Maps** | Leaflet + react-leaflet + OpenStreetMap | Free, proven, no API key |
| **Charts** | Recharts | React-native charting, composable |
| **Timeline** | Custom (D3 + Framer Motion) | No off-the-shelf fits our vision |
| **Search** | Typesense (later) / Fuse.js (MVP) | Fast faceted search + typo tolerance |
| **AI** | Vercel AI SDK + Claude | Generative UI for natural language queries |
| **Data** | Static JSON (processed from CSV) | No DB needed for historical data |

---

## Data Sources (MVP)

1. **Fjelstul World Cup DB** → matches, goals, teams, players, stadiums, squads, standings
2. **Mart Jurisoo dataset** → supplementary match results + goalscorers
3. Stadium coordinates → geocoded from Fjelstul stadium names

---

## Core Pages

### 1. Home (`/`)
- Hero with animated key stats (900+ matches, 2,700+ goals, 80+ teams, 22 tournaments)
- Quick navigation cards to Map, Timeline, Search
- "On this day" — historical WC events from today's date

### 2. Map Explorer (`/map`)
- World map with all WC host cities/stadiums as markers
- Filter by tournament year (slider or dropdown)
- Click marker → match details, scores, goal scorers
- Color-coded markers by tournament
- Country choropleth overlay: wins, goals scored, appearances

### 3. Timeline (`/timeline`)
- Horizontal timeline of all World Cups (1930-2022)
- Click a year → expand to tournament bracket/matches
- Drill into a match → minute-by-minute goal timeline
- "Play" button to animate through a tournament's matches
- Key moments highlighted (upsets, record-breaking events)

### 4. Search & Compare (`/search`)
- **MVP:** Text search with Fuse.js across teams, players, matches
- **Future:** AI-powered natural language queries via Claude
  - "Compare Brazil vs Germany all-time"
  - "Who scored the most goals in knockout stages?"
  - "Show me all penalty shootouts won by underdogs"
- Generative UI renders dynamic components (tables, charts, maps) based on query

### 5. Tournament Detail (`/tournament/[year]`)
- Groups, standings, bracket
- All matches with scores
- Top scorers, cards, attendance
- Host country info + stadiums

### 6. Team Profile (`/team/[name]`)
- All-time WC record
- Matches played, W/D/L
- Top scorers for this team
- Tournament-by-tournament history

---

## Data Pipeline

```
Fjelstul CSVs → Node.js script → Processed JSON → /public/data/
                                                    ├── tournaments.json
                                                    ├── matches.json
                                                    ├── goals.json
                                                    ├── teams.json
                                                    ├── players.json
                                                    ├── stadiums.json (with lat/lng)
                                                    ├── squads.json
                                                    ├── standings.json
                                                    └── awards.json
```

---

## MVP Scope (v0.1)

- [x] Project setup (Next.js + Tailwind + shadcn)
- [ ] Data pipeline: download + process Fjelstul data
- [ ] Home page with key stats
- [ ] Map explorer with stadium markers
- [ ] Tournament timeline browser
- [ ] Basic text search (Fuse.js)
- [ ] Tournament detail page
- [ ] Team profile page

## Post-MVP (v0.2+)

- [ ] Typesense integration for advanced search
- [ ] AI generative UI with Claude (Vercel AI SDK)
- [ ] StatsBomb event data for tactical visualizations (shot maps, pass networks)
- [ ] Animated match replay (goals minute by minute)
- [ ] "On this day" historical moments
- [ ] Share/embed individual visualizations
- [ ] 2026 live data integration
