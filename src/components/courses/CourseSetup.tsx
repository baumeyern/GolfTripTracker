import { useState } from 'react';
import { useAddCourse } from '@/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function CourseSetup() {
  const [courseName, setCourseName] = useState('');
  const [numHoles, setNumHoles] = useState<9 | 18>(18);
  const [holes, setHoles] = useState<{ hole_number: number; par: number }[]>(
    Array.from({ length: 18 }, (_, i) => ({ hole_number: i + 1, par: 4 }))
  );
  
  const addCourse = useAddCourse();

  const updateHolePar = (index: number, par: number) => {
    const newHoles = [...holes];
    newHoles[index].par = par;
    setHoles(newHoles);
  };

  const handleNumHolesChange = (value: number) => {
    const holes9or18 = value as 9 | 18;
    setNumHoles(holes9or18);
    setHoles(
      Array.from({ length: holes9or18 }, (_, i) => ({
        hole_number: i + 1,
        par: holes[i]?.par || 4,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseName.trim()) {
      toast.error('Please enter a course name');
      return;
    }

    try {
      await addCourse.mutateAsync({
        name: courseName.trim(),
        num_holes: numHoles,
        holes: holes.slice(0, numHoles),
      });

      setCourseName('');
      setHoles(Array.from({ length: 18 }, (_, i) => ({ hole_number: i + 1, par: 4 })));
      toast.success('Course added successfully!');
    } catch (error) {
      toast.error('Failed to add course');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="courseName">Course Name *</Label>
            <Input
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Pebble Beach"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numHoles">Number of Holes</Label>
            <Select
              id="numHoles"
              value={numHoles.toString()}
              onChange={(e) => handleNumHolesChange(parseInt(e.target.value))}
            >
              <option value="9">9 Holes</option>
              <option value="18">18 Holes</option>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Par for Each Hole</Label>
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
              {holes.slice(0, numHoles).map((hole, index) => (
                <div key={hole.hole_number} className="space-y-1">
                  <Label htmlFor={`hole-${index}`} className="text-xs">
                    #{hole.hole_number}
                  </Label>
                  <Select
                    id={`hole-${index}`}
                    value={hole.par.toString()}
                    onChange={(e) => updateHolePar(index, parseInt(e.target.value))}
                  >
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Select>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Total Par: {holes.slice(0, numHoles).reduce((sum, h) => sum + h.par, 0)}
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={addCourse.isPending}>
            {addCourse.isPending ? 'Adding...' : 'Add Course'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
