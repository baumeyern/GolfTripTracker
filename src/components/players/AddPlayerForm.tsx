import { useState } from 'react';
import { useAddPlayer } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function AddPlayerForm() {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [handicap, setHandicap] = useState('');
  
  const addPlayer = useAddPlayer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a player name');
      return;
    }

    try {
      await addPlayer.mutateAsync({
        name: name.trim(),
        nickname: nickname.trim() || null,
        handicap: parseInt(handicap) || 0,
        avatar_url: null,
      });

      setName('');
      setNickname('');
      setHandicap('');
      toast.success('Player added successfully!');
    } catch (error) {
      toast.error('Failed to add player');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Player</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Johnny"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="handicap">Handicap</Label>
            <Input
              id="handicap"
              type="number"
              value={handicap}
              onChange={(e) => setHandicap(e.target.value)}
              placeholder="0"
              min="0"
              max="54"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={addPlayer.isPending}>
            {addPlayer.isPending ? 'Adding...' : 'Add Player'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
