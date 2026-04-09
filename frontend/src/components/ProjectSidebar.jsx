import { createElement } from 'react';
import { ChevronLeft } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import { cn } from '../utils/cn';

const ProjectSidebar = ({ open = false, onClose = () => {} }) => {
  const { projectId } = useParams();

  const links = [
    { to: '', label: 'Overview', end: true },
    { to: 'messages', label: 'Messages' },
    { to: 'analytics', label: 'Analytics' },
    { to: 'api-keys', label: 'Credentials' },
    { to: 'playground', label: 'Playground' },
    { to: 'settings', label: 'Settings' },
  ];

  const navLinkClassName = ({ isActive }) =>
    cn(
      'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
      isActive
        ? 'bg-[var(--app-surface-2)] text-[var(--app-text)]'
        : 'text-[var(--app-muted)] hover:text-[var(--app-text)]',
    );

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/20 transition-opacity duration-200 xl:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed inset-y-3 left-3 z-50 flex w-56 flex-col rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-4 transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-[120%] xl:translate-x-0',
        )}
      >
        <div className="flex items-center gap-2 pb-4">
          <NavLink to="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <ChevronLeft className="h-4 w-4" />
            <p className="text-sm font-medium text-[var(--app-text)]">Back</p>
          </NavLink>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to || 'overview'}
              to={`/dashboard/projects/${projectId}${to ? `/${to}` : ''}`}
              end={end}
              className={navLinkClassName}
              onClick={onClose}
            >
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default ProjectSidebar;