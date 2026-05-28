import { createElement, useEffect, useState } from 'react';
import {
  ChevronDown,
  LayoutDashboard,
  SquarePlus,
  List,
  MessageSquare,
  BarChart3,
  KeyRound,
  Terminal,
  Settings,
  UserCog,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { cn } from '../utils/cn';
import { createClient } from '../utils/client';

const navLinkClassName = ({ isActive }) =>
  cn(
    'flex items-center gap-3 px-6 py-2.5 text-sm transition-colors rounded-none',
    isActive
      ? 'text-[var(--app-text)] font-semibold'
      : 'text-[var(--app-muted)] hover:text-[var(--app-text)]',
  );

const sectionLabel = 'px-6 pt-5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--app-subtle)]';

const Sidebar = ({ open = false, onClose = () => {} }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const client = createClient('/api/projects');
        const response = await client.get('/');
        setProjects(response.data);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const currentProject = projects.find((p) => p.id === projectId) || projects[0] || null;

  const handleProjectSelect = (project) => {
    const base = '/dashboard/projects/';
    const suffix = projectId
      ? location.pathname.replace(`${base}${projectId}`, '')
      : '';
    setDropdownOpen(false);
    onClose();
    navigate(`${base}${project.id}${suffix}`);
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/20 transition-opacity duration-200 xl:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--app-border)] bg-[var(--app-surface)] transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full xl:translate-x-0',
        )}
      >
        <div className="flex items-center gap-3 border-b border-[var(--app-border)] px-6 py-5">
          <NavLink to="/" className="flex items-center gap-3" onClick={onClose}>
            <img src="/logo.svg" alt="Brodcasta" className="h-6 w-6" />
            <p className="text-sm font-semibold text-[var(--app-text)]">Brodcasta</p>
          </NavLink>
        </div>

        <div className="relative border-b border-[var(--app-border)] px-4 py-4">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white px-3 py-2.5 text-sm text-[var(--app-text)] transition-colors hover:bg-[var(--app-surface-2)] dark:bg-[var(--app-surface-2)]"
          >
            <span className="truncate font-medium">
              {projectsLoading
                ? 'Loading...'
                : currentProject
                  ? currentProject.name
                  : 'Select project'}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 text-[var(--app-muted)] transition-transform',
                dropdownOpen && 'rotate-180',
              )}
            />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute left-4 right-4 top-full z-20 mt-1.5 rounded-xl border border-[var(--app-border)] bg-white py-1 shadow-lg dark:bg-[var(--app-surface-2)]">
                {projectsLoading ? (
                  <div className="px-4 py-2.5 text-sm text-[var(--app-subtle)]">Loading...</div>
                ) : projects.length === 0 ? (
                  <div className="px-4 py-2.5 text-sm text-[var(--app-subtle)]">No projects</div>
                ) : (
                  projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => handleProjectSelect(project)}
                      className={cn(
                        'flex w-full cursor-pointer items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--app-surface-2)]',
                        project.id === projectId
                          ? 'font-medium text-[var(--app-text)]'
                          : 'text-[var(--app-muted)]',
                      )}
                    >
                      {project.name}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto pb-5">
          <p className={sectionLabel}>General</p>
          <NavLink to="/dashboard" end className={navLinkClassName} onClick={onClose}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/new" className={navLinkClassName} onClick={onClose}>
            <SquarePlus className="h-4 w-4" />
            New Project
          </NavLink>

          <p className={sectionLabel}>Project</p>
          {currentProject ? (
            <>
              <NavLink to={`/dashboard/projects/${currentProject.id}`} end className={navLinkClassName} onClick={onClose}>
                <List className="h-4 w-4" />
                Overview
              </NavLink>
              <NavLink to={`/dashboard/projects/${currentProject.id}/messages`} className={navLinkClassName} onClick={onClose}>
                <MessageSquare className="h-4 w-4" />
                Messages
              </NavLink>
              <NavLink to={`/dashboard/projects/${currentProject.id}/analytics`} className={navLinkClassName} onClick={onClose}>
                <BarChart3 className="h-4 w-4" />
                Analytics
              </NavLink>
              <NavLink to={`/dashboard/projects/${currentProject.id}/api-keys`} className={navLinkClassName} onClick={onClose}>
                <KeyRound className="h-4 w-4" />
                Credentials
              </NavLink>
              <NavLink to={`/dashboard/projects/${currentProject.id}/playground`} className={navLinkClassName} onClick={onClose}>
                <Terminal className="h-4 w-4" />
                Playground
              </NavLink>
              <NavLink to={`/dashboard/projects/${currentProject.id}/settings`} className={navLinkClassName} onClick={onClose}>
                <Settings className="h-4 w-4" />
                Settings
              </NavLink>
            </>
          ) : (
            <p className="px-6 py-3 text-xs text-[var(--app-subtle)]">
              Create or select a project
            </p>
          )}

          <p className={sectionLabel}>Account</p>
          <NavLink to="/dashboard/settings" className={navLinkClassName} onClick={onClose}>
            <UserCog className="h-4 w-4" />
            Account Settings
          </NavLink>
        </nav>

        <div className="border-t border-[var(--app-border)] px-6 py-4 text-xs text-[var(--app-subtle)]">
          v0.1
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
