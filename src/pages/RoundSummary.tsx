import { useParams, Link } from 'react-router-dom';
import { useRound } from '@/hooks/useRounds';
import { RoundResults } from '@/components/leaderboard/RoundResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function RoundSummary() {
  const { roundId } = useParams<{ roundId: string }>();
  const { data: round, isLoading } = useRound(roundId!);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!round) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-destructive">
          Round not found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Round Summary</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{round.course.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(round.round_date)}</span>
              </div>
            </div>
            <Badge variant={round.is_complete ? 'secondary' : 'default'}>
              Round {round.round_number}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!round.is_complete && (
            <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-sm text-orange-700 dark:text-orange-400">
                This round is not yet complete. Results shown are preliminary.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <RoundResults roundId={roundId!} />

      <div className="flex gap-4">
        <Link to="/" className="flex-1">
          <Button variant="outline" className="w-full">Back to Home</Button>
        </Link>
        <Link to="/leaderboard" className="flex-1">
          <Button className="w-full">View Full Standings</Button>
        </Link>
      </div>
    </div>
  );
}
