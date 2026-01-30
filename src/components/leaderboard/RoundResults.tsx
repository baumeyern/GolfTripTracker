import { useRoundResults } from '@/hooks/useLeaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PointsBreakdown } from './PointsBreakdown';
import { formatScoreToPar, formatPoints, ordinalSuffix } from '@/lib/utils';

interface RoundResultsProps {
  roundId: string;
}

export function RoundResults({ roundId }: RoundResultsProps) {
  const { data: results, isLoading } = useRoundResults(roundId);

  if (isLoading) return <LoadingSpinner />;

  if (!results || results.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>No results yet. Complete the round to see results!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Round Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.playerId} className="space-y-2">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-base font-bold">
                    {ordinalSuffix(result.rank)}
                  </Badge>
                  
                  <div>
                    <div className="font-semibold text-lg">{result.playerName}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.totalStrokes} strokes ({formatScoreToPar(result.totalStrokes, result.totalStrokes - result.scoreToPar)})
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatPoints(result.points.total)}
                  </div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>
              
              <PointsBreakdown points={result.points} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
