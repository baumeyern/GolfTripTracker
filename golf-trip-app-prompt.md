# Golf Trip Scoring Application - Complete Implementation Prompt

## Overview
Build a production-ready React web application for tracking golf scores and standings across a multi-round golf trip. The app should be modern, mobile-first (golfers will use phones on the course), and delightfully simple to use.

## Tech Stack
- **Frontend**: React 18+ with TypeScript, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, Auth, Row Level Security)
- **Deployment**: Vercel
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router v6

## Database Schema (Supabase)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  nickname TEXT,
  handicap INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  num_holes INTEGER DEFAULT 18,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Holes table (par info for each hole)
CREATE TABLE holes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  hole_number INTEGER NOT NULL,
  par INTEGER NOT NULL CHECK (par >= 3 AND par <= 5),
  is_par3 BOOLEAN GENERATED ALWAYS AS (par = 3) STORED,
  is_par5 BOOLEAN GENERATED ALWAYS AS (par = 5) STORED,
  UNIQUE(course_id, hole_number)
);

-- Rounds table
CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  round_date DATE NOT NULL DEFAULT CURRENT_DATE,
  round_number INTEGER NOT NULL, -- 1, 2, 3, etc. for the trip
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scores table (per player, per hole, per round)
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  hole_id UUID REFERENCES holes(id) ON DELETE CASCADE,
  strokes INTEGER NOT NULL CHECK (strokes >= 1),
  fairway_hit BOOLEAN DEFAULT FALSE, -- only applicable for par 4/5
  gir BOOLEAN DEFAULT FALSE, -- green in regulation
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(round_id, player_id, hole_id)
);

-- Special achievements per round (closest to pin, longest drive)
CREATE TABLE round_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
  hole_id UUID REFERENCES holes(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('closest_to_pin', 'longest_drive')),
  UNIQUE(round_id, hole_id, achievement_type)
);

-- Create indexes for performance
CREATE INDEX idx_scores_round ON scores(round_id);
CREATE INDEX idx_scores_player ON scores(player_id);
CREATE INDEX idx_holes_course ON holes(course_id);
CREATE INDEX idx_rounds_date ON rounds(round_date);

-- Row Level Security (keep it simple - no auth, open access for trip)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE holes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE round_achievements ENABLE ROW LEVEL SECURITY;

-- Allow all operations (no auth for simplicity - it's a friends trip app)
CREATE POLICY "Allow all" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON holes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON rounds FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON round_achievements FOR ALL USING (true) WITH CHECK (true);
```

## Scoring System Logic

### Per-Round Placement Points
Calculate total strokes for each player in a round, then award:
- **1st place**: 10 pts
- **2nd place**: 8 pts  
- **3rd place**: 6 pts
- **4th place**: 4 pts
- **5th+ place**: 2 pts (handle groups larger than 4)

Handle ties by averaging: if two players tie for 1st, they each get (10+8)/2 = 9 pts

### Bonus Points (per round)
- **Birdie** (1 under par): +1 pt each
- **Eagle** (2 under par): +4 pts each (this is IN ADDITION to birdie, so eagle = +5 total)
- **Closest to Pin** on any par 3: +1 pt (one winner per par 3 hole)
- **Longest Drive** on any par 5: +1 pt (one winner per par 5 hole)
- **Most Fairways Hit** in round: +1 pt (one winner, ties split)
- **Most GIRs** in round: +1 pt (one winner, ties split)

### Week-Long Standings
Sum all points from all rounds. Display running leaderboard.

## Application Structure

```
src/
├── components/
│   ├── ui/                    # shadcn components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileNav.tsx
│   ├── players/
│   │   ├── PlayerList.tsx
│   │   ├── PlayerCard.tsx
│   │   └── AddPlayerForm.tsx
│   ├── courses/
│   │   ├── CourseSetup.tsx
│   │   └── HoleEditor.tsx
│   ├── scoring/
│   │   ├── Scorecard.tsx       # Main scoring interface
│   │   ├── HoleScore.tsx       # Individual hole input
│   │   ├── QuickScoreInput.tsx # Mobile-optimized +/- buttons
│   │   └── AchievementPicker.tsx
│   ├── leaderboard/
│   │   ├── WeekStandings.tsx   # Overall trip leaderboard
│   │   ├── RoundResults.tsx    # Single round breakdown
│   │   └── PointsBreakdown.tsx # Detailed points explanation
│   └── common/
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── hooks/
│   ├── useSupabase.ts
│   ├── usePlayers.ts
│   ├── useRounds.ts
│   ├── useScores.ts
│   └── useLeaderboard.ts
├── lib/
│   ├── supabase.ts            # Supabase client
│   ├── scoring.ts             # Points calculation logic
│   └── utils.ts
├── pages/
│   ├── Home.tsx               # Dashboard with standings
│   ├── Players.tsx            # Manage players
│   ├── Courses.tsx            # Manage courses
│   ├── NewRound.tsx           # Start a new round
│   ├── ScoreRound.tsx         # Active scoring page
│   ├── RoundSummary.tsx       # Post-round breakdown
│   └── Leaderboard.tsx        # Full standings detail
├── types/
│   └── index.ts               # TypeScript interfaces
├── App.tsx
└── main.tsx
```

## Key Components Specifications

### 1. Scorecard.tsx (Most Critical Component)
Mobile-first design for entering scores on the course:
- Large touch targets (minimum 44px)
- Swipe between holes
- Current hole prominently displayed
- Quick +/- buttons for stroke entry (not text input)
- Toggle switches for fairway hit / GIR
- Visual indicators for birdie/eagle/bogey (color coding)
- Auto-save on each input (optimistic updates)
- Offline capability consideration (queue updates)

```tsx
// Hole scoring should look like:
// ┌─────────────────────────────────┐
// │  Hole 7 • Par 4                 │
// │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
// │                                 │
// │  Player: Nick                   │
// │  ┌─────┬─────────┬─────┐       │
// │  │  -  │    4    │  +  │       │
// │  └─────┴─────────┴─────┘       │
// │                                 │
// │  ☑ Fairway Hit   ☑ GIR         │
// │                                 │
// │  [← Prev]            [Next →]  │
// └─────────────────────────────────┘
```

### 2. WeekStandings.tsx
- Sorted leaderboard with total points
- Each player row shows: rank, name, total points, rounds played
- Expandable to show points breakdown by category
- Visual trophy/medal icons for top 3
- Highlight point changes from latest round

### 3. RoundResults.tsx
After completing a round, show:
- Final stroke totals and placement
- Points earned breakdown (placement + birdies + eagles + bonuses)
- Achievements (closest to pin, longest drive winners)
- Fairway % and GIR % stats
- Comparison to previous rounds

### 4. AchievementPicker.tsx
For selecting closest to pin and longest drive winners:
- Only appears on appropriate holes (par 3s for CTP, par 5s for LD)
- Dropdown or button group to select winner
- Can be edited until round is finalized

## UI/UX Requirements

### Design System
- Use shadcn/ui components throughout
- Color scheme: Golf green primary (#2D5A27), cream/off-white backgrounds
- Dark mode support
- Consistent 8px spacing grid

### Mobile-First Considerations
- Bottom navigation bar for main sections
- Large touch targets everywhere
- Horizontal swipe for hole navigation
- Pull-to-refresh for data sync
- Toast notifications for saves/errors

### Animations
- Smooth transitions between holes
- Celebratory animation on birdie/eagle entry
- Leaderboard position change animations
- Skeleton loaders for data fetching

## Points Calculation Implementation

```typescript
// lib/scoring.ts

interface RoundScores {
  playerId: string;
  totalStrokes: number;
  birdies: number;
  eagles: number;
  fairwaysHit: number;
  totalFairways: number; // par 4s and 5s
  girs: number;
  totalHoles: number;
}

interface RoundAchievements {
  closestToPinWinners: { holeId: string; playerId: string }[];
  longestDriveWinners: { holeId: string; playerId: string }[];
}

export function calculateRoundPoints(
  scores: RoundScores[],
  achievements: RoundAchievements
): Map<string, PointsBreakdown> {
  const results = new Map<string, PointsBreakdown>();
  
  // Sort by total strokes (ascending - lower is better)
  const sorted = [...scores].sort((a, b) => a.totalStrokes - b.totalStrokes);
  
  // Calculate placement points with tie handling
  const placementPoints = [10, 8, 6, 4, 2]; // 5th+ gets 2
  let position = 0;
  
  while (position < sorted.length) {
    // Find all players tied at this position
    const currentStrokes = sorted[position].totalStrokes;
    const tiedPlayers = sorted.filter(s => s.totalStrokes === currentStrokes);
    
    // Average the points for tied positions
    const positionsOccupied = tiedPlayers.length;
    const pointsToAverage = placementPoints
      .slice(position, position + positionsOccupied)
      .reduce((a, b) => a + (b ?? 2), 0);
    const avgPoints = pointsToAverage / positionsOccupied;
    
    for (const player of tiedPlayers) {
      const breakdown: PointsBreakdown = {
        placement: avgPoints,
        birdies: player.birdies * 1,
        eagles: player.eagles * 4, // Additional to birdie
        closestToPin: achievements.closestToPinWinners
          .filter(a => a.playerId === player.playerId).length * 1,
        longestDrive: achievements.longestDriveWinners
          .filter(a => a.playerId === player.playerId).length * 1,
        mostFairways: 0, // Calculated below
        mostGirs: 0,     // Calculated below
        total: 0         // Summed at end
      };
      results.set(player.playerId, breakdown);
    }
    
    position += positionsOccupied;
  }
  
  // Most fairways hit bonus
  const maxFairways = Math.max(...scores.map(s => s.fairwaysHit));
  const fairwayWinners = scores.filter(s => s.fairwaysHit === maxFairways);
  const fairwayBonus = 1 / fairwayWinners.length;
  fairwayWinners.forEach(w => {
    const breakdown = results.get(w.playerId)!;
    breakdown.mostFairways = fairwayBonus;
  });
  
  // Most GIRs bonus
  const maxGirs = Math.max(...scores.map(s => s.girs));
  const girWinners = scores.filter(s => s.girs === maxGirs);
  const girBonus = 1 / girWinners.length;
  girWinners.forEach(w => {
    const breakdown = results.get(w.playerId)!;
    breakdown.mostGirs = girBonus;
  });
  
  // Calculate totals
  results.forEach((breakdown, playerId) => {
    breakdown.total = 
      breakdown.placement +
      breakdown.birdies +
      breakdown.eagles +
      breakdown.closestToPin +
      breakdown.longestDrive +
      breakdown.mostFairways +
      breakdown.mostGirs;
  });
  
  return results;
}

interface PointsBreakdown {
  placement: number;
  birdies: number;
  eagles: number;
  closestToPin: number;
  longestDrive: number;
  mostFairways: number;
  mostGirs: number;
  total: number;
}
```

## Environment Setup

```env
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Configuration

### vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Feature Checklist
- [ ] Player management (add, edit, delete players)
- [ ] Course setup (name, holes with pars)
- [ ] Start new round (select course, select players)
- [ ] Live scoring with real-time sync
- [ ] Fairway hit / GIR tracking per hole
- [ ] Closest to pin selection on par 3s
- [ ] Longest drive selection on par 5s
- [ ] Round completion with points calculation
- [ ] Round summary with full breakdown
- [ ] Week-long leaderboard
- [ ] Individual player stats page
- [ ] Round history view
- [ ] Mobile-responsive design
- [ ] Offline score entry (sync when back online)

## Sample Seed Data for Testing

```sql
-- Insert test players
INSERT INTO players (name, nickname, handicap) VALUES
  ('Nick', 'Slick Nick', 12),
  ('Mike', 'Big Mike', 18),
  ('Tom', 'Tommy Two-Putt', 15),
  ('Dave', 'Divot Dave', 20);

-- Insert a test course (Pebble Beach style)
INSERT INTO courses (name, num_holes) VALUES ('Pebble Beach', 18);

-- Get the course ID and insert holes
DO $$
DECLARE
  course_uuid UUID;
  pars INTEGER[] := ARRAY[4, 5, 4, 4, 3, 5, 3, 4, 4, 4, 4, 3, 4, 5, 4, 3, 4, 5];
BEGIN
  SELECT id INTO course_uuid FROM courses WHERE name = 'Pebble Beach';
  
  FOR i IN 1..18 LOOP
    INSERT INTO holes (course_id, hole_number, par)
    VALUES (course_uuid, i, pars[i]);
  END LOOP;
END $$;
```

## Critical Implementation Notes

1. **Real-time subscriptions**: Use Supabase real-time for live score updates so all players see changes instantly

2. **Optimistic updates**: Update UI immediately on score entry, revert on error

3. **Input validation**: Strokes must be >= 1, prevent accidental double-entries

4. **Tie-breaking display**: When players are tied in standings, show them at the same rank (e.g., two players at "T-2")

5. **Round state management**: Track round status (in_progress, complete) to prevent editing finished rounds without explicit unlock

6. **Score relative to par**: Display scores as +/- par (e.g., "+3" instead of "75" for quick comprehension)

7. **Accessibility**: Ensure color isn't the only indicator (use icons too for birdie/eagle/bogey)

## Build Commands

```bash
# Install dependencies
npm install

# Run development server  
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Dependencies to Install

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "@tanstack/react-query": "^5.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "^0.x",
    "date-fns": "^3.x",
    "framer-motion": "^11.x",
    "sonner": "^1.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "tailwindcss": "^3.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x"
  }
}
```

---

**IMPORTANT**: Generate ALL files completely. Do not use placeholders or "// implement later" comments. Every component should be fully functional. The app should work end-to-end after initial setup of Supabase tables.
