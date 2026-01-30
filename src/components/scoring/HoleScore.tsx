import { useState, useEffect, useRef } from 'react';
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
  const lastAutoSave = useRef<{ holeId: string; hadScore: boolean } | null>(null);

  useEffect(() => {
    const hadScore = initialStrokes !== undefined;
    
    setStrokes(initialStrokes || hole.par);
    setFairwayHit(initialFairwayHit);
    setGir(initialGir);

    // Auto-save par when first viewing a hole without a score
    // Only auto-save if this is a new hole or if the score state changed from scored to unscored
    const shouldAutoSave = !hadScore && 
      (!lastAutoSave.current || 
       lastAutoSave.current.holeId !== hole.id || 
       lastAutoSave.current.hadScore !== hadScore);
    
    if (shouldAutoSave) {
      lastAutoSave.current = { holeId: hole.id, hadScore };
      onUpdate(hole.par, false, false);
    } else if (hadScore) {
      // Update the ref when a score exists so we know the state
      lastAutoSave.current = { holeId: hole.id, hadScore };
    }
  }, [hole.id, hole.par, initialStrokes, initialFairwayHit, initialGir]);

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
            onClick={() => handleStrokesChange(strokes - 1)}
            disabled={strokes <= 1}
            className="h-16 w-16 rounded-full p-0 flex items-center justify-center"
          >
            <Minus className="h-8 w-8" />
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
            onClick={() => handleStrokesChange(strokes + 1)}
            className="h-16 w-16 rounded-full p-0 flex items-center justify-center"
          >
            <Plus className="h-8 w-8" />
          </Button>
        </div>

        {/* Quick score buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          {[hole.par - 1, hole.par, hole.par + 1, hole.par + 2].map((score) => (
            <Button
              key={score}
              type="button"
              variant={strokes === score ? 'default' : 'outline'}
              onClick={() => handleStrokesChange(score)}
              className="h-12 min-w-[64px] text-xl font-bold px-4"
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
