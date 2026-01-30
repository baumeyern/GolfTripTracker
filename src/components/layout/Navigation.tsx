import { NavLink } from 'react-router-dom';
import { Home, Users, MapPin, Trophy, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/players', icon: Users, label: 'Players' },
  { to: '/courses', icon: MapPin, label: 'Courses' },
  { to: '/new-round', icon: Play, label: 'New Round' },
  { to: '/leaderboard', icon: Trophy, label: 'Standings' },
];

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background md:relative md:border-0 md:bg-transparent">
      <div className="container">
        <div className="flex justify-around md:justify-start md:gap-6 py-2 md:py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-md transition-colors',
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs md:text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
