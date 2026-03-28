import { ArrowRight, LockKeyhole, RadioTower, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge, Surface } from './ui/System';
import { formatAuthType, formatCount, formatDate } from '../utils/formatters';

const ProjectCard = ({ project }) => {
  return (
    <Surface className="flex flex-col rounded-[2rem] p-8" interactive>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={project.total_connections ? 'success' : 'neutral'}>
              {project.total_connections ? 'Live traffic' : 'Idle'}
            </StatusBadge>
            <StatusBadge tone="info">{formatAuthType(project.auth_type)}</StatusBadge>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white">{project.name}</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">
              Created {formatDate(project.created_at)}. Message history is{' '}
              {project.history_enabled ? 'enabled' : 'disabled'} for this project.
            </p>
          </div>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/18 bg-cyan-400/10 text-cyan-200">
          <RadioTower className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[repeat(3,minmax(0,220px))]">
        <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
            Connections
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatCount(project.total_connections)}</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
            Rooms
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatCount(project.rooms_count)}</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
            Transport
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Waves className="h-4 w-4 text-cyan-200" />
            WS {formatCount(project.websocket_connections)} / SSE {formatCount(project.sse_connections)}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-white/8 pt-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-sm text-[var(--app-muted)]">
          <LockKeyhole className="h-4 w-4 text-emerald-300" />
          Scoped credentials and per-project auth rules
        </div>
        <Link to={`/dashboard/projects/${project.id}`} className="button-secondary">
          Open project
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Surface>
  );
};

export default ProjectCard;
