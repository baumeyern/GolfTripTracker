import { WeekStandings } from '@/components/leaderboard/WeekStandings';
import { useRounds } from '@/hooks/useRounds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function Leaderboard() {
  const { data: rounds, isLoading } = useRounds();

  const completedRounds = rounds?.filter(r => r.is_complete) || [];

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          Overall standings and round history
        </p>
      </div>

      <WeekStandings />

      <Card>
        <CardHeader>
          <CardTitle>Completed Rounds</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : completedRounds.length > 0 ? (
            <div className="space-y-2">
              {completedRounds.map((round) => (
                <Link
                  key={round.id}
                  to={`/round-summary/${round.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {round.course?.name || 'Unknown Course'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(round.round_date)}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">Round {round.round_number}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No completed rounds yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
