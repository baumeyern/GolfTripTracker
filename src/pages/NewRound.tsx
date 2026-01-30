import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { usePlayers } from '@/hooks/usePlayers';
import { useRounds, useCreateRound } from '@/hooks/useRounds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';

export function NewRound() {
  const navigate = useNavigate();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: players, isLoading: playersLoading } = usePlayers();
  const { data: existingRounds } = useRounds();
  const createRound = useCreateRound();

  const [courseId, setCourseId] = useState('');
  const [roundDate, setRoundDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const nextRoundNumber = (existingRounds?.length || 0) + 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId) {
      toast.error('Please select a course');
      return;
    }

    if (!players || players.length === 0) {
      toast.error('Please add players before starting a round');
      navigate('/players');
      return;
    }

    try {
      const round = await createRound.mutateAsync({
        course_id: courseId,
        round_date: roundDate,
        round_number: nextRoundNumber,
      });

      toast.success('Round created! Start scoring now.');
      navigate(`/score-round/${round.id}`);
    } catch (error) {
      toast.error('Failed to create round');
    }
  };

  if (coursesLoading || playersLoading) {
    return <LoadingSpinner />;
  }

  if (!courses || courses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">
            You need to add a course before starting a round.
          </p>
          <Button onClick={() => navigate('/courses')}>Add Course</Button>
        </CardContent>
      </Card>
    );
  }

  if (!players || players.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">
            You need to add players before starting a round.
          </p>
          <Button onClick={() => navigate('/players')}>Add Players</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 md:pb-8">
      <Card>
        <CardHeader>
          <CardTitle>Start New Round</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Select
                id="course"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                required
              >
                <option value="">Select a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.num_holes} holes)
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={roundDate}
                onChange={(e) => setRoundDate(e.target.value)}
                required
              />
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Round Number:</span> {nextRoundNumber}
              </p>
              <p className="text-sm mt-1">
                <span className="font-semibold">Players:</span>{' '}
                {players.map((p) => p.name).join(', ')}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={createRound.isPending}
            >
              {createRound.isPending ? 'Creating...' : 'Start Round'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
