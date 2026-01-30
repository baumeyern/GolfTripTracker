import { useCourses, useDeleteCourse } from '@/hooks/useCourses';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function CourseList() {
  const { data: courses, isLoading } = useCourses();
  const deleteCourse = useDeleteCourse();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will delete all associated rounds and scores.')) return;
    
    try {
      await deleteCourse.mutateAsync(id);
      toast.success('Course deleted successfully');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No courses yet. Add your first course to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {course.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{course.num_holes} Holes</Badge>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(course.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
