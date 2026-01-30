import { Link } from 'react-router-dom';
import { Flag } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Flag className="h-6 w-6 text-primary" />
          <span>Golf Trip Scorer</span>
        </Link>
      </div>
    </header>
  );
}
