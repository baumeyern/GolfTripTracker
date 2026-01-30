import { useState, useEffect, useRef } from 'react';
import { HoleScore } from './HoleScore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Hole, Player, Score } from '@/types';
import { useUpsertScore } from '@/hooks/useScores';
import { toast } from 'sonner';

interface ScorecardProps {
  roundId: string;
  player: Player;
  holes: Hole[];
  existingScores: Score[];
}

export function Scorecard({ roundId, player, holes, existingScores }: ScorecardProps) {
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
  const upsertScore = useUpsertScore();
  const hasInitialized = useRef(false);
  const lastPlayerId = useRef(player.id);

  const currentHole = holes[currentHoleIndex];
  const currentScore = existingScores.find(s => s.hole_id === currentHole?.id);

  useEffect(() => {
    // Reset initialization when player changes
    if (lastPlayerId.current !== player.id) {
      hasInitialized.current = false;
      lastPlayerId.current = player.id;
    }

    // Auto-advance to first incomplete hole only on initial load or player change
    if (!hasInitialized.current && holes.length > 0) {
      const firstIncomplete = holes.findIndex(h => 
        !existingScores.some(s => s.hole_id === h.id)
      );
      if (firstIncomplete !== -1) {
        setCurrentHoleIndex(firstIncomplete);
      }
      hasInitialized.current = true;
    }
  }, [player.id, holes, existingScores]);

  const handleScoreUpdate = async (
    strokes: number,
    fairwayHit: boolean,
    gir: boolean
  ) => {
    try {
      await upsertScore.mutateAsync({
        round_id: roundId,
        player_id: player.id,
        hole_id: currentHole.id,
        strokes,
        fairway_hit: fairwayHit,
        gir,
      });
      
      // Celebrate birdies and eagles
      const scoreToPar = strokes - currentHole.par;
      if (scoreToPar <= -1) {
        toast.success(scoreToPar <= -2 ? '🦅 Eagle!' : '🐦 Birdie!', {
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error('Failed to save score');
    }
  };

  const goToPrevHole = () => {
    if (currentHoleIndex > 0) {
      setCurrentHoleIndex(currentHoleIndex - 1);
    }
  };

  const goToNextHole = () => {
    if (currentHoleIndex < holes.length - 1) {
      setCurrentHoleIndex(currentHoleIndex + 1);
    }
  };

  const totalStrokes = existingScores.reduce((sum, s) => sum + s.strokes, 0);
  const totalPar = holes.slice(0, existingScores.length).reduce((sum, h) => sum + h.par, 0);
  const scoreToPar = totalStrokes - totalPar;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{player.name}</span>
            <span className="text-lg">
              {existingScores.length > 0 && (
                <span className={scoreToPar === 0 ? 'text-gray-700' : scoreToPar > 0 ? 'text-blue-500' : 'text-red-500'}>
                  {scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar === 0 ? 'E' : scoreToPar}
                </span>
              )}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevHole}
              disabled={currentHoleIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <div className="text-2xl font-bold">Hole {currentHole?.hole_number}</div>
              <div className="text-muted-foreground">Par {currentHole?.par}</div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextHole}
              disabled={currentHoleIndex === holes.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <HoleScore
            hole={currentHole}
            initialStrokes={currentScore?.strokes}
            initialFairwayHit={currentScore?.fairway_hit || false}
            initialGir={currentScore?.gir || false}
            onUpdate={handleScoreUpdate}
          />

          {/* Progress indicator */}
          <div className="mt-6 grid grid-cols-6 sm:grid-cols-9 gap-1.5 sm:gap-2">
            {holes.map((hole, index) => {
              const score = existingScores.find(s => s.hole_id === hole.id);
              const hasScore = !!score;
              return (
                <button
                  key={hole.id}
                  onClick={() => setCurrentHoleIndex(index)}
                  className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all min-h-[48px] ${
                    index === currentHoleIndex
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                      : hasScore
                      ? 'bg-primary/20 hover:bg-primary/30'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <div className="text-xs font-medium leading-none">{hole.hole_number}</div>
                  {hasScore && score && (
                    <div className="text-sm font-bold leading-none mt-1">{score.strokes}</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Stats Summary */}
          {existingScores.length > 0 && (
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Fairways:</span>
                <span className="font-semibold">
                  {existingScores.filter(s => s.fairway_hit).length} / {existingScores.filter(s => {
                    const hole = holes.find(h => h.id === s.hole_id);
                    return hole && hole.par >= 4;
                  }).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">GIRs:</span>
                <span className="font-semibold">
                  {existingScores.filter(s => s.gir).length} / {existingScores.length}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
