import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScoreToPar(strokes: number, par: number): string {
  const diff = strokes - par;
  if (diff === 0) return 'E';
  if (diff > 0) return `+${diff}`;
  return `${diff}`;
}

export function getScoreLabel(strokes: number, par: number): string {
  const diff = strokes - par;
  if (diff <= -3) return 'Albatross';
  if (diff === -2) return 'Eagle';
  if (diff === -1) return 'Birdie';
  if (diff === 0) return 'Par';
  if (diff === 1) return 'Bogey';
  if (diff === 2) return 'Double';
  return 'Triple+';
}

export function getScoreColor(strokes: number, par: number): string {
  const diff = strokes - par;
  if (diff <= -2) return 'text-yellow-500'; // Eagle or better
  if (diff === -1) return 'text-red-500'; // Birdie
  if (diff === 0) return 'text-gray-700 dark:text-gray-300'; // Par
  if (diff === 1) return 'text-blue-500'; // Bogey
  return 'text-gray-500'; // Double or worse
}

export function calculateTotalPar(holes: { par: number }[]): number {
  return holes.reduce((sum, hole) => sum + hole.par, 0);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export function ordinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
}

export { formatPoints } from './scoring';
