import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/ui/Loading';
import { Field, StatusBadge, Surface } from '../../components/ui/System';
import { createClient } from '../../utils/client';

const signupBenefits = [
  'Create and manage multiple realtime projects from one control panel.',
  'Rotate credentials, review analytics, and inspect message flow.',
  'Switch between public and protected auth models per project.',
];

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
      setError(err.response?.data?.detail || 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1280px] items-stretch">
        <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Surface tone="highlight" className="hidden rounded-[2.25rem] p-10 lg:flex lg:flex-col lg:justify-between">
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
                  <StatusBadge tone="success">
                    <Sparkles className="h-3.5 w-3.5" />
                    Start shipping faster
                  </StatusBadge>
                  <StatusBadge tone="info">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Security controls included
                  </StatusBadge>
                </div>

                <h1 className="text-5xl font-semibold leading-[1.04] text-white">
                  Create an operator account for the parts of self-hosted realtime systems that usually stay messy.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[var(--app-muted)]">
                  The new frontend leans into clarity: tighter forms, better hierarchy, and a
                  more operational product story from signup through the project console.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-white/[0.04] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
                Included after signup
              </p>
              <div className="mt-4 space-y-3">
                {signupBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-300" />
                    <p className="text-sm leading-7 text-slate-100">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </Surface>

          <Surface className="relative flex items-center justify-center rounded-[2.25rem] p-6 sm:p-10">
            {loading ? <Loading fullScreen label="Creating account" /> : null}

            <div className="w-full max-w-xl space-y-8">
              <div className="space-y-4">
                <Link to="/" className="inline-flex items-center gap-3 lg:hidden">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/12">
                    <img src="/logo.svg" alt="Brodcasta" className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-white">Back to product</span>
                </Link>

                <div className="space-y-3">
                  <span className="section-eyebrow">Create account</span>
                  <h2 className="text-4xl font-semibold text-white">Create your Brodcasta operator account</h2>
                  <p className="text-base leading-7 text-[var(--app-muted)]">
                    Create an account to manage projects, credentials, analytics, and transport flows
                    for your self-hosted deployment from a single cleaner interface.
                  </p>
                </div>
              </div>

              {error ? (
                <div className="rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field htmlFor="signup-name" label="Full name">
                    <input
                      id="signup-name"
                      name="name"
                      type="text"
                      className="input-shell"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field htmlFor="signup-company" label="Company">
                    <input
                      id="signup-company"
                      name="company"
                      type="text"
                      className="input-shell"
                      placeholder="Acme Inc."
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </Field>
                </div>

                <Field htmlFor="signup-email" label="Email address">
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    className="input-shell"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <Field
                  htmlFor="signup-password"
                  label="Password"
                  hint="Use a password you can comfortably keep secure. You can change it later from account settings."
                >
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    className="input-shell"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <button type="submit" className="button-primary w-full">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-sm leading-7 text-[var(--app-muted)]">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-cyan-200 hover:text-cyan-100">
                    Sign in here
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};

export default Signup;
