import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRound, useCompleteRound } from '@/hooks/useRounds';
import { usePlayers } from '@/hooks/usePlayers';
import { useRoundScores, useRoundAchievements } from '@/hooks/useScores';
import { Scorecard } from '@/components/scoring/Scorecard';
import { AchievementPicker } from '@/components/scoring/AchievementPicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export function ScoreRound() {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const { data: round, isLoading: roundLoading } = useRound(roundId!);
  const { data: players, isLoading: playersLoading } = usePlayers();
  const { data: scores } = useRoundScores(roundId!);
  const { data: achievements } = useRoundAchievements(roundId!);
  const completeRound = useCompleteRound();

  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);

  const selectedPlayer = players?.find(p => p.id === selectedPlayerId);
  const playerScores = scores?.filter(s => s.player_id === selectedPlayerId) || [];
  
  const holes = round?.course?.holes || [];
  const allScoresComplete = players?.every(player => 
    holes.every(hole => 
      scores?.some(s => s.player_id === player.id && s.hole_id === hole.id)
    )
  );

  const handleCompleteRound = async () => {
    if (!allScoresComplete) {
      if (!confirm('Not all scores are entered. Complete round anyway?')) {
        return;
      }
    }

    try {
      await completeRound.mutateAsync(roundId!);
      toast.success('Round completed!');
      navigate(`/round-summary/${roundId}`);
    } catch (error) {
      toast.error('Failed to complete round');
    }
  };

  if (roundLoading || playersLoading) {
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

  if (round.is_complete) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="mb-4">This round is complete!</p>
          <Button onClick={() => navigate(`/round-summary/${roundId}`)}>
            View Results
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Round Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <div className="text-2xl">{round.course.name}</div>
              <div className="text-sm font-normal text-muted-foreground">
                Round {round.round_number}
              </div>
            </div>
            {round.is_complete ? (
              <Badge variant="secondary">Complete</Badge>
            ) : (
              <Badge>In Progress</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player">Select Player to Score</Label>
              <Select
                id="player"
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
              >
                <option value="">Choose a player...</option>
                {players?.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={showAchievements ? 'secondary' : 'outline'}
                onClick={() => setShowAchievements(!showAchievements)}
                className="flex-1"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </Button>
              <Button
                variant="default"
                onClick={handleCompleteRound}
                disabled={completeRound.isPending}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Round
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Area */}
      {showAchievements ? (
        <AchievementPicker
          roundId={roundId!}
          holes={holes}
          players={players || []}
          existingAchievements={achievements || []}
        />
      ) : selectedPlayer ? (
        <Scorecard
          roundId={roundId!}
          player={selectedPlayer}
          holes={holes}
          existingScores={playerScores}
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Select a player to start scoring
          </CardContent>
        </Card>
      )}
    </div>
  );
}
