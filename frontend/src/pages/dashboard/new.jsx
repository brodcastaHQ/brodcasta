import { ChevronLeft, Info } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '../../utils/client';

const NewProject = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // AuthType options: 'none', 'publishing_only', 'all'
    const [formData, setFormData] = useState({
        name: '',
        auth_type: 'none',
        history_enabled: true
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const client = createClient('/api/projects');
            const response = await client.post('/', formData);
            // Redirect to the dashboard project list or the new project's specific dashboard
            // Based on plan, we have a project dashboard at /dashboard/projects/:id
            navigate(`/dashboard/projects/${response.data.id}`);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to create project.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-md gap-2 mb-6 text-base-content/60 px-0 hover:bg-transparent hover:text-primary">
                <ChevronLeft size={18} />
                Back
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Create new app</h1>
                <p className="text-base-content/60">Configure your new application settings.</p>
            </div>

            {error && (
                <div role="alert" className="alert alert-error mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-base-100 rounded-xl border border-base-200 p-6 -md">
                    <h2 className="text-lg font-bold mb-4">General Information</h2>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium">App Name</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Production API"
                            className="input input-bordered w-full"
                            required
                        />
                        <label className="label">
                            <span className="label-text-alt text-base-content/50">Used to identify your app in the dashboard.</span>
                        </label>
                    </div>
                </div>

                {/* Configuration */}
                <div className="bg-base-100 rounded-xl border border-base-200 p-6 -md">
                    <h2 className="text-lg font-bold mb-4">Configuration</h2>

                    <div className="form-control w-full mb-6">
                        <label className="label">
                            <span className="label-text font-medium">Authentication Type</span>
                        </label>
                        <select
                            name="auth_type"
                            value={formData.auth_type}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                        >
                            <option value="none">None (Public)</option>
                            <option value="publishing_only">Publishing Only (Subscribers are public)</option>
                            <option value="all">All (Full Authentication)</option>
                        </select>
                        <div className="mt-2 flex gap-2 text-xs text-base-content/60 bg-base-200 p-3 rounded-lg">
                            <Info size={16} className="shrink-0 mt-0.5" />
                            <p>
                                <strong>None:</strong> Open access.
                                <strong> Publishing Only:</strong> Requires auth to publish, but reading is open.
                                <strong> All:</strong> Requires auth for both publishing and subscribing.
                            </p>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4 items-start">
                            <input
                                type="checkbox"
                                name="history_enabled"
                                checked={formData.history_enabled}
                                onChange={handleChange}
                                className="toggle toggle-primary"
                            />
                            <div>
                                <span className="label-text font-medium block">Enable Message History</span>
                                <span className="label-text-alt text-base-content/50 block mt-1">
                                    Automatically store and retrieve recent messages for new subscribers.
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost" disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary min-w-[120px]" disabled={loading}>
                        {loading ? <span className="loading loading-spinner text-white"></span> : 'Create App'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewProject;
