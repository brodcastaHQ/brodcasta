import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/ui/Loading';
import { createClient } from '../../utils/client';

const authOptions = [
  { value: 'none', label: 'Public' },
  { value: 'publishing_only', label: 'Publish only' },
  { value: 'all', label: 'Full auth' },
];

const NewProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    auth_type: 'none',
    history_enabled: true,
  });

  const handleChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((current) => ({ ...current, [event.target.name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const client = createClient('/api/projects');
      const response = await client.post('/', formData);
      navigate(`/dashboard/projects/${response.data.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      {loading ? <Loading fullScreen label="Creating project" /> : null}

      <Link to="/dashboard" className="text-sm text-[var(--app-muted)] hover:text-[var(--app-text)]">
        <ArrowLeft className="mr-1 inline h-4 w-4" />
        Back
      </Link>

      <h1 className="mt-4 text-xl font-semibold text-[var(--app-text)]">New Project</h1>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : null}

        <div>
          <label className="block text-sm font-medium text-[var(--app-text)]">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Project name"
            className="input-shell mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--app-text)]">Auth</label>
          <select
            name="auth_type"
            value={formData.auth_type}
            onChange={handleChange}
            className="select-shell mt-1"
          >
            {authOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="history_enabled"
            checked={formData.history_enabled}
            onChange={handleChange}
            className="h-4 w-4 rounded border-[var(--app-border)]"
          />
          <span className="text-sm text-[var(--app-muted)]">Message history</span>
        </label>

        <div className="flex gap-2 pt-2">
          <button type="button" className="button-secondary flex-1" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="button-primary flex-1" disabled={loading}>
            Create
            <ArrowRight className="ml-1 inline h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProject;