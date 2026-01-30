import { usePlayers, useDeletePlayer } from '@/hooks/usePlayers';
import { PlayerCard } from './PlayerCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function PlayerList() {
  const { data: players, isLoading, error } = usePlayers();
  const deletePlayer = useDeletePlayer();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return;
    
    try {
      await deletePlayer.mutateAsync(id);
      toast.success('Player deleted successfully');
    } catch (error) {
      toast.error('Failed to delete player');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <span>Failed to load players</span>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No players yet. Add your first player to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onDelete={() => handleDelete(player.id)}
        />
      ))}
    </div>
  );
}
