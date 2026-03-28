import { ArrowLeft, ArrowRight, Info, ShieldCheck, Waves } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/ui/Loading';
import { Field, PageHeader, SectionHeader, StatusBadge, Surface } from '../../components/ui/System';
import { createClient } from '../../utils/client';

const authOptions = [
  {
    value: 'none',
    title: 'Public',
    copy: 'Anyone can publish and subscribe without authentication.',
  },
  {
    value: 'publishing_only',
    title: 'Publish protected',
    copy: 'Publishing requires auth while reads remain public.',
  },
  {
    value: 'all',
    title: 'Full auth',
    copy: 'Publishing and subscribing both require authentication.',
  },
];

const NewProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    auth_type: 'none',
    history_enabled: true,
  });

  const handleChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((current) => ({ ...current, [event.target.name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const client = createClient('/api/projects');
      const response = await client.post('/', formData);
      navigate(`/dashboard/projects/${response.data.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {loading ? <Loading fullScreen label="Creating project" /> : null}

      <PageHeader
        eyebrow="Project Setup"
        title="Create a new realtime project."
        description="The project creator now keeps the form short, the auth choices explicit, and the launch implications visible before you hit save."
        actions={
          <Link to="/dashboard" className="button-ghost">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="rounded-[2rem] p-6 sm:p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <SectionHeader
              eyebrow="Basics"
              title="Name and configure the project"
              description="Use a project name your team will recognize inside the control panel and during credential rotation."
            />

            {error ? (
              <div className="rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <Field
              htmlFor="project-name"
              label="Project name"
              hint="This appears in the control panel, analytics views, and credential screens."
            >
              <input
                id="project-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Production notifications"
                className="input-shell"
                required
              />
            </Field>

            <div className="space-y-4">
              <Field
                htmlFor="project-auth"
                label="Authentication model"
                hint="Choose the strictness level that matches how publishers and subscribers should connect."
              >
                <select
                  id="project-auth"
                  name="auth_type"
                  value={formData.auth_type}
                  onChange={handleChange}
                  className="select-shell"
                >
                  {authOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.title}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid gap-3 md:grid-cols-3">
                {authOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`rounded-[1.5rem] border p-4 ${
                      formData.auth_type === option.value
                        ? 'border-cyan-400/28 bg-cyan-400/10'
                        : 'border-white/8 bg-white/[0.03]'
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{option.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">{option.copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
              <input
                type="checkbox"
                name="history_enabled"
                checked={formData.history_enabled}
                onChange={handleChange}
                className="mt-1 h-5 w-5 rounded border border-white/12 bg-slate-950/80 text-cyan-300"
              />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">Enable message history</p>
                <p className="text-sm leading-7 text-[var(--app-muted)]">
                  Keep message records available for debugging, analytics, and new-subscriber replay scenarios.
                </p>
              </div>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" className="button-secondary" onClick={() => navigate(-1)} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="button-primary" disabled={loading}>
                Create project
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </Surface>

        <div className="space-y-6">
          <Surface tone="highlight" className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="What happens next"
              title="Your project console becomes available immediately."
              description="After creation, you'll land inside the project console with credentials, analytics, messages, and the playground ready."
            />

            <div className="mt-6 space-y-4">
              <div className="flex gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/18 bg-cyan-400/10 text-cyan-200">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Credentials and auth</p>
                  <p className="mt-1 text-sm leading-7 text-[var(--app-muted)]">
                    Copy project secrets, rotate them when needed, and validate auth posture per project.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/18 bg-emerald-400/10 text-emerald-300">
                  <Waves className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Transport analytics</p>
                  <p className="mt-1 text-sm leading-7 text-[var(--app-muted)]">
                    Watch message volume, connection types, and fallback behavior as soon as traffic starts.
                  </p>
                </div>
              </div>
            </div>
          </Surface>

          <Surface tone="muted" className="rounded-[2rem] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/18 bg-amber-400/10 text-amber-300">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Recommended default</p>
                <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">
                  Start with <span className="text-white">publish protected</span> if you expect trusted
                  producers but public consumers. It gives you a safer default without complicating reads.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <StatusBadge tone={formData.history_enabled ? 'success' : 'neutral'}>
                History {formData.history_enabled ? 'enabled' : 'disabled'}
              </StatusBadge>
              <StatusBadge tone="info">{authOptions.find((item) => item.value === formData.auth_type)?.title}</StatusBadge>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
