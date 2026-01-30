import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Minus, Plus } from 'lucide-react';
import { Hole } from '@/types';
import { getScoreLabel, getScoreColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface HoleScoreProps {
  hole: Hole;
  initialStrokes?: number;
  initialFairwayHit?: boolean;
  initialGir?: boolean;
  onUpdate: (strokes: number, fairwayHit: boolean, gir: boolean) => void;
}

export function HoleScore({
  hole,
  initialStrokes,
  initialFairwayHit = false,
  initialGir = false,
  onUpdate,
}: HoleScoreProps) {
  const [strokes, setStrokes] = useState(initialStrokes || hole.par);
  const [fairwayHit, setFairwayHit] = useState(initialFairwayHit);
  const [gir, setGir] = useState(initialGir);

  useEffect(() => {
    setStrokes(initialStrokes || hole.par);
    setFairwayHit(initialFairwayHit);
    setGir(initialGir);
  }, [hole, initialStrokes, initialFairwayHit, initialGir]);

  const handleStrokesChange = (newStrokes: number) => {
    if (newStrokes < 1) return;
    setStrokes(newStrokes);
    onUpdate(newStrokes, fairwayHit, gir);
  };

  const handleFairwayChange = (checked: boolean) => {
    setFairwayHit(checked);
    onUpdate(strokes, checked, gir);
  };

  const handleGirChange = (checked: boolean) => {
    setGir(checked);
    onUpdate(strokes, fairwayHit, checked);
  };

  const scoreLabel = getScoreLabel(strokes, hole.par);
  const scoreColor = getScoreColor(strokes, hole.par);

  // Show fairway option only on par 4s and 5s
  const showFairway = hole.par >= 4;

  return (
    <div className="space-y-6">
      {/* Stroke counter */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="xl"
            onClick={() => handleStrokesChange(strokes - 1)}
            disabled={strokes <= 1}
            className="h-16 w-16 rounded-full"
          >
            <Minus className="h-6 w-6" />
          </Button>
          
          <div className="text-center min-w-[120px]">
            <div className={cn('text-5xl font-bold', scoreColor)}>
              {strokes}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {scoreLabel}
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="xl"
            onClick={() => handleStrokesChange(strokes + 1)}
            className="h-16 w-16 rounded-full"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Quick score buttons */}
        <div className="flex gap-2">
          {[hole.par - 1, hole.par, hole.par + 1, hole.par + 2].map((score) => (
            <Button
              key={score}
              type="button"
              variant={strokes === score ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStrokesChange(score)}
            >
              {score}
            </Button>
          ))}
        </div>
      </div>

      {/* Fairway and GIR toggles */}
      <div className="space-y-4 pt-4 border-t">
        {showFairway && (
          <div className="flex items-center justify-between">
            <Label className="text-base">
              Fairway Hit
            </Label>
            <Switch
              checked={fairwayHit}
              onCheckedChange={handleFairwayChange}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Label className="text-base">
            Green in Regulation
          </Label>
          <Switch
            checked={gir}
            onCheckedChange={handleGirChange}
          />
        </div>
      </div>
    </div>
  );
}
