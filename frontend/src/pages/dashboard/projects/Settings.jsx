import { AlertTriangle, Check, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
import { Field, PageHeader, SectionHeader, StatusBadge, Surface } from '../../../components/ui/System';
import { createClient } from '../../../utils/client';
import { formatAuthType } from '../../../utils/formatters';

const ProjectSettings = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    authType: 'none',
    historyEnabled: false,
  });
  const [rotatedSecret, setRotatedSecret] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const client = createClient(`/api/projects/${projectId}`);
        const { data } = await client.get('/');
        setProject(data);
        setFormData({
          name: data.name,
          authType: data.auth_type,
          historyEnabled: data.history_enabled,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load project settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSaveProject = async () => {
    setWorking(true);
    setError('');
    setSuccess('');

    try {
      const client = createClient(`/api/projects/${projectId}`);
      const { data } = await client.put('/update', {
        name: formData.name,
        auth_type: formData.authType,
        history_enabled: formData.historyEnabled,
      });
      setProject(data);
      setSuccess('Project settings saved.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to update project.');
    } finally {
      setWorking(false);
    }
  };

  const handleRotateSecret = async () => {
    setWorking(true);
    setError('');
    setSuccess('');

    try {
      const client = createClient('/api');
      const response = await client.post(`/projects/${projectId}/rotate-secret`);
      setRotatedSecret(response.data.project_secret);
      setSuccess('Project secret rotated. Update downstream consumers right away.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to rotate project secret.');
    } finally {
      setWorking(false);
    }
  };

  const handleDeleteProject = async () => {
    if (deleteConfirmText !== project?.name) return;

    setWorking(true);
    setError('');
    setSuccess('');

    try {
      const client = createClient('/api/projects');
      await client.delete(`/${projectId}`);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to delete project.');
      setWorking(false);
    }
  };

  if (loading) {
    return <Loading fullScreen label="Loading project settings" />;
  }

  if (!project) {
    return (
      <Surface className="rounded-[2rem] p-8">
        <p className="text-xl font-semibold text-white">Project unavailable</p>
        <p className="mt-3 text-[var(--app-muted)]">{error || 'Try again later.'}</p>
      </Surface>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Project Settings"
        title="Configuration, credentials, and irreversible actions."
        description="The settings page is now grouped by intent so routine edits and high-risk actions are easier to separate."
        meta={
          <>
            <StatusBadge tone="info">{formatAuthType(project.auth_type)}</StatusBadge>
            <StatusBadge tone={project.history_enabled ? 'success' : 'neutral'}>
              History {project.history_enabled ? 'enabled' : 'disabled'}
            </StatusBadge>
          </>
        }
        actions={
          <button type="button" className="button-primary" onClick={handleSaveProject} disabled={working}>
            {working ? 'Saving...' : 'Save changes'}
          </button>
        }
      />

      {success ? (
        <div className="rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-50">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="rounded-[2rem] p-6 sm:p-8">
          <SectionHeader
            eyebrow="General"
            title="Project configuration"
            description="These are the settings you are most likely to revisit as your integration evolves."
          />

          <div className="mt-6 space-y-5">
            <Field htmlFor="project-settings-name" label="Project name">
              <input
                id="project-settings-name"
                type="text"
                className="input-shell"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              />
            </Field>

            <Field htmlFor="project-settings-auth" label="Authentication mode">
              <select
                id="project-settings-auth"
                className="select-shell"
                value={formData.authType}
                onChange={(event) => setFormData((current) => ({ ...current, authType: event.target.value }))}
              >
                <option value="none">Public</option>
                <option value="publishing_only">Publish protected</option>
                <option value="all">Full auth</option>
              </select>
            </Field>

            <label className="flex cursor-pointer items-start gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
              <input
                type="checkbox"
                checked={formData.historyEnabled}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, historyEnabled: event.target.checked }))
                }
                className="mt-1 h-5 w-5 rounded border border-white/12 bg-slate-950/80 text-cyan-300"
              />
              <div>
                <p className="text-sm font-semibold text-white">Enable message history</p>
                <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">
                  Store project message history for analytics, debugging, and replay-oriented workflows.
                </p>
              </div>
            </label>
          </div>
        </Surface>

        <div className="space-y-6">
          <Surface tone="highlight" className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="Credentials"
              title="Rotate the secret when exposure is suspected"
              description="This action is intentionally isolated from routine settings so it is harder to trigger casually."
            />

            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Current auth posture</p>
                <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">
                  {formData.authType === 'none' &&
                    'Anyone can publish and subscribe without authentication.'}
                  {formData.authType === 'publishing_only' &&
                    'Publishing is protected while subscribers can read publicly.'}
                  {formData.authType === 'all' &&
                    'Both publishers and subscribers must authenticate.'}
                </p>
              </div>

              <button type="button" className="button-primary" onClick={handleRotateSecret} disabled={working}>
                <RefreshCw className="h-4 w-4" />
                Rotate project secret
              </button>

              {rotatedSecret ? (
                <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <div className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 text-emerald-200" />
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">New secret generated</p>
                      <p className="font-mono text-xs leading-7 text-emerald-50 break-all">
                        {rotatedSecret}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Surface>

          <Surface tone="danger" className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="Danger Zone"
              title="Delete this project"
              description="Deleting removes the project from your control panel. Type the project name exactly to continue."
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 rounded-[1.5rem] border border-rose-400/18 bg-rose-400/[0.08] p-4">
                <AlertTriangle className="mt-1 h-4 w-4 text-rose-200" />
                <p className="text-sm leading-7 text-rose-50">
                  This action cannot be undone. Remove dependent integrations before you delete the project.
                </p>
              </div>

              <Field htmlFor="delete-project-name" label={`Type "${project.name}" to confirm`}>
                <input
                  id="delete-project-name"
                  type="text"
                  className="input-shell"
                  value={deleteConfirmText}
                  onChange={(event) => setDeleteConfirmText(event.target.value)}
                />
              </Field>

              <button
                type="button"
                className="button-secondary text-rose-100 hover:bg-rose-400/10"
                disabled={deleteConfirmText !== project.name || working}
                onClick={handleDeleteProject}
              >
                <Trash2 className="h-4 w-4" />
                Permanently delete project
              </button>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
