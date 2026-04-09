import { Activity, Waves } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
import { createClient } from '../../../utils/client';
import { formatAuthType, formatCount } from '../../../utils/formatters';

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

  if (loading) {
    return <Loading fullScreen label="Loading project" />;
  }

  if (error || !project || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--app-muted)]">{error || 'Project unavailable'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--app-text)]">{project.name}</h1>
          <p className="text-sm text-[var(--app-muted)]">{formatAuthType(project.auth_type)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
          <p className="text-xs text-[var(--app-subtle)]">Connections</p>
          <p className="text-lg font-semibold text-[var(--app-text)]">{formatCount(stats.total_connections)}</p>
        </div>
        <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
          <p className="text-xs text-[var(--app-subtle)]">WebSocket</p>
          <p className="text-lg font-semibold text-[var(--app-text)]">{formatCount(stats.websocket_connections)}</p>
        </div>
        <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
          <p className="text-xs text-[var(--app-subtle)]">SSE</p>
          <p className="text-lg font-semibold text-[var(--app-text)]">{formatCount(stats.sse_connections)}</p>
        </div>
        <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
          <p className="text-xs text-[var(--app-subtle)]">Rooms</p>
          <p className="text-lg font-semibold text-[var(--app-text)]">{formatCount(stats.rooms_count)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Link to={`/dashboard/projects/${projectId}/api-keys`} className="button-primary text-sm px-3 py-1.5">
          Credentials
        </Link>
        <Link to={`/dashboard/projects/${projectId}/playground`} className="button-secondary text-sm px-3 py-1.5">
          Playground
        </Link>
        <Link to={`/dashboard/projects/${projectId}/messages`} className="button-secondary text-sm px-3 py-1.5">
          Messages
        </Link>
      </div>
    </div>
  );
};

export default ProjectOverview;