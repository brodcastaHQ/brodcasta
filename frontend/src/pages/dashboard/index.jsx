import {
  Activity,
  BookOpen,
  FolderKanban,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../../components/ProjectCard';
import Loading from '../../components/ui/Loading';
import { EmptyState, MetricCard, PageHeader, SectionHeader, Surface } from '../../components/ui/System';
import { createClient } from '../../utils/client';
import { formatCount } from '../../utils/formatters';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const client = createClient('/api/projects');
        const response = await client.get('/');
        setProjects(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totals = {
    projects: projects.length,
    connections: projects.reduce((sum, project) => sum + (project.total_connections || 0), 0),
    rooms: projects.reduce((sum, project) => sum + (project.rooms_count || 0), 0),
    secured: projects.filter((project) => project.auth_type !== 'none').length,
  };

  if (loading) {
    return <Loading fullScreen label="Loading projects" />;
  }

  if (error) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="We couldn't load your projects"
        description={error}
        action={
          <Link to="/dashboard/new" className="button-primary">
            Create a project
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-10">
      <Surface tone="highlight" className="overflow-hidden rounded-[2.25rem] px-6 py-8 sm:px-8 sm:py-10">
        <PageHeader
          eyebrow="Control Center"
          title="A cleaner view of your realtime estate."
          description="Projects, transport health, auth posture, and onboarding now share a calmer layout with tighter hierarchy and clearer actions."
          meta={
            <>
              <span className="tag tag-info">Projects {formatCount(totals.projects)}</span>
              <span className="tag tag-success">Connections {formatCount(totals.connections)}</span>
              <span className="tag">Rooms {formatCount(totals.rooms)}</span>
            </>
          }
          actions={
            <>
              <a
                href="https://docs.Brodcasta.dev"
                target="_blank"
                rel="noreferrer"
                className="button-secondary"
              >
                <BookOpen className="h-4 w-4" />
                Read docs
              </a>
              <Link to="/dashboard/new" className="button-primary">
                <Plus className="h-4 w-4" />
                New project
              </Link>
            </>
          }
        />
      </Surface>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={FolderKanban}
          label="Projects"
          value={formatCount(totals.projects)}
          meta="Workspaces currently available in this account."
        />
        <MetricCard
          icon={Activity}
          label="Live Connections"
          value={formatCount(totals.connections)}
          meta="Combined active WebSocket and SSE connections."
          tone="success"
        />
        <MetricCard
          icon={ShieldCheck}
          label="Secured Projects"
          value={formatCount(totals.secured)}
          meta="Projects with publish-only or full authentication."
        />
        <MetricCard
          icon={BookOpen}
          label="Rooms"
          value={formatCount(totals.rooms)}
          meta="Known room count across all currently loaded projects."
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Projects"
            title="Manage the systems that carry your live traffic."
            description="Each project surfaces transport health, connection volume, and auth posture before you even open it."
          />

          {projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to get connection credentials, analytics, and the operator console."
              action={
                <Link to="/dashboard/new" className="button-primary">
                  <Plus className="h-4 w-4" />
                  Create first project
                </Link>
              }
            />
          ) : (
            <div className="space-y-5">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Surface className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="Launch flow"
              title="Recommended first steps"
              description="A shorter path from an empty control panel to live traffic."
            />

            <div className="mt-6 space-y-4">
              {[
                'Create a project and choose the auth model that matches your risk profile.',
                'Copy the project credentials into your SDK or service integration.',
                'Use the playground and analytics views to verify message flow and fallback behavior.',
              ].map((step, index) => (
                <div key={step} className="flex gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/18 bg-cyan-400/10 text-sm font-semibold text-cyan-100">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-100">{step}</p>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
