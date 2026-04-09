import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <Navbar />

      <main className="mx-auto max-w-xl px-6 pt-16 pb-24">
        <div className="space-y-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--app-text)]">
            Realtime messaging
            <br />
            for product teams.
          </h1>

          <p className="text-base leading-relaxed text-[var(--app-muted)]">
            WebSockets with SSE fallback.
            <br />
            Credentials, analytics, playground.
          </p>

          <div className="flex gap-3">
            <Link to="/signup" className="button-primary px-4 py-2 text-sm">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="https://docs.Brodcasta.dev" className="button-secondary px-4 py-2 text-sm">
              Docs
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;