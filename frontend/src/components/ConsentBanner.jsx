import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const STORAGE_KEY = 'brodcasta_cookie_consent';

const ConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--app-border)] bg-[var(--app-surface)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <p className="flex-1 text-sm text-[var(--app-muted)]">
          We use essential cookies for authentication and security. No tracking or
          advertising cookies are used.{' '}
          <Link to="/privacy" className="text-[var(--app-text)] underline hover:no-underline">
            Learn more
          </Link>
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={accept}
            className="button-primary whitespace-nowrap text-sm"
          >
            Accept
          </button>
          <button
            onClick={accept}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)] transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
