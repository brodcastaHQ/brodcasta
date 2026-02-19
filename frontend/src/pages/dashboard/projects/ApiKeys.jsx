import { AlertTriangle, Check, Copy, Eye, EyeOff, Key, RefreshCw, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
import { createClient } from '../../../utils/client';

const ApiKeys = () => {
    const { projectId } = useParams();
    const [projectSecret, setProjectSecret] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copiedSecret, setCopiedSecret] = useState(false);
    const [revealedSecret, setRevealedSecret] = useState(false);
    const [rotatingSecret, setRotatingSecret] = useState(false);

    useEffect(() => {
        fetchProjectSecret();
    }, [projectId]);

    const fetchProjectSecret = async () => {
        try {
            const client = createClient(`/api`);
            const response = await client.get(`/projects/${projectId}/secret`);
            setProjectSecret(response.data);
        } catch (err) {
            console.error('Failed to fetch project secret:', err);
            setError('Failed to load project secret.');
        } finally {
            setLoading(false);
        }
    };

    const rotateProjectSecret = async () => {
        setRotatingSecret(true);
        try {
            const client = createClient(`/api`);
            const response = await client.post(`/projects/${projectId}/rotate-secret`);
            
            setProjectSecret(response.data);
            setRevealedSecret(true);
        } catch (err) {
            console.error('Failed to rotate project secret:', err);
            setError('Failed to rotate project secret.');
        } finally {
            setRotatingSecret(false);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedSecret(true);
            setTimeout(() => setCopiedSecret(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const maskSecret = (secret) => {
        return secret ? secret.substring(0, 8) + '...' + secret.substring(secret.length - 4) : '';
    };

    if (loading) return <Loading fullScreen />;

    if (error) {
        return (
            <div role="alert" className="alert alert-error">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-300 pb-8">
                <div>
                    <div className="flex items-center gap-3">
                        <Key className="text-primary" size={18} />
                        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
                    </div>
                    <p className="text-base-content/60 mt-1">
                        Manage your project's secret for secure access to Pingly services
                    </p>
                </div>
                <button
                    onClick={rotateProjectSecret}
                    className="btn btn-primary gap-2 font-medium rounded-lg"
                    disabled={rotatingSecret}
                >
                    {rotatingSecret ? <span className="loading loading-spinner loading-sm"></span> : <RefreshCw size={18} />}
                    Rotate Secret
                </button>
            </header>

            {error && (
                <div className="flex items-center gap-3 p-4 border border-error text-error bg-error/5 rounded-lg">
                    <AlertTriangle size={14} />
                    <span className="text-sm font-bold uppercase tracking-wide">{error}</span>
                </div>
            )}

            {/* Success Alert for Rotated Secret */}
            {projectSecret && projectSecret.message && revealedSecret && (
                <div className="border border-success bg-success/5 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-success mt-0.5" />
                        <div className="flex-1">
                            <div className="font-medium text-sm">Secret Rotated Successfully!</div>
                            <div className="text-sm opacity-80 mt-1">
                                Save this new secret securely. The previous secret is now invalid.
                            </div>
                        </div>
                        <button
                            onClick={() => setRevealedSecret(false)}
                            className="btn btn-ghost btn-xs rounded-lg"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Project Secret Section */}
            {projectSecret ? (
                <section className="border border-base-300 rounded-lg">
                    <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <Key className="text-primary" size={18} />
                            <h2 className="text-sm font-bold uppercase tracking-widest">Project Secret</h2>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="text-xs font-medium text-base-content/40 uppercase tracking-wider block mb-2">Project ID</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-base-200/50 border border-base-200/50 px-4 py-3 rounded-xl text-sm font-mono">
                                    {projectId}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(projectId)}
                                    className="btn btn-ghost btn-sm btn-square rounded-lg"
                                >
                                    {copiedSecret ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-xs font-medium text-base-content/40 uppercase tracking-wider block mb-2">Secret</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-base-200/50 border border-base-200/50 px-4 py-3 rounded-xl text-sm font-mono">
                                    {revealedSecret ? projectSecret.project_secret : maskSecret(projectSecret.project_secret)}
                                </div>
                                <button
                                    onClick={() => setRevealedSecret(!revealedSecret)}
                                    className="btn btn-ghost btn-sm btn-square rounded-lg"
                                >
                                    {revealedSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(projectSecret.project_secret)}
                                    className="btn btn-ghost btn-sm btn-square rounded-lg"
                                >
                                    {copiedSecret ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="border border-warning/20 bg-warning/5 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Shield size={16} className="text-warning" />
                                <div>
                                    <div className="font-medium text-sm">Security Notice</div>
                                    <div className="text-sm opacity-80 mt-1">
                                        {projectSecret.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="border border-base-300 rounded-lg">
                    <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <Key className="text-base-content/40" size={18} />
                            <h2 className="text-sm font-bold uppercase tracking-widest">No Secret Available</h2>
                        </div>
                    </div>
                    <div className="p-6 text-center">
                        <div className="max-w-md mx-auto">
                            <Key className="mx-auto h-12 w-12 text-base-content/20 mb-4" />
                            <h3 className="text-lg font-medium text-base-content mb-2">Generate Project Secret</h3>
                            <p className="text-base-content/60 mb-8">
                                Generate a project secret to start integrating with Pingly services
                            </p>
                            <button
                                onClick={rotateProjectSecret}
                                className="btn btn-primary gap-2 rounded-lg"
                                disabled={rotatingSecret}
                            >
                                {rotatingSecret ? <span className="loading loading-spinner loading-sm"></span> : <RefreshCw size={18} />}
                                Generate Secret
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Integration Guide */}
            <section className="border border-base-300 rounded-lg">
                <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg">
                    <h2 className="text-sm font-bold uppercase tracking-widest">Quick Integration</h2>
                </div>
                <div className="p-6">
                    <div className="bg-base-200/30 rounded-xl p-6 font-mono text-sm border border-base-200/50">
                        <div className="text-base-content/40 mb-2">// Connect to Pingly</div>
                        <div className="text-primary">const<span className="text-base-content"> socket = </span>new<span className="text-secondary"> WebSocket</span><span className="text-base-content">(</span><span className="text-success">'ws://.../{projectId}?secret=...'</span><span className="text-base-content">);</span></div>
                        <div className="my-2"></div>
                        <div className="text-base-content">socket.onmessage = (event) =&gt; {'{'}</div>
                        <div className="pl-4 text-base-content">  console.log(<span className="text-success">'Message received:'</span>, event.data);</div>
                        <div className="text-base-content">{'}'};</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ApiKeys;
