import { ArrowRight, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createClient } from '../../utils/client';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    try {
      const client = createClient('/api/accounts');
      await client.post('/reset-password', { email, otp, password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
            <KeyRound className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--app-text)]">Password reset</h1>
          <p className="mt-2 text-sm text-[var(--app-muted)]">
            Your password has been reset successfully.
          </p>
          <Link
            to="/login"
            className="button-primary mt-6 inline-flex w-full items-center justify-center"
          >
            Sign in
            <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 pb-8">
          <img src="/logo.svg" alt="Brodcasta" className="h-6 w-6" />
        </Link>

        <h1 className="text-xl font-semibold text-[var(--app-text)]">Enter reset code</h1>
        <p className="mt-1 text-sm text-[var(--app-muted)]">
          Check your email for the 6-digit code.
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

          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">
              6-digit code
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="input-shell mt-1 text-center text-lg tracking-[0.5em]"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">
              New password
            </label>
            <input
              type="password"
              className="input-shell mt-1"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">
              Confirm password
            </label>
            <input
              type="password"
              className="input-shell mt-1"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="button-primary w-full" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--app-muted)]">
          <Link to="/forgot-password" className="text-[var(--app-text)] underline">
            Resend code
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
