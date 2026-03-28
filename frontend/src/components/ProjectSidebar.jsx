import { createElement } from 'react';
import {
  Activity,
  ChevronLeft,
  Code2,
  KeyRound,
  LayoutDashboard,
  MessagesSquare,
  Settings,
} from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import { cn } from '../utils/cn';
import { StatusBadge } from './ui/System';

const ProjectSidebar = ({ open = false, onClose = () => {} }) => {
  const { projectId } = useParams();

  const links = [
    { to: '', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: 'messages', label: 'Messages', icon: MessagesSquare },
    { to: 'analytics', label: 'Analytics', icon: Activity },
    { to: 'api-keys', label: 'Credentials', icon: KeyRound },
    { to: 'playground', label: 'Playground', icon: Code2 },
    { to: 'settings', label: 'Settings', icon: Settings },
  ];

  const navLinkClassName = ({ isActive }) =>
    cn(
      'group flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
      isActive
        ? 'bg-cyan-400/12 text-white ring-1 ring-cyan-400/25'
        : 'text-[var(--app-muted)] hover:bg-white/5 hover:text-white',
    );

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 xl:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'shell-panel fixed inset-y-4 left-4 z-50 flex w-[18rem] flex-col rounded-[2rem] px-4 py-5 transition-transform duration-300 ease-out xl:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-[120%] xl:translate-x-0',
        )}
      >
        <div className="flex items-center justify-between px-2">
          <NavLink to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/12 text-cyan-200">
              <ChevronLeft className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Back to control panel</p>
              <p className="text-xs text-[var(--app-muted)]">All projects and account views</p>
            </div>
          </NavLink>

          <button
            type="button"
            className="button-ghost xl:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-white/8 bg-white/[0.04] p-4">
          <span className="section-eyebrow">Project Console</span>
          <h2 className="mt-3 text-xl font-semibold text-white">Operational cockpit</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
            Inspect transport health, credentials, message history, and integration paths for this
            project.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <StatusBadge tone="info">Realtime</StatusBadge>
            <StatusBadge tone="success">Secure</StatusBadge>
          </div>
        </div>

        <nav className="mt-8 flex-1 space-y-2 overflow-y-auto pr-1">
          {links.map(({ to, label, icon, end }) => (
            <NavLink
              key={to || 'overview'}
              to={`/dashboard/projects/${projectId}${to ? `/${to}` : ''}`}
              end={end}
              className={navLinkClassName}
              onClick={onClose}
            >
              {createElement(icon, { className: 'h-4 w-4' })}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

      </aside>
    </>
  );
};

export default ProjectSidebar;
