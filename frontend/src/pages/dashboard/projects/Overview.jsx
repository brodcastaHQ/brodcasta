import {
  Activity,
  ArrowRight,
  BookOpen,
  KeyRound,
  ShieldCheck,
  Waves,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
import { MetricCard, PageHeader, SectionHeader, StatusBadge, Surface } from '../../../components/ui/System';
import { createClient } from '../../../utils/client';
import { formatAuthType, formatCount, formatDate } from '../../../utils/formatters';

const ProjectOverview = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchProjectData = async () => {
      try {
        const client = createClient(`/api/projects/${projectId}`);
        const [projectResponse, statsResponse] = await Promise.all([client.get('/'), client.get('/stats')]);

        if (!isMounted) return;
        setProject(projectResponse.data);
        setStats(statsResponse.data);
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Failed to load project details.');
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
        console.error('Failed to refresh project stats:', err);
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [projectId]);

  if (loading) {
    return <Loading fullScreen label="Loading project overview" />;
  }

  if (error || !project || !stats) {
    return (
      <Surface className="rounded-[2rem] p-8">
        <p className="text-xl font-semibold text-white">Project unavailable</p>
        <p className="mt-3 text-[var(--app-muted)]">{error || 'Try refreshing the control panel.'}</p>
      </Surface>
    );
  }

  return (
    <div className="space-y-8">
      <Surface tone="highlight" className="overflow-hidden rounded-[2.25rem] px-6 py-8 sm:px-8 sm:py-10">
        <PageHeader
          eyebrow="Project Overview"
          title={project.name}
          description="A tighter project landing surface for traffic, auth posture, and integration details."
          meta={
            <>
              <StatusBadge tone="success">Project live</StatusBadge>
              <StatusBadge tone="info">{formatAuthType(project.auth_type)}</StatusBadge>
              <StatusBadge tone="neutral">Created {formatDate(project.created_at)}</StatusBadge>
            </>
          }
          actions={
            <a
              href="https://docs.Brodcasta.dev"
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
            >
              <BookOpen className="h-4 w-4" />
              Docs
            </a>
          }
        />
      </Surface>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Activity}
          label="Connections"
          value={formatCount(stats.total_connections)}
          meta="Combined active clients across all transports."
        />
        <MetricCard
          icon={Waves}
          label="WebSocket Clients"
          value={formatCount(stats.websocket_connections)}
          meta="Connections currently using native WebSockets."
          tone="success"
        />
        <MetricCard
          icon={Waves}
          label="SSE Clients"
          value={formatCount(stats.sse_connections)}
          meta="Clients currently using the fallback transport."
        />
        <MetricCard
          icon={ShieldCheck}
          label="Rooms"
          value={formatCount(stats.rooms_count)}
          meta="Known active room count inside this project."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface className="rounded-[2rem] p-6 sm:p-8">
          <SectionHeader
            eyebrow="Quick integration"
            title="Connect the SDK with the project credentials"
            description="The overview now leads with the code path teams need most often instead of decorative banners."
          />

          <div className="mt-6 code-panel">
            <pre>
              <span className="token-comment">// install</span>{'\n'}
              npm install brodcasta-sdk{'\n'}
              {'\n'}
              <span className="token-comment">// connect</span>{'\n'}
              <span className="token-keyword">import</span> {'{'} <span className="token-accent">BrodcastaClient</span> {'}'}{' '}
              <span className="token-keyword">from</span> <span className="token-string">'brodcasta-sdk'</span>{'\n'}
              {'\n'}
              <span className="token-keyword">const</span> projectConfig = <span className="token-keyword">await</span>{' '}
              <span className="token-accent">loadProjectConfig</span>(){'\n'}
              {'\n'}
              <span className="token-keyword">const</span> client = <span className="token-keyword">new</span>{' '}
              <span className="token-accent">BrodcastaClient</span>({'\n'}
              {'  '}baseUrl: <span className="token-string">'https://your-instance.example'</span>,{'\n'}
              {'  '}...projectConfig,{'\n'}
              {'  '}projectSecret: <span className="token-string">'rotate-from-credentials'</span>,{'\n'}
              {'  '}room: <span className="token-string">'general'</span>,{'\n'}
              {'}'}){'\n'}
              {'\n'}
              <span className="token-keyword">await</span> client.connect(){'\n'}
              client.onEvent(<span className="token-string">'message.received'</span>, console.log)
            </pre>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/dashboard/projects/${projectId}/api-keys`} className="button-primary">
              <KeyRound className="h-4 w-4" />
              View credentials
            </Link>
            <Link to={`/dashboard/projects/${projectId}/playground`} className="button-secondary">
              Open playground
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Surface>

        <div className="space-y-6">
          <Surface tone="muted" className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="Configuration"
              title="Project posture"
              description="Quick answers to the things operators usually need to confirm first."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
                  Auth mode
                </p>
                <p className="mt-3 text-lg font-semibold text-white">{formatAuthType(project.auth_type)}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
                  History
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {project.history_enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </Surface>

          <Surface className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="Operational note"
              title="What the new layout optimizes for"
              description="Fast scanning, smaller visual jumps, and clearer hierarchy between traffic metrics and project configuration."
            />

            <div className="mt-6 space-y-3">
              {[
                'Metrics sit first because they answer “is it healthy?” immediately.',
                'Credentials and integration move closer together to shorten setup loops.',
                'Project settings remain separate from live traffic to reduce accidental actions.',
              ].map((line) => (
                <div key={line} className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-100">
                  {line}
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
