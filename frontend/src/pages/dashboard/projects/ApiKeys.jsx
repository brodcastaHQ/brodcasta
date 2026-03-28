import { Check, Copy, Eye, EyeOff, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
import { Field, PageHeader, SectionHeader, StatusBadge, Surface } from '../../../components/ui/System';
import { createClient } from '../../../utils/client';
import { maskSecret } from '../../../utils/formatters';

const ApiKeys = () => {
  const { projectId } = useParams();
  const [projectSecret, setProjectSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedValue, setCopiedValue] = useState('');
  const [revealedSecret, setRevealedSecret] = useState(false);
  const [rotatingSecret, setRotatingSecret] = useState(false);

  useEffect(() => {
    const fetchProjectSecret = async () => {
      try {
        const client = createClient('/api');
        const response = await client.get(`/projects/${projectId}/secret`);
        setProjectSecret(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load project credentials.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectSecret();
  }, [projectId]);

  const rotateProjectSecret = async () => {
    setRotatingSecret(true);
    setError('');
    try {
      const client = createClient('/api');
      const response = await client.post(`/projects/${projectId}/rotate-secret`);
      setProjectSecret(response.data);
      setRevealedSecret(true);
    } catch (err) {
      console.error(err);
      setError('Failed to rotate project secret.');
    } finally {
      setRotatingSecret(false);
    }
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedValue(key);
      setTimeout(() => setCopiedValue(''), 1800);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return <Loading fullScreen label="Loading credentials" />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Credentials"
        title="Project credentials with clearer guardrails."
        description="The credentials page now puts copy, reveal, rotate, and integration guidance into a more deliberate security-first layout."
        meta={<StatusBadge tone="warning">Handle secrets carefully</StatusBadge>}
        actions={
          <button type="button" className="button-primary" onClick={rotateProjectSecret} disabled={rotatingSecret}>
            <RefreshCw className={`h-4 w-4 ${rotatingSecret ? 'animate-spin' : ''}`} />
            Rotate secret
          </button>
        }
      />

      {error ? (
        <div className="rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="rounded-[2rem] p-6 sm:p-8">
          <SectionHeader
            eyebrow="Credential Set"
            title="Protect the project secret and keep rotation explicit."
            description="The masked secret stays hidden by default, and rotate remains the primary high-risk action."
          />

          <div className="mt-6 space-y-5">
            <Field
              htmlFor="project-secret"
              label="Project secret"
              hint={projectSecret?.message || 'Store this securely and rotate it if exposure is suspected.'}
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="project-secret"
                  type="text"
                  className="input-shell font-mono"
                  value={
                    revealedSecret
                      ? projectSecret?.project_secret || ''
                      : maskSecret(projectSecret?.project_secret || '')
                  }
                  readOnly
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="button-secondary shrink-0"
                    onClick={() => setRevealedSecret((value) => !value)}
                  >
                    {revealedSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {revealedSecret ? 'Hide' : 'Reveal'}
                  </button>
                  <button
                    type="button"
                    className="button-secondary shrink-0"
                    onClick={() => copyToClipboard(projectSecret?.project_secret || '', 'projectSecret')}
                  >
                    {copiedValue === 'projectSecret' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy
                  </button>
                </div>
              </div>
            </Field>
          </div>
        </Surface>

        <div className="space-y-6">
          <Surface tone="highlight" className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="Security Guidance"
              title="Keep secret management explicit."
              description="The redesign makes sensitive actions feel separate from routine copy actions."
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4 rounded-[1.5rem] border border-emerald-400/18 bg-emerald-400/[0.08] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/18 bg-emerald-400/10 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Private by default</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">
                    Only reveal the secret when you actually need to move it into a trusted system.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-[1.5rem] border border-amber-400/18 bg-amber-400/[0.08] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/18 bg-amber-400/10 text-amber-300">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Rotate intentionally</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">
                    Rotating the secret invalidates the previous one, so update any dependent clients immediately.
                  </p>
                </div>
              </div>
            </div>
          </Surface>

          <Surface className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="Integration"
              title="Use the credentials in your client setup"
              description="Keep the secret server-side or in trusted infrastructure only."
            />

            <div className="mt-6 code-panel">
              <pre>
                <span className="token-keyword">const</span> projectConfig = <span className="token-keyword">await</span>{' '}
                <span className="token-accent">loadProjectConfig</span>(){'\n'}
                {'\n'}
                <span className="token-keyword">const</span> client = <span className="token-keyword">new</span>{' '}
                <span className="token-accent">BrodcastaClient</span>({'\n'}
                {'  '}baseUrl: <span className="token-string">'https://your-instance.example'</span>,{'\n'}
                {'  '}...projectConfig,{'\n'}
                {'  '}projectSecret: <span className="token-string">'server-only-secret'</span>,{'\n'}
                {'}'})
              </pre>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};

export default ApiKeys;
