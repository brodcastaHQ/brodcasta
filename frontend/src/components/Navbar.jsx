import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';

const navigation = [
  { to: '/login', label: 'Login', end: true },
  { to: '/signup', label: 'Create Account' },
  { href: 'https://docs.Brodcasta.dev', label: 'Docs', external: true },
];

const linkClassName = ({ isActive }) =>
  cn(
    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-white/8 text-white' : 'text-[var(--app-muted)] hover:bg-white/5 hover:text-white',
  );

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-4 z-50 mx-4 sm:mx-6">
        <div className="shell-panel mx-auto max-w-[1280px] rounded-[1.75rem] px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/12">
                <img src="/logo.svg" alt="Brodcasta" className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Brodcasta</p>
                <p className="text-xs text-[var(--app-muted)]">Realtime messaging infrastructure</p>
              </div>
            </Link>

            <div className="hidden items-center gap-2 lg:flex">
              {navigation.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full px-4 py-2 text-sm font-medium text-[var(--app-muted)] transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </a>
                ) : (
                  <NavLink key={item.label} to={item.to} end={item.end} className={linkClassName}>
                    {item.label}
                  </NavLink>
                ),
              )}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <Link to="/login" className="button-ghost px-4 py-3">
                Sign in
              </Link>
              <Link to="/signup" className="button-primary">
                Create account
              </Link>
            </div>

            <button
              type="button"
              className="button-secondary px-3 py-3 lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/72 px-4 pt-24 backdrop-blur-xl lg:hidden">
          <div className="surface-card mx-auto max-w-md space-y-3 p-4">
            {navigation.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-[var(--app-muted)] transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={linkClassName}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ),
            )}
            <div className="flex flex-col gap-3 border-t border-white/8 pt-4">
              <Link to="/login" className="button-secondary" onClick={() => setMobileOpen(false)}>
                Sign in
              </Link>
              <Link to="/signup" className="button-primary" onClick={() => setMobileOpen(false)}>
                Create account
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Navbar;
