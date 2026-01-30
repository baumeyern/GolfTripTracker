import { PointsBreakdown as PointsBreakdownType } from '@/types';
import { formatPoints } from '@/lib/utils';
import { 
  Trophy, 
  Bird, 
  Target, 
  TrendingUp, 
  Crosshair 
} from 'lucide-react';

interface PointsBreakdownProps {
  points: PointsBreakdownType;
}

export function PointsBreakdown({ points }: PointsBreakdownProps) {
  const items = [
    {
      label: 'Placement',
      value: points.placement,
      icon: Trophy,
      show: true,
    },
    {
      label: 'Birdies',
      value: points.birdies,
      icon: Bird,
      show: points.birdies > 0,
    },
    {
      label: 'Eagles',
      value: points.eagles,
      icon: Bird,
      show: points.eagles > 0,
    },
    {
      label: 'Closest to Pin',
      value: points.closestToPin,
      icon: Target,
      show: points.closestToPin > 0,
    },
    {
      label: 'Longest Drive',
      value: points.longestDrive,
      icon: TrendingUp,
      show: points.longestDrive > 0,
    },
    {
      label: 'Most Fairways',
      value: points.mostFairways,
      icon: Crosshair,
      show: points.mostFairways > 0,
    },
    {
      label: 'Most GIRs',
      value: points.mostGirs,
      icon: Crosshair,
      show: points.mostGirs > 0,
    },
  ].filter(item => item.show);

  return (
    <div className="pl-4 ml-12 border-l-2 border-muted">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-2 text-sm"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{item.label}:</span>
              <span className="font-semibold">{formatPoints(item.value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
