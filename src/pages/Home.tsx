import { Link } from 'react-router-dom';
import { useRounds } from '@/hooks/useRounds';
import { WeekStandings } from '@/components/leaderboard/WeekStandings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Play, Calendar, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function Home() {
  const { data: rounds, isLoading } = useRounds();

  const activeRounds = rounds?.filter(r => !r.is_complete) || [];

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/new-round">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-semibold text-lg">Start New Round</h3>
                  <p className="text-sm text-muted-foreground">
                    Begin scoring a new round
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {activeRounds.length > 0 && (
          <Link to={`/score-round/${activeRounds[0].id}`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer border-primary">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="font-semibold text-lg">Continue Round</h3>
                    <p className="text-sm text-muted-foreground">
                      {activeRounds[0].course?.name || 'Active round'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Week Standings */}
      <WeekStandings />

      {/* Recent Rounds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Rounds
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : rounds && rounds.length > 0 ? (
            <div className="space-y-2">
              {rounds.slice(0, 5).map((round) => (
                <Link
                  key={round.id}
                  to={`/round-summary/${round.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      {round.is_complete ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-500" />
                      )}
                      <div>
                        <div className="font-semibold">
                          {round.course?.name || 'Unknown Course'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(round.round_date)}
                        </div>
                      </div>
                    </div>
                    <Badge variant={round.is_complete ? 'secondary' : 'default'}>
                      Round {round.round_number}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No rounds yet. Start your first round to begin!</p>
              <Button asChild className="mt-4">
                <Link to="/new-round">Start New Round</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
