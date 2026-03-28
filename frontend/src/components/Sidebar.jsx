import { createElement } from 'react';
import {
  BookOpen,
  ChevronLeft,
  FolderKanban,
  Plus,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';
import { StatusBadge } from './ui/System';

const mainLinks = [
  { to: '/dashboard', label: 'Control Center', icon: FolderKanban, end: true },
  { to: '/dashboard/new', label: 'Create Project', icon: Plus },
  { to: '/dashboard/admin/users', label: 'User Management', icon: Users },
  { to: '/dashboard/settings', label: 'Account Settings', icon: Settings },
];

const resourceLinks = [
  { href: '/login', label: 'Login Screen', icon: ChevronLeft },
  { href: 'https://docs.Brodcasta.dev', label: 'Documentation', icon: BookOpen, external: true },
];

const navLinkClassName = ({ isActive }) =>
  cn(
    'group flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
    isActive
      ? 'bg-cyan-400/12 text-white ring-1 ring-cyan-400/25'
      : 'text-[var(--app-muted)] hover:bg-white/5 hover:text-white',
  );

const Sidebar = ({ open = false, onClose = () => {} }) => {
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
          <NavLink to="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/12">
              <img src="/logo.svg" alt="Brodcasta" className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Brodcasta</p>
              <p className="text-xs text-[var(--app-muted)]">Realtime control plane</p>
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

        <div className="mt-8 rounded-[1.75rem] border border-cyan-400/14 bg-cyan-400/8 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="section-eyebrow">Workspace</span>
              <h2 className="text-xl font-semibold text-white">Operate your self-hosted broadcast stack</h2>
              <p className="text-sm leading-6 text-[var(--app-muted)]">
                Manage projects, credentials, message history, and live transport health from one
                self-hosted control panel.
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-8 flex-1 space-y-8 overflow-y-auto pr-1">
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
              Core
            </p>
            <div className="space-y-1.5">
              {mainLinks.map(({ to, label, icon, end }) => (
                <NavLink key={to} to={to} end={end} className={navLinkClassName} onClick={onClose}>
                  {createElement(icon, { className: 'h-4 w-4' })}
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
              Resources
            </p>
            <div className="space-y-1.5">
              {resourceLinks.map(({ href, label, icon, external }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[var(--app-muted)] transition-colors hover:bg-white/5 hover:text-white"
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  onClick={onClose}
                >
                  {createElement(icon, { className: 'h-4 w-4' })}
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Self-hosted mode</p>
                <p className="text-xs text-[var(--app-muted)]">Your data stays on your infra</p>
              </div>
            </div>
            <StatusBadge tone="success">Online</StatusBadge>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
