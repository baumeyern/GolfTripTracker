import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Home } from '@/pages/Home';
import { Players } from '@/pages/Players';
import { Courses } from '@/pages/Courses';
import { NewRound } from '@/pages/NewRound';
import { ScoreRound } from '@/pages/ScoreRound';
import { RoundSummary } from '@/pages/RoundSummary';
import { Leaderboard } from '@/pages/Leaderboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Header />
            <div className="hidden md:block">
              <Navigation />
            </div>
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/players" element={<Players />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/new-round" element={<NewRound />} />
                <Route path="/score-round/:roundId" element={<ScoreRound />} />
                <Route path="/round-summary/:roundId" element={<RoundSummary />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Routes>
            </main>
            <div className="md:hidden">
              <Navigation />
            </div>
          </div>
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
