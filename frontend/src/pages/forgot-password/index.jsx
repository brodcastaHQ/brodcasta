import { ArrowRight, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '../../utils/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const client = createClient('/api/accounts');
      await client.post('/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 pb-8">
          <img src="/logo.svg" alt="Brodcasta" className="h-6 w-6" />
        </Link>

        {sent ? (
          <>
            <h1 className="text-xl font-semibold text-[var(--app-text)]">Check your email</h1>
            <p className="mt-2 text-sm text-[var(--app-muted)]">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a 6-digit code
              to reset your password. It expires in 15 minutes.
            </p>
            <Link
              to={`/reset-password?email=${encodeURIComponent(email)}`}
              className="button-primary mt-6 inline-flex w-full items-center justify-center"
            >
              Enter reset code
              <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
            <p className="mt-4 text-center text-sm text-[var(--app-muted)]">
              <Link to="/login" className="text-[var(--app-text)] underline">
                Back to sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-[var(--app-text)]">Reset your password</h1>
            <p className="mt-1 text-sm text-[var(--app-muted)]">
              Enter your email and we&apos;ll send you a code.
            </p>

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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="button-primary w-full" disabled={loading}>
                {loading ? 'Sending…' : (
                  <>
                    Send code
                    <Mail className="ml-1 inline h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-[var(--app-muted)]">
              Remember your password?{' '}
              <Link to="/login" className="text-[var(--app-text)] underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
