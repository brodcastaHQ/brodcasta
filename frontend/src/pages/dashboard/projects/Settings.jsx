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
            {/* Flat Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-300 pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
                    <p className="text-base-content/60 mt-1">System configuration and security protocols.</p>
                </div>
                <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <button className="btn btn-ghost border border-base-300 btn-sm rounded-lg" onClick={() => setIsEditing(false)} disabled={isSaving}>
                            <X size={14} /> Cancel
                        </button>
                        <button className="btn btn-primary btn-sm rounded-lg" onClick={handleSaveProject} disabled={isSaving}>
                            {isSaving ? <span className="loading loading-spinner loading-xs" /> : <Check size={14} />}
                            Save Changes
                        </button>
                    </>
                ) : (
                    <button className="btn btn-outline border-base-300 btn-sm rounded-lg" onClick={() => setIsEditing(true)}>
                        <Edit3 size={14} /> Edit Settings
                    </button>
                )}
            </div>
            </header>

            {error && (
                <div className="flex items-center gap-3 p-4 border border-error text-error bg-error/5 rounded-lg">
                    <AlertTriangle size={14} />
                    <span className="text-sm font-bold uppercase tracking-wide">{error}</span>
                </div>
            )}

            {/* General Settings - No elevation */}
            <section className="border border-base-300 rounded-lg">
                <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg">
                    <h2 className="text-sm font-bold uppercase tracking-widest">General Configuration</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="form-control w-full gap-2 flex">
                        <label className="label pt-0">
                            <span className="label-text font-bold text-xs uppercase opacity-70">Project Identity</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered rounded-lg bg-transparent focus:outline-none focus:border-primary"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-control w-full gap-2 flex">
                        <label className="label pt-0">
                            <span className="label-text font-bold text-xs uppercase opacity-70">Auth Strategy</span>
                        </label>
                        <select
                            className="select select-bordered rounded-lg bg-transparent focus:outline-none focus:border-primary"
                            value={formData.authType}
                            onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                            disabled={!isEditing}
                        >
                            <option value="none">Disabled</option>
                            <option value="api_key">API Key</option>
                            <option value="jwt">JWT</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 p-4 border border-base-300 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-bold text-sm">Message History Persistence</p>
                            <p className="text-xs opacity-60">Store all async task results for retrospective analysis.</p>
                        </div>
                        <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={formData.historyEnabled}
                            onChange={(e) => setFormData({ ...formData, historyEnabled: e.target.checked })}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            </section>

            {/* Security - Flat and Clean */}
            <section className="border border-base-300 rounded-lg"> 
                <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg flex items-center gap-2">
                    <h2 className="text-sm font-bold uppercase tracking-widest">Security Credentials</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="p-4 bg-info/5 border border-info/20 rounded-lg text-info-content text-sm leading-relaxed">
                        The project secret is an environment-level variable. Rotate this if your client-side keys are exposed.
                    </div>

                    {newSecret && (
                        <div className="border border-success bg-success/5 p-4 rounded-lg animate-pulse">
                            <p className="text-xs font-black uppercase text-success mb-2">Immediate Action Required: Copy New Secret</p>
                            <div className="font-mono text-sm break-all bg-base-100 p-3 border border-success/30 rounded-lg select-all">
                                {newSecret}
                            </div>
                        </div>
                    )}

                    <button 
                        className="btn btn-warning btn-outline btn-sm rounded-lg border-base-300" 
                        onClick={() => {/* handleRotateSecret */}} 
                    >
                        <RotateCcw size={12} /> Rotate System Secret
                    </button>
                </div>
            </section>

            {/* Danger Zone - Flat High Contrast */}
            <section className="border border-error/50 rounded-lg">
                <div className="p-4 bg-error text-error-content rounded-t-lg flex items-center gap-2">
                    <AlertTriangle size={14} />
                    <h2 className="text-sm font-black uppercase tracking-tighter">Critical: Danger Zone</h2>
                </div>
                <div className="p-6">
                    <p className="text-sm mb-6 opacity-80">Deletion is irreversible. This will purge all associated Nexios worker logs and PostgreSQL records.</p>
                    
                    {!showDeleteConfirm ? (
                        <button className="btn btn-error btn-sm rounded-lg px-8" onClick={() => setShowDeleteConfirm(true)}>
                            Destroy Project
                        </button>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-left-1">
                            <div className="form-control">
                                <label className="label pt-0">
                                    <span className="label-text text-xs font-bold uppercase">Confirm deletion by typing: <span className="text-error underline">{project?.name}</span></span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered border-error rounded-lg w-full max-w-md bg-transparent"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="Project Name"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-error btn-sm rounded-lg px-6" onClick={() => {/* handleDelete */}} disabled={deleteConfirmText !== project?.name}>
                                    Confirm Destruction
                                </button>
                                <button className="btn btn-ghost border border-base-300 btn-sm rounded-lg" onClick={() => setShowDeleteConfirm(false)}>
                                    Abort
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProjectSettings;