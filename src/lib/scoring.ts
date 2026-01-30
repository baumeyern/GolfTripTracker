import {
  RoundScores,
  RoundAchievementData,
  PointsBreakdown,
  Score,
  Hole,
} from '@/types';

export function calculateRoundPoints(
  scores: RoundScores[],
  achievements: RoundAchievementData
): Map<string, PointsBreakdown> {
  const results = new Map<string, PointsBreakdown>();

  // Sort by total strokes (ascending - lower is better)
  const sorted = [...scores].sort((a, b) => a.totalStrokes - b.totalStrokes);

  // Calculate placement points with tie handling
  const placementPoints = [10, 8, 6, 4, 2]; // 5th+ gets 2
  let position = 0;

  while (position < sorted.length) {
    // Find all players tied at this position
    const currentStrokes = sorted[position].totalStrokes;
    const tiedPlayers = sorted.filter((s) => s.totalStrokes === currentStrokes);

    // Average the points for tied positions
    const positionsOccupied = tiedPlayers.length;
    const pointsToAverage = placementPoints
      .slice(position, position + positionsOccupied)
      .reduce((a, b) => a + (b ?? 2), 0);
    const avgPoints = pointsToAverage / positionsOccupied;

    for (const player of tiedPlayers) {
      const breakdown: PointsBreakdown = {
        placement: avgPoints,
        birdies: player.birdies * 1,
        eagles: player.eagles * 4, // Additional 4 points (total of 5 with birdie)
        closestToPin: achievements.closestToPinWinners.filter(
          (a) => a.playerId === player.playerId
        ).length,
        longestDrive: achievements.longestDriveWinners.filter(
          (a) => a.playerId === player.playerId
        ).length,
        mostFairways: 0, // Calculated below
        mostGirs: 0, // Calculated below
        total: 0, // Summed at end
      };
      results.set(player.playerId, breakdown);
    }

    position += positionsOccupied;
  }

  // Most fairways hit bonus (only if there are fairways)
  const playersWithFairways = scores.filter((s) => s.totalFairways > 0);
  if (playersWithFairways.length > 0) {
    const maxFairways = Math.max(...playersWithFairways.map((s) => s.fairwaysHit));
    const fairwayWinners = scores.filter((s) => s.fairwaysHit === maxFairways && maxFairways > 0);
    if (fairwayWinners.length > 0) {
      const fairwayBonus = 1 / fairwayWinners.length;
      fairwayWinners.forEach((w) => {
        const breakdown = results.get(w.playerId)!;
        breakdown.mostFairways = fairwayBonus;
      });
    }
  }

  // Most GIRs bonus
  const maxGirs = Math.max(...scores.map((s) => s.girs));
  if (maxGirs > 0) {
    const girWinners = scores.filter((s) => s.girs === maxGirs);
    const girBonus = 1 / girWinners.length;
    girWinners.forEach((w) => {
      const breakdown = results.get(w.playerId)!;
      breakdown.mostGirs = girBonus;
    });
  }

  // Calculate totals
  results.forEach((breakdown) => {
    breakdown.total =
      breakdown.placement +
      breakdown.birdies +
      breakdown.eagles +
      breakdown.closestToPin +
      breakdown.longestDrive +
      breakdown.mostFairways +
      breakdown.mostGirs;
  });

  return results;
}

export function calculatePlayerRoundStats(
  playerScores: Score[],
  holes: Hole[]
): {
  totalStrokes: number;
  birdies: number;
  eagles: number;
  fairwaysHit: number;
  totalFairways: number;
  girs: number;
} {
  let totalStrokes = 0;
  let birdies = 0;
  let eagles = 0;
  let fairwaysHit = 0;
  let totalFairways = 0;
  let girs = 0;

  const holeMap = new Map(holes.map((h) => [h.id, h]));

  playerScores.forEach((score) => {
    const hole = holeMap.get(score.hole_id);
    if (!hole) return;

    totalStrokes += score.strokes;

    const scoreToPar = score.strokes - hole.par;
    if (scoreToPar === -1) birdies++;
    if (scoreToPar <= -2) eagles++;

    // Only count fairways on par 4s and 5s
    if (hole.par >= 4) {
      totalFairways++;
      if (score.fairway_hit) fairwaysHit++;
    }

    if (score.gir) girs++;
  });

  return {
    totalStrokes,
    birdies,
    eagles,
    fairwaysHit,
    totalFairways,
    girs,
  };
}

export function formatPoints(points: number): string {
  return points.toFixed(1).replace(/\.0$/, '');
}
