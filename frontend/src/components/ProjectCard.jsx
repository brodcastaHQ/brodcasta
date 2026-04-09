import { ArrowRight, Circle, RadioTower } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatAuthType, formatCount, formatDate } from '../utils/formatters';

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/dashboard/projects/${project.id}`}
      className="flex items-center justify-between rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3 transition-colors hover:bg-[var(--app-surface-2)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--app-border)]">
          <RadioTower className="h-4 w-4 text-[var(--app-muted)]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--app-text)]">{project.name}</p>
          <p className="text-xs text-[var(--app-muted)]">
            {formatAuthType(project.auth_type)} · {formatCount(project.total_connections)} conn
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Circle
          className={`h-2 w-2 fill-current ${
            project.total_connections > 0 ? 'text-green-500' : 'text-[var(--app-muted)]'
          }`}
        />
        <ArrowRight className="h-4 w-4 text-[var(--app-muted)]" />
      </div>
    </Link>
  );
};

export default ProjectCard;