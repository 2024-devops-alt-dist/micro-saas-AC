import { HomeIcon, BookmarkIcon, UsersIcon, UserIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Accueil', icon: <HomeIcon className="h-6 w-6" />, route: '/' },
  { label: 'Quiz', icon: <BookmarkIcon className="h-6 w-6" />, route: '/history' },
  { label: 'Stats', icon: <UsersIcon className="h-6 w-6" />, route: '/stats' },
  { label: 'Profil', icon: <UserIcon className="h-6 w-6" />, route: '/profil' },
];

export default function BottomNav() {
  return (
    <nav className="
      fixed bottom-0 left-0 w-full bg-white shadow flex justify-around py-2 z-50
      md:top-0 md:bottom-auto md:justify-center
    ">
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.route}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600 px-3 py-1 md:flex-row md:gap-2 md:py-2"
          aria-label={item.label}
        >
          {item.icon}
          <span className="sr-only md:not-sr-only md:text-xs">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}