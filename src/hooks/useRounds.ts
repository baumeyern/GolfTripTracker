import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Round, Course, Hole } from '@/types';

export function useRounds() {
  return useQuery({
    queryKey: ['rounds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rounds')
        .select('*, course:courses(*)')
        .order('round_number', { ascending: false });
      
      if (error) throw error;
      return data as (Round & { course: Course })[];
    },
  });
}

export function useRound(id: string) {
  return useQuery({
    queryKey: ['rounds', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rounds')
        .select('*, course:courses(*, holes:holes(*))')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Round & { course: Course & { holes: Hole[] } };
    },
    enabled: !!id,
  });
}

export function useCreateRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (round: { 
      course_id: string; 
      round_date: string; 
      round_number: number;
    }) => {
      const { data, error } = await supabase
        .from('rounds')
        .insert([round])
        .select('*, course:courses(*, holes:holes(*))')
        .single();
      
      if (error) throw error;
      return data as Round & { course: Course & { holes: Hole[] } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
    },
  });
}

export function useCompleteRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roundId: string) => {
      const { data, error } = await supabase
        .from('rounds')
        .update({ is_complete: true })
        .eq('id', roundId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Round;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
    },
  });
}

export function useDeleteRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rounds')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      queryClient.invalidateQueries({ queryKey: ['scores'] });
    },
  });
}
