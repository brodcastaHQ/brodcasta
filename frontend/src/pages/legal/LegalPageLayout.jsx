import { Link } from 'react-router-dom';

const LegalPageLayout = ({ title, updated, children }) => {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <nav className="sticky top-4 z-50 mx-4 sm:mx-6">
        <div className="mx-auto max-w-6xl rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Brodcasta" className="h-5 w-5" />
              <span className="text-sm font-medium">Brodcasta</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/pricing" className="text-sm text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                Pricing
              </Link>
              <Link to="/login" className="text-sm text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                Sign in
              </Link>
              <Link to="/signup" className="button-primary px-3 py-1.5 text-sm">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="section-eyebrow mb-4">Legal</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">{title}</h1>
          {updated && (
            <p className="text-sm text-[var(--app-muted)] mb-12">Last updated: {updated}</p>
          )}

          <div className="prose prose-invert max-w-none">
            {children}
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--app-border)] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--app-subtle)]">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Brodcasta" className="h-5 w-5" />
              <span className="text-sm font-medium text-[var(--app-text)]">Brodcasta</span>
            </Link>
            <span>Brodcasta, all rights reserved 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalPageLayout;
