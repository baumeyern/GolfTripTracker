# Golf Trip Scoring Application

A modern, mobile-first React web application for tracking golf scores and standings across a multi-round golf trip.

## Features

- 📊 **Real-time Scoring** - Track scores hole-by-hole with mobile-optimized interface
- 🏆 **Points System** - Comprehensive scoring with placement points, birdies, eagles, and bonuses
- 📱 **Mobile-First Design** - Optimized for scoring on the course
- 🎯 **Achievements** - Track closest to pin and longest drive
- 📈 **Live Leaderboard** - Week-long standings with detailed breakdowns
- ⚡ **Fast & Responsive** - Built with modern React and Vite

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
cd GolfTrip
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under "API".

4. Set up the database:

The SQL schema has already been run in your Supabase project. If you need to reset or recreate the tables, you can find the complete schema in `golf-trip-app-prompt.md`.

5. (Optional) Add sample data:

You can add test players and courses using the sample SQL at the bottom of the prompt file, or use the UI to add them.

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage

### Setting Up a Trip

1. **Add Players** - Go to the Players page and add all trip participants
2. **Add Courses** - Go to the Courses page and set up courses with hole-by-hole pars
3. **Start a Round** - Use "New Round" to begin scoring

### During a Round

1. Select the course and date
2. Choose a player to score
3. Use the mobile-optimized scorecard to enter strokes, fairways, and GIRs
4. Mark achievements (closest to pin, longest drive)
5. Complete the round to finalize results

### Viewing Results

- **Home Dashboard** - See latest standings and recent rounds
- **Leaderboard** - View detailed week-long standings
- **Round Summary** - Review individual round results with points breakdown

## Scoring System

### Placement Points (per round)
- 1st place: 10 pts
- 2nd place: 8 pts
- 3rd place: 6 pts
- 4th place: 4 pts
- 5th+ place: 2 pts

*Ties are handled by averaging points*

### Bonus Points (per round)
- Birdie: +1 pt each
- Eagle: +5 pts each (includes birdie bonus)
- Closest to Pin (par 3s): +1 pt per hole
- Longest Drive (par 5s): +1 pt per hole
- Most Fairways Hit: +1 pt (shared if tied)
- Most GIRs: +1 pt (shared if tied)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

The `vercel.json` configuration is already included for proper routing.

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn components
│   ├── layout/          # Header, Navigation
│   ├── players/         # Player management
│   ├── courses/         # Course setup
│   ├── scoring/         # Scorecard & scoring UI
│   ├── leaderboard/     # Standings & results
│   └── common/          # Shared components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities & Supabase client
├── pages/               # Route pages
├── types/               # TypeScript types
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## Contributing

This is a personal golf trip app, but feel free to fork and customize for your own trips!

## License

MIT

## Support

For issues or questions, please open an issue on the repository.

---

Built with ⛳ for golfers, by golfers.
