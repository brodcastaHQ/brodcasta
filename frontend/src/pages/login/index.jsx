import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/ui/Loading';
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
      setError(err.response?.data?.detail || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {loading ? <Loading fullScreen label="Signing in" /> : null}

      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 pb-8">
          <img src="/logo.svg" alt="Brodcasta" className="h-6 w-6" />
        </Link>

        <h1 className="text-xl font-semibold text-[var(--app-text)]">Sign in</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">Email</label>
            <input
              type="email"
              className="input-shell mt-1"
              placeholder="email@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">Password</label>
            <input
              type="password"
              className="input-shell mt-1"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="button-primary w-full">
            Sign in
            <ArrowRight className="ml-1 inline h-4 w-4" />
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--app-muted)]">
          No account?{' '}
          <Link to="/signup" className="text-[var(--app-text)] underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;