import type { AppView } from '../types/nyt';
import './NavBar.css';

interface NavBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export default function NavBar({ currentView, onNavigate }: NavBarProps) {
  const links: { view: AppView; label: string }[] = [
    { view: 'current', label: 'Actuales' },
    { view: 'history-search', label: 'Buscar' },
  ];

  return (
    <nav className="main-nav">
      <ul>
        {links.map((link) => (
          <li key={link.view}>
            <button
              className={`nav-btn ${currentView === link.view ? 'active' : ''}`}
              onClick={() => onNavigate(link.view)}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
