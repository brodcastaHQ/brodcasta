import { CheckCheck, Clock, Copy, Eye, EyeOff, Key, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../components/ui/Loading';
import { createClient } from '../../utils/client';

const ProjectOverview = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showSecret, setShowSecret] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const client = createClient('/api/projects');
                const response = await client.get(`/${projectId}`);
                setProject(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load project details.');
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <Loading />;

    if (error) {
         return (
            <div role="alert" className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
            </div>
        );
    }

    if (!project) return null;

    return (
        <div>
            <div className="mb-8 border-b border-base-200 pb-6">
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                <div className="flex items-center gap-4 text-md text-base-content/60">
                    <span className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full bg-success`}></div>
                        Active
                    </span>
                    <span>•</span>
                    <span>Created on {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* API Keys Section */}
                    <div className="card bg-base-100 border border-base-200 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-base flex items-center gap-2 mb-4">
                                <Key size={18} className="text-primary" />
                                API Credentials
                            </h2>
                            
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-medium">Public Key (Project ID)</span>
                                </label>
                                <div className="join w-full">
                                    <input 
                                        type="text" 
                                        value={project.id} 
                                        readOnly 
                                        className="input input-bordered join-item w-full font-mono text-md bg-base-200/50" 
                                    />
                                    <button 
                                        onClick={() => copyToClipboard(project.id)}
                                        className="btn join-item border-base-200 bg-base-100 hover:bg-base-200"
                                    >
                                        {copied ? <CheckCheck size={16} className="text-success" /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <label className="label">
                                    <span className="label-text-alt text-base-content/50">Safe to use in frontend code (publishable).</span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Secret Key</span>
                                </label>
                                <div className="join w-full">
                                    <input 
                                        type={showSecret ? "text" : "password"} 
                                        value={project.project_secret} 
                                        readOnly 
                                        className="input input-bordered join-item w-full font-mono text-md bg-base-200/50" 
                                    />
                                    <button 
                                        onClick={() => setShowSecret(!showSecret)}
                                        className="btn join-item border-base-200 bg-base-100 hover:bg-base-200"
                                    >
                                      {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button 
                                        onClick={() => copyToClipboard(project.project_secret)}
                                        className="btn join-item border-base-200 bg-base-100 hover:bg-base-200"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                                 <label className="label">
                                    <span className="label-text-alt text-error/80 font-medium">Keep this secret! Never expose it in client-side code.</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Usage Placeholder */}
                     <div className="card bg-base-100 border border-base-200 shadow-md opacity-60">
                         <div className="card-body items-center justify-center py-12">
                            <p className="text-base-content/50">Real-time usage analytics coming soon.</p>
                         </div>
                     </div>
                </div>

                {/* Sidebar / details */}
                <div className="space-y-6">
                     <div className="card bg-base-100 border border-base-200 shadow-md p-4">
                        <div className="text-xs font-bold text-base-content/40 uppercase tracking-wider mb-4">Configuration</div>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Shield size={18} className="mt-0.5 text-base-content/70" />
                                <div>
                                    <div className="font-medium text-md">Auth Type</div>
                                    <div className="text-md text-base-content/60 capitalize">{project.auth_type}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <Clock size={18} className="mt-0.5 text-base-content/70" />
                                <div>
                                    <div className="font-medium text-md">History</div>
                                    <div className="text-md text-base-content/60">
                                        {project.history_enabled ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>
                            </div>
                        </div>

                         <div className="divider my-4"></div>
                         
                         <button className="btn btn-outline btn-md w-full">Edit Settings</button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverview;
