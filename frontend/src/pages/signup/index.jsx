import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/ui/Loading';
import { createClient } from '../../utils/client';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const client = createClient('/api/accounts');
      await client.post('/signup', formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {loading ? <Loading fullScreen label="Creating account" /> : null}

      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 pb-8">
          <img src="/logo.svg" alt="Brodcasta" className="h-6 w-6" />
        </Link>

        <h1 className="text-xl font-semibold text-[var(--app-text)]">Create account</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--app-text)]">Name</label>
              <input
                name="name"
                type="text"
                className="input-shell mt-1"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--app-text)]">Company</label>
              <input
                name="company"
                type="text"
                className="input-shell mt-1"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">Email</label>
            <input
              name="email"
              type="email"
              className="input-shell mt-1"
              placeholder="email@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">Password</label>
            <input
              name="password"
              type="password"
              className="input-shell mt-1"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="button-primary w-full">
            Create account
            <ArrowRight className="ml-1 inline h-4 w-4" />
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--app-muted)]">
          Have an account?{' '}
          <Link to="/login" className="text-[var(--app-text)] underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;