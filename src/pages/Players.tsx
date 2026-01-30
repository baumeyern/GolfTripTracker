import { PlayerList } from '@/components/players/PlayerList';
import { AddPlayerForm } from '@/components/players/AddPlayerForm';

export function Players() {
  return (
    <div className="space-y-8 pb-20 md:pb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Players</h1>
        <p className="text-muted-foreground">
          Manage your golf trip participants
        </p>
      </div>

      <AddPlayerForm />

      <div>
        <h2 className="text-xl font-semibold mb-4">All Players</h2>
        <PlayerList />
      </div>
    </div>
  );
}
