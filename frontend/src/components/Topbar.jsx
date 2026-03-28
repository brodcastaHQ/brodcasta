import { BookOpen, Menu, ShieldCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { StatusBadge } from './ui/System';

const routeLabels = {
  dashboard: 'Workspace',
  new: 'Create Project',
  admin: 'Administration',
  users: 'User Management',
  settings: 'Settings',
  analytics: 'Analytics',
  'api-keys': 'Credentials',
  messages: 'Messages',
  playground: 'Playground',
};

const formatPathLabel = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const last = segments.at(-1);

  if (!last) return 'Overview';
  if (last === 'dashboard' && segments.length === 1) return 'Control Center';
  if (last === segments[segments.length - 2] && last === 'projects') return 'Projects';
  return routeLabels[last] || 'Overview';
};

const Topbar = ({ onMenuClick, className = '' }) => {
  const location = useLocation();
  const title = formatPathLabel(location.pathname);
  const inProject = location.pathname.includes('/dashboard/projects/');

  return (
    <header className={cn('shell-panel rounded-[1.75rem] px-4 py-4 sm:px-5', className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="button-secondary px-3 py-3 xl:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="section-eyebrow">{inProject ? 'Project Console' : 'Brodcasta Self-Hosted'}</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-white sm:text-xl">{title}</p>
              <p className="text-sm text-[var(--app-muted)]">
                {inProject
                  ? 'Keep transports, credentials, and traffic trends visible in one place.'
                  : 'A cleaner control surface for projects, admins, and self-hosted operations.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="success">
            <ShieldCheck className="h-3.5 w-3.5" />
            Self-hosted online
          </StatusBadge>
          <a
            href="https://docs.Brodcasta.dev"
            target="_blank"
            rel="noreferrer"
            className="button-secondary"
          >
            <BookOpen className="h-4 w-4" />
            Docs
          </a>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white">
            BC
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
