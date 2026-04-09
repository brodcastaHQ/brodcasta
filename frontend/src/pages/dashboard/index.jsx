import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../../components/ProjectCard';
import Loading from '../../components/ui/Loading';
import { createClient } from '../../utils/client';

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

  if (loading) {
    return <Loading fullScreen label="Loading projects" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--app-muted)]">{error}</p>
        <Link to="/dashboard/new" className="button-primary mt-4 inline-block">
          Create project
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-lg font-medium text-[var(--app-text)]">Projects</h1>
        <Link to="/dashboard/new" className="button-primary text-sm px-3 py-1.5">
          <Plus className="mr-1 inline h-4 w-4" />
          New
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--app-muted)]">No projects yet</p>
          <Link to="/dashboard/new" className="button-primary mt-4 inline-block">
            Create project
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;