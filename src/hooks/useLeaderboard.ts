import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { calculateRoundPoints, calculatePlayerRoundStats } from '@/lib/scoring';
import { 
  LeaderboardEntry, 
  PlayerRoundResult,
  RoundScores,
  RoundAchievementData,
  Score,
} from '@/types';

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      // Get all completed rounds
      const { data: rounds, error: roundsError } = await supabase
        .from('rounds')
        .select('id')
        .eq('is_complete', true);
      
      if (roundsError) throw roundsError;
      if (!rounds || rounds.length === 0) return [];

      const roundIds = rounds.map(r => r.id);

      // Get all players
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*');
      
      if (playersError) throw playersError;

      // Calculate points for each player across all rounds
      const playerPoints = new Map<string, number>();
      const playerRoundsPlayed = new Map<string, number>();

      for (const roundId of roundIds) {
        const points = await calculateRoundPointsForLeaderboard(roundId);
        points.forEach((pts, playerId) => {
          playerPoints.set(playerId, (playerPoints.get(playerId) || 0) + pts);
          playerRoundsPlayed.set(playerId, (playerRoundsPlayed.get(playerId) || 0) + 1);
        });
      }

      // Create leaderboard entries
      const entries: LeaderboardEntry[] = Array.from(playerPoints.entries()).map(
        ([playerId, totalPoints]) => {
          const player = players?.find(p => p.id === playerId);
          return {
            playerId,
            playerName: player?.name || 'Unknown',
            totalPoints,
            roundsPlayed: playerRoundsPlayed.get(playerId) || 0,
            rank: 0,
            isTied: false,
          };
        }
      );

      // Sort by points descending
      entries.sort((a, b) => b.totalPoints - a.totalPoints);

      // Assign ranks with tie handling
      let currentRank = 1;
      for (let i = 0; i < entries.length; i++) {
        if (i > 0 && entries[i].totalPoints === entries[i - 1].totalPoints) {
          entries[i].rank = entries[i - 1].rank;
          entries[i].isTied = true;
          entries[i - 1].isTied = true;
        } else {
          entries[i].rank = currentRank;
        }
        currentRank++;
      }

      return entries;
    },
  });
}

export function useRoundResults(roundId: string) {
  return useQuery({
    queryKey: ['round-results', roundId],
    queryFn: async () => {
      // Get round with course and holes
      const { data: round, error: roundError } = await supabase
        .from('rounds')
        .select('*, course:courses(*, holes:holes(*))')
        .eq('id', roundId)
        .single();
      
      if (roundError) throw roundError;

      const holes = round.course.holes;

      // Get all scores for this round
      const { data: scores, error: scoresError } = await supabase
        .from('scores')
        .select('*, player:players(*), hole:holes(*)')
        .eq('round_id', roundId);
      
      if (scoresError) throw scoresError;

      // Get achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('round_achievements')
        .select('*')
        .eq('round_id', roundId);
      
      if (achievementsError) throw achievementsError;

      // Group scores by player
      const playerScoresMap = new Map<string, Score[]>();
      scores?.forEach(score => {
        const existing = playerScoresMap.get(score.player_id) || [];
        playerScoresMap.set(score.player_id, [...existing, score]);
      });

      // Calculate stats for each player
      const roundScores: RoundScores[] = Array.from(playerScoresMap.entries()).map(
        ([playerId, playerScores]) => {
          const player = playerScores[0]?.player;
          const stats = calculatePlayerRoundStats(playerScores, holes);
          return {
            playerId,
            playerName: player?.name || 'Unknown',
            ...stats,
            totalHoles: holes.length,
          };
        }
      );

      // Prepare achievements data
      const achievementsData: RoundAchievementData = {
        closestToPinWinners: achievements
          ?.filter(a => a.achievement_type === 'closest_to_pin')
          .map(a => ({ holeId: a.hole_id, playerId: a.player_id })) || [],
        longestDriveWinners: achievements
          ?.filter(a => a.achievement_type === 'longest_drive')
          .map(a => ({ holeId: a.hole_id, playerId: a.player_id })) || [],
      };

      // Calculate points
      const pointsMap = calculateRoundPoints(roundScores, achievementsData);

      // Create results
      const results: PlayerRoundResult[] = roundScores.map(rs => {
        const points = pointsMap.get(rs.playerId)!;
        const totalPar = holes.reduce((sum: number, h) => sum + h.par, 0);
        return {
          playerId: rs.playerId,
          playerName: rs.playerName,
          totalStrokes: rs.totalStrokes,
          scoreToPar: rs.totalStrokes - totalPar,
          points,
          rank: 0,
        };
      });

      // Sort by total strokes and assign ranks
      results.sort((a, b) => a.totalStrokes - b.totalStrokes);
      let currentRank = 1;
      for (let i = 0; i < results.length; i++) {
        if (i > 0 && results[i].totalStrokes === results[i - 1].totalStrokes) {
          results[i].rank = results[i - 1].rank;
        } else {
          results[i].rank = currentRank;
        }
        currentRank++;
      }

      return results;
    },
    enabled: !!roundId,
  });
}

// Helper function to calculate round points for leaderboard
async function calculateRoundPointsForLeaderboard(
  roundId: string
): Promise<Map<string, number>> {
  // Get round with holes
  const { data: round } = await supabase
    .from('rounds')
    .select('*, course:courses(*, holes:holes(*))')
    .eq('id', roundId)
    .single();
  
  if (!round) return new Map();

  const holes = round.course.holes;

  // Get scores
  const { data: scores } = await supabase
    .from('scores')
    .select('*, player:players(*)')
    .eq('round_id', roundId);
  
  if (!scores) return new Map();

  // Get achievements
  const { data: achievements } = await supabase
    .from('round_achievements')
    .select('*')
    .eq('round_id', roundId);

  // Group scores by player
  const playerScoresMap = new Map<string, Score[]>();
  scores.forEach(score => {
    const existing = playerScoresMap.get(score.player_id) || [];
    playerScoresMap.set(score.player_id, [...existing, score]);
  });

  // Calculate stats
  const roundScores: RoundScores[] = Array.from(playerScoresMap.entries()).map(
    ([playerId, playerScores]) => {
      const player = playerScores[0]?.player;
      const stats = calculatePlayerRoundStats(playerScores, holes);
      return {
        playerId,
        playerName: player?.name || 'Unknown',
        ...stats,
        totalHoles: holes.length,
      };
    }
  );

  const achievementsData: RoundAchievementData = {
    closestToPinWinners: achievements
      ?.filter(a => a.achievement_type === 'closest_to_pin')
      .map(a => ({ holeId: a.hole_id, playerId: a.player_id })) || [],
    longestDriveWinners: achievements
      ?.filter(a => a.achievement_type === 'longest_drive')
      .map(a => ({ holeId: a.hole_id, playerId: a.player_id })) || [],
  };

  const pointsMap = calculateRoundPoints(roundScores, achievementsData);

  // Return map of player ID to total points
  const result = new Map<string, number>();
  pointsMap.forEach((breakdown, playerId) => {
    result.set(playerId, breakdown.total);
  });

  return result;
}
