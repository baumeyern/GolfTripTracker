import { Player } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, User } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onDelete: () => void;
}

export function PlayerCard({ player, onDelete }: PlayerCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{player.name}</h3>
              {player.nickname && (
                <p className="text-sm text-muted-foreground">
                  "{player.nickname}"
                </p>
              )}
            </div>
          </div>
          <Badge variant="secondary">HCP: {player.handicap}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
