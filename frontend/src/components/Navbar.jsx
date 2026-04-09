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
    'text-sm transition-colors',
    isActive ? 'text-[var(--app-text)]' : 'text-[var(--app-muted)] hover:text-[var(--app-text)]',
  );

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-4 z-50 mx-4 sm:mx-6">
        <div className="mx-auto max-w-xl rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Brodcasta" className="h-5 w-5" />
              <p className="text-sm font-medium text-[var(--app-text)]">Brodcasta</p>
            </Link>

            <div className="hidden items-center gap-4 lg:flex">
              {navigation.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[var(--app-muted)] hover:text-[var(--app-text)]"
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

            <div className="hidden items-center gap-2 lg:flex">
              <Link to="/login" className="text-sm text-[var(--app-muted)] hover:text-[var(--app-text)]">
                Sign in
              </Link>
              <Link to="/signup" className="button-primary px-3 py-1.5 text-sm">
                Sign up
              </Link>
            </div>

            <button
              type="button"
              className="p-2 lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-[var(--app-bg)]/95 px-4 pt-24 backdrop-blur-sm lg:hidden">
          <div className="mx-auto max-w-md space-y-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
            {navigation.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md px-3 py-2 text-sm text-[var(--app-muted)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className="block rounded-md px-3 py-2 text-sm text-[var(--app-muted)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ),
            )}
            <div className="flex flex-col gap-2 border-t border-[var(--app-border)] pt-3">
              <Link to="/login" className="button-secondary text-center" onClick={() => setMobileOpen(false)}>
                Sign in
              </Link>
              <Link to="/signup" className="button-primary text-center" onClick={() => setMobileOpen(false)}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Navbar;
