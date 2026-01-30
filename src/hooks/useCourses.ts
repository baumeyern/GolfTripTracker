import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Course, Hole } from '@/types';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Course[];
    },
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, holes:holes(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Course & { holes: Hole[] };
    },
    enabled: !!id,
  });
}

export function useCourseHoles(courseId: string) {
  return useQuery({
    queryKey: ['courses', courseId, 'holes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('holes')
        .select('*')
        .eq('course_id', courseId)
        .order('hole_number');
      
      if (error) throw error;
      return data as Hole[];
    },
    enabled: !!courseId,
  });
}

export function useAddCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: { name: string; num_holes: number; holes: { hole_number: number; par: number }[] }) => {
      // Insert course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert([{ name: course.name, num_holes: course.num_holes }])
        .select()
        .single();
      
      if (courseError) throw courseError;

      // Insert holes
      const holesData = course.holes.map(hole => ({
        course_id: courseData.id,
        hole_number: hole.hole_number,
        par: hole.par,
      }));

      const { error: holesError } = await supabase
        .from('holes')
        .insert(holesData);
      
      if (holesError) throw holesError;

      return courseData as Course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
