import { Check, Clipboard, Copy, Waves } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
import { createClient } from '../../../utils/client';
import { formatAuthType, formatCount, formatDateTime, maskSecret } from '../../../utils/formatters';

const API_BASE = import.meta.env.VITE_API_URL || 'https://adverse-celie-techwithdunamix-125d8784.koyeb.app';

const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors cursor-pointer"
      title={label}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const StatCard = ({ label, value, sublabel, icon: Icon }) => (
  <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 transition-colors hover:border-[var(--app-border-strong)]">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-[var(--app-subtle)] tracking-wide uppercase">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold text-[var(--app-text)] tracking-tight">{value}</p>
        {sublabel && (
          <p className="mt-0.5 text-xs text-[var(--app-muted)]">{sublabel}</p>
        )}
      </div>
      {Icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)]">
          <Icon className="h-4 w-4 text-[var(--app-muted)]" />
        </div>
      )}
    </div>
  </div>
);

const Section = ({ title, description, children }) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-base font-semibold text-[var(--app-text)]">{title}</h2>
      {description && (
        <p className="mt-0.5 text-sm text-[var(--app-muted)]">{description}</p>
      )}
    </div>
    {children}
  </div>
);

const ProjectOverview = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [secretRevealed, setSecretRevealed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProjectData = async () => {
      try {
        const client = createClient(`/api/projects/${projectId}`);
        const [projectResponse, statsResponse] = await Promise.all([
          client.get('/'),
          client.get('/stats'),
        ]);

        if (!isMounted) return;
        setProject(projectResponse.data);
        setStats(statsResponse.data);
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Failed to load project.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjectData();

    const interval = setInterval(async () => {
      try {
        const client = createClient(`/api/projects/${projectId}`);
        const statsResponse = await client.get('/stats');
        if (isMounted) setStats(statsResponse.data);
      } catch (err) {
        console.error('Failed to refresh stats:', err);
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [projectId]);

  const curlCommand = useMemo(() => {
    if (!project) return '';
    return [
      `curl -X POST ${API_BASE}/api/public/${project.id}/messages \\`,
      `  -H "Content-Type: application/json" \\`,
      `  -d '{`,
      `    "room_id": "room:general",`,
      `    "message": "Hello Brodasta"`,
      `  }'`,
    ].join('\n');
  }, [project]);

  const wsConnectCommand = useMemo(() => {
    if (!project) return '';
    return [
      `# Install the SDK`,
      `npm install brodcasta-sdk`,
      ``,
      `# Connect to a room`,
      `import { BrodcastaClient } from 'brodcasta-sdk'`,
      ``,
      `const client = new BrodcastaClient({`,
      `  baseUrl: '${API_BASE}',`,
      `  projectId: '${project.id}',`,
      `})`,
      ``,
      `await client.connect()`,
      `await client.join('room:general')`,
      ``,
      `client.on('message', (msg) => {`,
      `  console.log('Received:', msg)`,
      `})`,
    ].join('\n');
  }, [project]);

  if (loading) {
    return <Loading fullScreen label="Loading project" />;
  }

  if (error || !project || !stats) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--app-muted)]">{error || 'Project unavailable'}</p>
        <Link to="/dashboard" className="button-primary mt-6 inline-block">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-16">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--app-text)] tracking-tight">
              {project.name}
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                project.is_active
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-[var(--app-surface-2)] text-[var(--app-muted)]'
              }`}
            >
              <span
                className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                  project.is_active ? 'bg-green-500' : 'bg-[var(--app-subtle)]'
                }`}
              />
              {project.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--app-muted)]">
            {formatAuthType(project.auth_type)} &middot; Created{' '}
            {formatDateTime(project.created_at)}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            to={`/dashboard/projects/${projectId}/playground`}
            className="button-primary inline-flex items-center gap-1.5 px-4 py-2 text-sm"
          >
            <Waves className="h-4 w-4" />
            Playground
          </Link>
          <Link
            to={`/dashboard/projects/${projectId}/settings`}
            className="button-secondary inline-flex items-center gap-1.5 px-4 py-2 text-sm"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <Section title="Live Metrics" description="Real-time connection and activity stats for this project.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Connections"
            value={formatCount(stats.total_connections)}
            sublabel={
              stats.websocket_connections > 0 || stats.sse_connections > 0
                ? `WS ${stats.websocket_connections ?? 0} · SSE ${stats.sse_connections ?? 0}`
                : null
            }
          />
          <StatCard label="Active Rooms" value={formatCount(stats.rooms_count ?? stats.active_rooms ?? 0)} />
          <StatCard
            label="Total Messages"
            value={formatCount(stats.total_messages ?? 0)}
            sublabel={stats.messages_today > 0 ? `${formatCount(stats.messages_today)} today` : null}
          />
          <StatCard label="Auth Type" value={formatAuthType(project.auth_type)} />
        </div>
      </Section>

      {/* ─── Quick Start / Curl like landing page ─── */}
      <Section title="Quick Start" description="Send your first message in seconds using curl or the JavaScript SDK.">
        <div className="border border-[var(--app-border)] rounded-xl overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/60" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs font-semibold uppercase tracking-widest text-[var(--app-subtle)]">
                Terminal
              </span>
            </div>
            <CopyButton text={curlCommand} label="Copy curl command" />
          </div>

          {/* Curl command */}
          <pre className="overflow-x-auto border-b border-[var(--app-border)] bg-[var(--app-bg)] p-5 text-sm font-mono leading-relaxed text-[var(--app-muted)]">
            <span className="text-[var(--app-subtle)]">$ </span>curl -X POST{' '}
            {API_BASE}/api/public/{project.id}/messages \<br />
            <span className="text-[var(--app-subtle)]">  </span>-H{' '}
            <span className="text-[var(--app-text)]">&quot;Content-Type: application/json&quot;</span>{' '}\<br />
            <span className="text-[var(--app-subtle)]">  </span>-d{' '}
            <span className="text-[var(--app-text)]">{`'{\n    "room_id": "room:general",\n    "message": "Hello brodcasta"\n  }'`}</span>
          </pre>

          {/* SDK example */}
          <div className="bg-[var(--app-surface)]">
            <div className="flex items-center justify-between border-b border-[var(--app-border)] px-5 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--app-subtle)]">
                JavaScript SDK
              </span>
              <CopyButton text={wsConnectCommand} label="Copy SDK example" />
            </div>
            <pre className="overflow-x-auto p-5 text-sm font-mono leading-relaxed text-[var(--app-muted)]">
              <span className="text-[var(--app-subtle)]"># </span>
              <span className="text-[var(--app-subtle)]">Install the SDK</span>
              <br />
              <span className="text-[var(--app-subtle)]">$ </span>npm install brodcasta-sdk
              <br />
              <br />
              <span className="text-[var(--app-subtle)]">// </span>
              <span className="text-[var(--app-subtle)]">Connect and listen for messages</span>
              <br />
              <span className="text-blue-500">import</span>{' '}
              <span className="text-[var(--app-text)]">{'{ BrodcastaClient }'}</span>{' '}
              <span className="text-blue-500">from</span>{' '}
              <span className="text-green-600">&apos;brodcasta-sdk&apos;</span>
              <br />
              <br />
              <span className="text-[var(--app-text)]">const client</span> ={' '}
              <span className="text-blue-500">new</span>{' '}
              <span className="text-[var(--app-text)]">BrodcastaClient</span>
              {'({'}
              <br />
              <span className="text-[var(--app-subtle)]">  </span>baseUrl:{' '}
              <span className="text-green-600">&apos;{API_BASE}&apos;</span>,
              <br />
              <span className="text-[var(--app-subtle)]">  </span>projectId:{' '}
              <span className="text-green-600">&apos;{project.id}&apos;</span>,
              <br />
              {'})'}
              <br />
              <br />
              <span className="text-[var(--app-muted)]">await</span>{' '}
              <span className="text-[var(--app-text)]">client.connect</span>()
              <br />
              <span className="text-[var(--app-muted)]">await</span>{' '}
              <span className="text-[var(--app-text)]">client.join</span>(
              <span className="text-green-600">&apos;room:general&apos;</span>)
              <br />
              <br />
              <span className="text-[var(--app-text)]">client.on</span>(
              <span className="text-green-600">&apos;message&apos;</span>,{' '}
              <span className="text-[var(--app-text)]">(msg)</span> =&gt; {'{'}
              <br />
              <span className="text-[var(--app-subtle)]">  </span>console.log(
              <span className="text-green-600">&apos;Received:&apos;</span>, msg)
              <br />
              {'})'}
            </pre>
          </div>
        </div>
      </Section>

      {/* ─── Project Details ─── */}
      <Section title="Project Details" description="Credentials and metadata for this project.">
        <div className="divide-y divide-[var(--app-border)] rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)]">
          <DetailRow label="Project ID" value={project.id} copyable />
          <DetailRow
            label="Project Secret"
            value={secretRevealed ? project.project_secret : maskSecret(project.project_secret)}
            copyable={secretRevealed}
            action={
              <button
                type="button"
                onClick={() => setSecretRevealed((v) => !v)}
                className="text-xs font-medium text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors cursor-pointer"
              >
                {secretRevealed ? 'Hide' : 'Reveal'}
              </button>
            }
          />
          <DetailRow label="Auth Type" value={formatAuthType(project.auth_type)} />
          <DetailRow
            label="Max Connections"
            value={formatCount(project.max_connections)}
          />
          <DetailRow
            label="Allowed Origins"
            value={
              project.allowed_origins?.length
                ? project.allowed_origins.join(', ')
                : 'All origins allowed'
            }
          />
          <DetailRow
            label="Created"
            value={formatDateTime(project.created_at)}
          />
        </div>
      </Section>

      {/* ─── Navigation ─── */}
      <Section title="Explore">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <QuickLink
            to={`/dashboard/projects/${projectId}/analytics`}
            title="Analytics"
            description="View charts, events, and export data."
          />
          <QuickLink
            to={`/dashboard/projects/${projectId}/messages`}
            title="Messages"
            description="Browse and search historical messages."
          />
          <QuickLink
            to={`/dashboard/projects/${projectId}/api-keys`}
            title="API Keys"
            description="Manage credentials and authentication."
          />
        </div>
      </Section>
    </div>
  );
};

const DetailRow = ({ label, value, copyable, action }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!copyable) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, [copyable, value]);

  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-sm text-[var(--app-muted)]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[var(--app-text)] font-mono">
          {value}
        </span>
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className="text-[var(--app-subtle)] hover:text-[var(--app-text)] transition-colors cursor-pointer"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Clipboard className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        {action}
      </div>
    </div>
  );
};

const QuickLink = ({ to, title, description }) => (
  <Link
    to={to}
    className="group rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 transition-all hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-2)]"
  >
    <h3 className="text-sm font-semibold text-[var(--app-text)] group-hover:text-[var(--app-primary-strong)] transition-colors">
      {title}
      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
    </h3>
    <p className="mt-1 text-xs text-[var(--app-muted)]">{description}</p>
  </Link>
);

export default ProjectOverview;
