import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Score, RoundAchievement } from '@/types';

export function useRoundScores(roundId: string) {
  return useQuery({
    queryKey: ['scores', 'round', roundId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scores')
        .select('*, hole:holes(*), player:players(*)')
        .eq('round_id', roundId);
      
      if (error) throw error;
      return data as Score[];
    },
    enabled: !!roundId,
  });
}

export function usePlayerRoundScores(roundId: string, playerId: string) {
  return useQuery({
    queryKey: ['scores', 'round', roundId, 'player', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scores')
        .select('*, hole:holes(*)')
        .eq('round_id', roundId)
        .eq('player_id', playerId)
        .order('hole.hole_number');
      
      if (error) throw error;
      return data as Score[];
    },
    enabled: !!roundId && !!playerId,
  });
}

export function useUpsertScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (score: {
      round_id: string;
      player_id: string;
      hole_id: string;
      strokes: number;
      fairway_hit: boolean;
      gir: boolean;
    }) => {
      const { data, error } = await supabase
        .from('scores')
        .upsert(score, {
          onConflict: 'round_id,player_id,hole_id',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Score;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['scores', 'round', variables.round_id] 
      });
    },
  });
}

export function useRoundAchievements(roundId: string) {
  return useQuery({
    queryKey: ['achievements', 'round', roundId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('round_achievements')
        .select('*')
        .eq('round_id', roundId);
      
      if (error) throw error;
      return data as RoundAchievement[];
    },
    enabled: !!roundId,
  });
}

export function useUpsertAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievement: {
      round_id: string;
      hole_id: string;
      player_id: string;
      achievement_type: 'closest_to_pin' | 'longest_drive';
    }) => {
      const { data, error } = await supabase
        .from('round_achievements')
        .upsert(achievement, {
          onConflict: 'round_id,hole_id,achievement_type',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as RoundAchievement;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['achievements', 'round', variables.round_id] 
      });
    },
  });
}

export function useDeleteAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('round_achievements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}
