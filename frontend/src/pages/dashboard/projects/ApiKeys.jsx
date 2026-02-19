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
            <div role="alert" className="alert alert-error shadow-lg">
                <AlertTriangle className="h-6 w-6" />
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                        <Key className="text-primary" />
                        Project Secret
                    </h1>
                    <p className="text-base-content/60 mt-2">
                        Manage your project's secret for secure access to Pingly services
                    </p>
                </div>
                <button
                    onClick={rotateProjectSecret}
                    className="btn btn-primary gap-2 font-bold"
                    disabled={rotatingSecret}
                >
                    {rotatingSecret ? <span className="loading loading-spinner loading-sm"></span> : <RefreshCw size={18} />}
                    Rotate Secret
                </button>
            </div>

            {/* Success Alert for Rotated Secret */}
            {projectSecret && projectSecret.message && revealedSecret && (
                <div className="alert alert-success shadow-lg">
                    <Check className="h-6 w-6" />
                    <div className="flex-1">
                        <div className="font-bold">Secret Rotated Successfully!</div>
                        <div className="text-sm opacity-90">
                            Save this new secret securely. The previous secret is now invalid.
                        </div>
                    </div>
                    <button
                        onClick={() => setRevealedSecret(false)}
                        className="btn btn-ghost btn-sm"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Project Secret Card */}
            {projectSecret ? (
                <div className="card bg-base-100 border border-base-200 shadow-none hover:border-primary/30 transition-all">
                    <div className="card-body p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-primary/10">
                                    <Key className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-base-content">Project Secret</h3>
                                    <p className="text-base-content/60 text-sm">Your unique project identifier and secret</p>
                                </div>
                            </div>
                            <span className="badge badge-success text-xs">ACTIVE</span>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-base-content/40 uppercase tracking-wider w-24">Project ID</span>
                                <div className="flex items-center gap-2 flex-1">
                                    <code className="bg-base-200 px-4 py-2 rounded-lg text-sm font-mono flex-1">
                                        {projectId}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(projectId)}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        {copiedSecret ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-base-content/40 uppercase tracking-wider w-24">Secret</span>
                                <div className="flex items-center gap-2 flex-1">
                                    <code className="bg-base-200 px-4 py-2 rounded-lg text-sm font-mono flex-1">
                                        {revealedSecret ? projectSecret.project_secret : maskSecret(projectSecret.project_secret)}
                                    </code>
                                    <button
                                        onClick={() => setRevealedSecret(!revealedSecret)}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        {revealedSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(projectSecret.project_secret)}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        {copiedSecret ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="alert alert-warning mt-6">
                            <Shield size={16} />
                            <div>
                                <div className="font-bold">Security Notice</div>
                                <div className="text-sm">
                                    {projectSecret.message}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-base-100 rounded-xl border border-base-200">
                    <Key className="mx-auto h-16 w-16 text-base-content/20 mb-4" />
                    <h3 className="text-lg font-semibold text-base-content mb-2">No Secret Available</h3>
                    <p className="text-base-content/60 mb-6 max-w-md mx-auto">
                        Generate a project secret to start integrating with Pingly services
                    </p>
                    <button
                        onClick={rotateProjectSecret}
                        className="btn btn-primary gap-2"
                        disabled={rotatingSecret}
                    >
                        {rotatingSecret ? <span className="loading loading-spinner loading-sm"></span> : <RefreshCw size={18} />}
                        Generate Secret
                    </button>
                </div>
            )}

            {/* Integration Guide */}
            <div className="card bg-base-100 border border-base-200 shadow-none hover:border-primary/30 transition-colors">
                <div className="card-body p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        Quick Integration
                    </h2>
                    <div className="bg-neutral/5 rounded-xl p-6 font-mono text-md relative border border-base-200/40">
                        <div className="text-base-content/40 mb-2">// Connect to Pingly</div>
                        <div className="text-primary">const<span className="text-base-content"> socket = </span>new<span className="text-secondary"> WebSocket</span><span className="text-base-content">(</span><span className="text-success">'ws://.../{projectId}?secret=...'</span><span className="text-base-content">);</span></div>
                        <div className="my-2"></div>
                        <div className="text-base-content">socket.onmessage = (event) =&gt; {'{'}</div>
                        <div className="pl-4 text-base-content">  console.log(<span className="text-success">'Message received:'</span>, event.data);</div>
                        <div className="text-base-content">{'}'};</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiKeys;


