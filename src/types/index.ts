export interface Player {
  id: string;
  name: string;
  nickname: string | null;
  handicap: number;
  avatar_url: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  num_holes: number;
  created_at: string;
}

export interface Hole {
  id: string;
  course_id: string;
  hole_number: number;
  par: number;
  is_par3: boolean;
  is_par5: boolean;
}

export interface Round {
  id: string;
  course_id: string;
  round_date: string;
  round_number: number;
  is_complete: boolean;
  created_at: string;
  course?: Course;
}

export interface Score {
  id: string;
  round_id: string;
  player_id: string;
  hole_id: string;
  strokes: number;
  fairway_hit: boolean;
  gir: boolean;
  created_at: string;
  hole?: Hole;
  player?: Player;
}

export interface RoundAchievement {
  id: string;
  round_id: string;
  hole_id: string;
  player_id: string;
  achievement_type: 'closest_to_pin' | 'longest_drive';
}

export interface RoundScores {
  playerId: string;
  playerName: string;
  totalStrokes: number;
  birdies: number;
  eagles: number;
  fairwaysHit: number;
  totalFairways: number;
  girs: number;
  totalHoles: number;
}

export interface RoundAchievementData {
  closestToPinWinners: { holeId: string; playerId: string }[];
  longestDriveWinners: { holeId: string; playerId: string }[];
}

export interface PointsBreakdown {
  placement: number;
  birdies: number;
  eagles: number;
  closestToPin: number;
  longestDrive: number;
  mostFairways: number;
  mostGirs: number;
  total: number;
}

export interface PlayerRoundResult {
  playerId: string;
  playerName: string;
  totalStrokes: number;
  scoreToPar: number;
  points: PointsBreakdown;
  rank: number;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  totalPoints: number;
  roundsPlayed: number;
  rank: number;
  isTied: boolean;
  breakdown: PointsBreakdown;
}

export interface HoleWithPar extends Hole {
  par: number;
}

export interface RoundWithDetails extends Round {
  course: Course;
  holes: Hole[];
}

export interface ScoreEntry {
  holeId: string;
  playerId: string;
  strokes: number;
  fairwayHit: boolean;
  gir: boolean;
}
