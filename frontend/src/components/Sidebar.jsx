import { createElement } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/dashboard/new', label: 'New Project', end: false },
  { to: '/dashboard/admin/users', label: 'Users', end: false },
  { to: '/dashboard/settings', label: 'Settings', end: false },
];

const navLinkClassName = ({ isActive }) =>
  cn(
    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-[var(--app-surface-2)] text-[var(--app-text)]'
      : 'text-[var(--app-muted)] hover:text-[var(--app-text)]',
  );

const Sidebar = ({ open = false, onClose = () => {} }) => {
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
        <div className="flex items-center gap-2 px-2 pb-4">
          <NavLink to="/" className="flex items-center gap-2" onClick={onClose}>
            <img src="/logo.svg" alt="Brodcasta" className="h-5 w-5" />
            <p className="text-sm font-medium text-[var(--app-text)]">Brodcasta</p>
          </NavLink>
        </div>

        <nav className="flex-1 space-y-1">
          {mainLinks.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClassName} onClick={onClose}>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="pt-3 text-xs text-[var(--app-subtle)]">v0.1</div>
      </aside>
    </>
  );
};

export default Sidebar;