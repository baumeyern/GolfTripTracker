# Golf Trip App - Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including React, TypeScript, TailwindCSS, Supabase, and more.

## Step 2: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy your project URL and anon/public key
4. Update the `.env.local` file with your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Verify Database

The database tables should already be created since you mentioned running the SQL queries. 

To verify, check your Supabase project that these tables exist:
- `players`
- `courses`
- `holes`
- `rounds`
- `scores`
- `round_achievements`

## Step 4: Run the Application

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## Step 5: Add Initial Data

1. Navigate to the **Players** page
2. Add your golf trip participants (e.g., Nick, Mike, Tom, Dave)
3. Navigate to the **Courses** page
4. Add a course with hole-by-hole par information
5. Go to **New Round** to start scoring!

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the root directory
- Verify the variable names start with `VITE_`
- Restart the dev server after adding/changing env variables

### Database connection errors
- Check that Row Level Security (RLS) policies are enabled and set to "Allow all"
- Verify the anon key has proper permissions
- Check Supabase project status

### Build errors
- Run `npm install` again to ensure all dependencies are installed
- Clear node_modules and reinstall if needed: `rm -rf node_modules && npm install`

## Features to Try

### Scoring Flow
1. Click "Start New Round"
2. Select course and date
3. In the scoring page, select a player
4. Use +/- buttons to enter scores for each hole
5. Toggle fairway hit and GIR options
6. Swipe or use arrows to navigate between holes
7. Switch to "Achievements" to mark closest to pin and longest drive winners
8. Click "Complete Round" when finished

### Viewing Results
- Home page shows current standings and recent rounds
- Leaderboard page shows detailed week-long standings
- Click any completed round to see the full breakdown of points

## Mobile Usage

The app is optimized for mobile devices! You can:
- Use it on your phone during the round
- Large touch targets make it easy to tap while wearing a glove
- Bottom navigation for quick access to all features
- Works great in landscape or portrait mode

## Next Steps

Consider deploying to Vercel for easy access by all players:
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel settings
4. Deploy!

Everyone on the trip can then access the same live leaderboard.

---

Happy golfing! ⛳
