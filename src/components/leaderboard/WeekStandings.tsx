import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Trophy, Medal, Award } from 'lucide-react';
import { formatPoints, ordinalSuffix } from '@/lib/utils';

export function WeekStandings() {
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading) return <LoadingSpinner />;

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>No standings yet. Complete a round to see the leaderboard!</p>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Week-Long Standings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.playerId}
              className={`flex items-center justify-between p-4 rounded-lg ${
                entry.rank <= 3 ? 'bg-primary/5' : 'bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-[60px]">
                  {getRankIcon(entry.rank)}
                  <span className="font-bold text-lg">
                    {entry.isTied ? 'T-' : ''}{ordinalSuffix(entry.rank)}
                  </span>
                </div>
                
                <div>
                  <div className="font-semibold">{entry.playerName}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.roundsPlayed} {entry.roundsPlayed === 1 ? 'round' : 'rounds'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {formatPoints(entry.totalPoints)}
                </div>
                <div className="text-sm text-muted-foreground">points</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
