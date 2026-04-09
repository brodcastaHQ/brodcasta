import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

const routeLabels = {
  dashboard: 'Dashboard',
  new: 'New Project',
  admin: 'Admin',
  users: 'Users',
  settings: 'Settings',
  analytics: 'Analytics',
  'api-keys': 'API Keys',
  messages: 'Messages',
  playground: 'Playground',
};

const formatPathLabel = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const last = segments.at(-1);
  if (!last) return 'Dashboard';
  return routeLabels[last] || last;
};

const Topbar = ({ onMenuClick, className = '' }) => {
  const location = useLocation();
  const title = formatPathLabel(location.pathname);

  return (
    <header className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-3">
        <button type="button" className="p-2 xl:hidden" onClick={onMenuClick} aria-label="Menu">
          <Menu className="h-4 w-4" />
        </button>
        <span className="text-lg font-medium text-[var(--app-text)]">{title}</span>
      </div>
    </header>
  );
};

export default Topbar;