import { AlertTriangle, Check, Edit3, RotateCcw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
import { createClient } from '../../../utils/client';

const ProjectSettings = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({ name: '', authType: 'none', historyEnabled: false });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRotatingSecret, setIsRotatingSecret] = useState(false);
    const [newSecret, setNewSecret] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const client = createClient(`/api/projects/${projectId}`);
                const { data } = await client.get('/');
                setProject(data);
                setFormData({
                    name: data.name,
                    authType: data.auth_type,
                    historyEnabled: data.history_enabled
                });
            } catch (err) {
                setError('Failed to load project settings.');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleSaveProject = async () => {
        setIsSaving(true);
        setError('');
        try {
            const client = createClient(`/api/projects/${projectId}`);
            const { data } = await client.put('/', {
                name: formData.name,
                auth_type: formData.authType,
                history_enabled: formData.historyEnabled
            });
            setProject(data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update project.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <Loading fullScreen />;

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-300 pb-8">
                <div>
                    <h1 className="text-3xl font-bold">Project Settings</h1>
                    <p className="text-base-content/60 mt-1">Manage your project configuration and security settings</p>
                </div>
                <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
                            <X size={14} /> Cancel
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={handleSaveProject} disabled={isSaving}>
                            {isSaving ? <span className="loading loading-spinner loading-xs" /> : <Check size={14} />}
                            Save Changes
                        </button>
                    </>
                ) : (
                    <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(true)}>
                        <Edit3 size={14} /> Edit Settings
                    </button>
                )}
            </div>
            </header>

            {error && (
                <div className="alert alert-error">
                    <AlertTriangle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {/* General Settings */}
            <section className="bg-base-100 rounded-xl border border-base-300">
                <div className="p-6 border-b border-base-300">
                    <h2 className="text-lg font-semibold">General Configuration</h2>
                    <p className="text-sm text-base-content/60 mt-1">Basic project settings and preferences</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Project Name</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Enter project name"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Authentication Type</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={formData.authType}
                            onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                            disabled={!isEditing}
                        >
                            <option value="none">No Authentication</option>
                            <option value="api_key">API Key Required</option>
                            <option value="jwt">JWT Required</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text font-medium">Enable Message History</span>
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={formData.historyEnabled}
                                onChange={(e) => setFormData({ ...formData, historyEnabled: e.target.checked })}
                                disabled={!isEditing}
                            />
                        </label>
                        <label className="label">
                            <span className="label-text-alt text-base-content/60">Store message history for analytics and debugging</span>
                        </label>
                    </div>
                </div>
            </section>

            {/* Security Settings */}
            <section className="bg-base-100 rounded-xl border border-base-300">
                <div className="p-6 border-b border-base-300">
                    <h2 className="text-lg font-semibold">Security</h2>
                    <p className="text-sm text-base-content/60 mt-1">Manage project secrets and access credentials</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="alert alert-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <h3 className="font-bold">Project Secret</h3>
                            <div className="text-xs">Keep this secret secure. Rotate it if you suspect it has been compromised.</div>
                        </div>
                    </div>

                    {newSecret && (
                        <div className="alert alert-success">
                            <Check size={16} />
                            <div>
                                <h3 className="font-bold">New Secret Generated</h3>
                                <div className="text-sm mt-2">Copy this secret immediately. It won't be shown again.</div>
                                <div className="font-mono text-xs bg-base-200 p-2 rounded mt-2 select-all">
                                    {newSecret}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Rotate Project Secret</h3>
                            <p className="text-sm text-base-content/60">Generate a new project secret</p>
                        </div>
                        <button 
                            className="btn btn-warning btn-sm" 
                            onClick={() => {/* handleRotateSecret */}} 
                        >
                            <RotateCcw size={14} /> Rotate Secret
                        </button>
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-base-100 rounded-xl border border-error/20">
                <div className="p-6 border-b border-error/20 bg-error/5">
                    <h2 className="text-lg font-semibold text-error">Danger Zone</h2>
                    <p className="text-sm text-error/80 mt-1">Irreversible actions that affect your project</p>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">Delete Project</h3>
                            <p className="text-sm text-base-content/60 mb-4">Permanently delete this project and all associated data. This action cannot be undone.</p>
                        </div>
                        
                        {!showDeleteConfirm ? (
                            <button className="btn btn-error btn-sm" onClick={() => setShowDeleteConfirm(true)}>
                                Delete Project
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Type <span className="font-bold text-error">{project?.name}</span> to confirm deletion</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered border-error/50"
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        placeholder="Project name"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        className="btn btn-error btn-sm" 
                                        onClick={() => {/* handleDelete */}} 
                                        disabled={deleteConfirmText !== project?.name}
                                    >
                                        Confirm Delete
                                    </button>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setShowDeleteConfirm(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProjectSettings;