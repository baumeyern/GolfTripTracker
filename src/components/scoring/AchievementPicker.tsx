import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Player, Hole, RoundAchievement } from '@/types';
import { useUpsertAchievement } from '@/hooks/useScores';
import { Trophy, Target } from 'lucide-react';
import { toast } from 'sonner';

interface AchievementPickerProps {
  roundId: string;
  holes: Hole[];
  players: Player[];
  existingAchievements: RoundAchievement[];
}

export function AchievementPicker({
  roundId,
  holes,
  players,
  existingAchievements,
}: AchievementPickerProps) {
  const upsertAchievement = useUpsertAchievement();

  const par3Holes = holes.filter(h => h.par === 3);
  const par5Holes = holes.filter(h => h.par === 5);

  const handleAchievementChange = async (
    holeId: string,
    playerId: string,
    type: 'closest_to_pin' | 'longest_drive'
  ) => {
    if (!playerId) return;

    try {
      await upsertAchievement.mutateAsync({
        round_id: roundId,
        hole_id: holeId,
        player_id: playerId,
        achievement_type: type,
      });
      toast.success('Achievement saved');
    } catch (error) {
      toast.error('Failed to save achievement');
    }
  };

  const getAchievementWinner = (holeId: string, type: string) => {
    return existingAchievements.find(
      a => a.hole_id === holeId && a.achievement_type === type
    )?.player_id || '';
  };

  return (
    <div className="space-y-6">
      {/* Closest to Pin */}
      {par3Holes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Closest to Pin (Par 3s)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {par3Holes.map(hole => (
              <div key={hole.id} className="space-y-2">
                <Label htmlFor={`ctp-${hole.id}`}>
                  Hole {hole.hole_number}
                  <Badge variant="secondary" className="ml-2">Par 3</Badge>
                </Label>
                <Select
                  id={`ctp-${hole.id}`}
                  value={getAchievementWinner(hole.id, 'closest_to_pin')}
                  onChange={(e) =>
                    handleAchievementChange(hole.id, e.target.value, 'closest_to_pin')
                  }
                >
                  <option value="">Select winner...</option>
                  {players.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Longest Drive */}
      {par5Holes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Longest Drive (Par 5s)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {par5Holes.map(hole => (
              <div key={hole.id} className="space-y-2">
                <Label htmlFor={`ld-${hole.id}`}>
                  Hole {hole.hole_number}
                  <Badge variant="secondary" className="ml-2">Par 5</Badge>
                </Label>
                <Select
                  id={`ld-${hole.id}`}
                  value={getAchievementWinner(hole.id, 'longest_drive')}
                  onChange={(e) =>
                    handleAchievementChange(hole.id, e.target.value, 'longest_drive')
                  }
                >
                  <option value="">Select winner...</option>
                  {players.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
