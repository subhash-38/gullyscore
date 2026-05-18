import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, History, Info } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import ToastViewport from './Toast.jsx';

export default function Layout({ children }) {
  const location = useLocation();
  const hideBottomNav =
    location.pathname.startsWith('/match') ||
    location.pathname === '/setup' ||
    location.pathname === '/toss';

  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg">
      <Header />
      <ToastViewport />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-3 pb-24">
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md border-b border-border safe-top">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg">
          <span className="inline-block h-7 w-7 rounded-lg bg-brand flex items-center justify-center text-white text-xs">
            GS
          </span>
          <span>Gullyscore</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}

function BottomNav() {
  const items = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/history', label: 'History', icon: History },
    { to: '/about', label: 'About', icon: Info },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-bg-card/95 backdrop-blur-md border-t border-border safe-bottom">
      <div className="max-w-2xl mx-auto grid grid-cols-3 h-16">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                isActive ? 'text-brand' : 'text-fg-muted hover:text-fg'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
