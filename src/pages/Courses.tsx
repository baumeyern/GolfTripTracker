import { CourseSetup } from '@/components/courses/CourseSetup';
import { CourseList } from '@/components/courses/CourseList';

export function Courses() {
  return (
    <div className="space-y-8 pb-20 md:pb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Courses</h1>
        <p className="text-muted-foreground">
          Add and manage golf courses for your trip
        </p>
      </div>

      <CourseSetup />

      <div>
        <h2 className="text-xl font-semibold mb-4">All Courses</h2>
        <CourseList />
      </div>
    </div>
  );
}
