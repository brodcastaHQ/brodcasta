import { ArrowRight, ShieldCheck, Waves } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/ui/Loading';
import { Field, StatusBadge, Surface } from '../../components/ui/System';
import { createClient } from '../../utils/client';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const client = createClient('/api/accounts');
      await client.post('/login', { email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1280px] items-stretch">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Surface tone="highlight" className="hidden overflow-hidden rounded-[2.25rem] p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="space-y-6">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/12">
                  <img src="/logo.svg" alt="Brodcasta" className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Brodcasta</p>
                  <p className="text-xs text-[var(--app-muted)]">Realtime messaging infrastructure</p>
                </div>
              </Link>

              <div className="space-y-5">
                <div className="flex flex-wrap gap-3">
                  <StatusBadge tone="success">Self-hosted</StatusBadge>
                  <StatusBadge tone="info">Transport aware</StatusBadge>
                </div>
                <h1 className="text-5xl font-semibold leading-[1.04] text-white">
                  Sign into the self-hosted control panel that keeps live systems understandable.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[var(--app-muted)]">
                  Inspect credentials, project traffic, analytics, and fallback behavior from a UI
                  that is finally as disciplined as the infrastructure behind it.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.04] p-5">
                <Waves className="h-6 w-6 text-cyan-200" />
                <h2 className="mt-5 text-xl font-semibold text-white">Transport visibility</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">
                  Know when clients connect, reconnect, or fall back to SSE without opening another tool.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.04] p-5">
                <ShieldCheck className="h-6 w-6 text-emerald-300" />
                <h2 className="mt-5 text-xl font-semibold text-white">Project security</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">
                  Rotate credentials and control auth rules per project from one consistent surface.
                </p>
              </div>
            </div>
          </Surface>

          <Surface className="relative flex items-center justify-center rounded-[2.25rem] p-6 sm:p-10">
            {loading ? <Loading fullScreen label="Signing you in" /> : null}

            <div className="w-full max-w-md space-y-8">
              <div className="space-y-4">
                <Link to="/" className="inline-flex items-center gap-3 lg:hidden">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/12">
                    <img src="/logo.svg" alt="Brodcasta" className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-white">Back to product</span>
                </Link>

                <div className="space-y-3">
                  <span className="section-eyebrow">Welcome back</span>
                  <h2 className="text-4xl font-semibold text-white">Sign in to your control panel</h2>
                  <p className="text-base leading-7 text-[var(--app-muted)]">
                    Use your account credentials to manage projects, credentials, analytics, and live traffic on your own deployment.
                  </p>
                </div>
              </div>

              {error ? (
                <div className="rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <Field htmlFor="login-email" label="Email address">
                  <input
                    id="login-email"
                    type="email"
                    className="input-shell"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </Field>

                <Field
                  htmlFor="login-password"
                  label="Password"
                  hint={
                    <Link to="/signup" className="text-cyan-200 hover:text-cyan-100">
                      Need an account instead?
                    </Link>
                  }
                >
                  <input
                    id="login-password"
                    type="password"
                    className="input-shell"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </Field>

                <button type="submit" className="button-primary w-full">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
                  Session note
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">
                  Authentication uses your Brodcasta account cookies and keeps project API calls
                  scoped to your self-hosted control panel after sign in.
                </p>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};

export default Login;
