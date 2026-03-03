import { AlertTriangle, Check, Copy, Eye, EyeOff, Key, RefreshCw } from 'lucide-react';
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
            <div className="min-h-screen bg-base-200">
                {/* Error Content */}
                <div className="flex items-center justify-center h-screen">
                    <div className="bg-base-200 border border-base-300 rounded-xl p-6 max-w-md mx-auto">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-6 w-6 text-base-content flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-base-content">Error</h3>
                                <div className="mt-2 text-sm text-base-content/60">{error}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            {/* Content */}
            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                                Project Secret
                            </h1>
                            <p className="text-base-content/60 mt-2">
                                Manage your project's secret for secure access to Pingly services
                            </p>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center space-x-3 mb-8">
                            <button
                                onClick={rotateProjectSecret}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-primary-content bg-primary hover:bg-primary-focus transition-colors"
                                disabled={rotatingSecret}
                            >
                                {rotatingSecret ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-content mr-2"></span> : <RefreshCw className="w-4 h-4 mr-2" />}
                                Rotate secret
                            </button>
                        </div>

                        {/* Success Alert for Rotated Secret */}
                        {projectSecret && projectSecret.message && revealedSecret && (
                            <div className="bg-base-200 border border-base-300 rounded-xl p-4">
                                <div className="flex items-start space-x-3">
                                    <Check className="h-5 w-5 text-base-content flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="font-medium text-base-content">Secret rotated successfully</div>
                                        <div className="text-sm text-base-content/60 mt-1">
                                            Save this new secret securely. The previous secret is now invalid.
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setRevealedSecret(false)}
                                        className="text-base-content/60 hover:text-base-content transition-colors p-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Project Secret Card */}
                        {projectSecret ? (
                            <div className="bg-base-100 rounded-xl border border-base-300">
                                <div className="p-6 border-b border-base-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-base-content">Secret key</h3>
                                            <p className="text-sm text-base-content/60 mt-1">Your project secret for authentication</p>
                                        </div>
                                        <button
                                            onClick={rotateProjectSecret}
                                            className="p-2 text-base-content/60 hover:text-base-content hover:bg-base-200 rounded-lg transition-colors"
                                            title="Rotate secret"
                                        >
                                            {rotatingSecret ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-base-content"></span> : <RefreshCw className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-base-content">Project ID</span>
                                            <div className="flex items-center gap-2">
                                                <code className="bg-base-200 px-3 py-1 rounded text-sm font-mono">
                                                    {projectId}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(projectId)}
                                                    className="p-1.5 text-base-content/60 hover:text-base-content hover:bg-base-200 rounded transition-colors"
                                                    title="Copy"
                                                >
                                                    {copiedSecret ? <Check size={14} /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-base-content">Secret</span>
                                            <div className="flex items-center gap-2">
                                                <code className="bg-base-200 px-3 py-1 rounded text-sm font-mono font-mono">
                                                    {revealedSecret ? projectSecret.project_secret : maskSecret(projectSecret.project_secret)}
                                                </code>
                                                <button
                                                    onClick={() => setRevealedSecret(!revealedSecret)}
                                                    className="p-1.5 text-base-content/60 hover:text-base-content hover:bg-base-200 rounded transition-colors"
                                                    title={revealedSecret ? "Hide" : "Show"}
                                                >
                                                    {revealedSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(projectSecret.project_secret)}
                                                    className="p-1.5 text-base-content/60 hover:text-base-content hover:bg-base-200 rounded transition-colors"
                                                    title="Copy"
                                                >
                                                    {copiedSecret ? <Check size={14} /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-base-100 rounded-xl border border-base-300">
                                <Key className="mx-auto h-12 w-12 text-base-content/20 mb-4" />
                                <h3 className="text-lg font-semibold text-base-content mb-2">No secret key</h3>
                                <p className="text-base-content/60 mb-6 max-w-md mx-auto">
                                    Generate your project secret to start integrating with Pingly services
                                </p>
                                <button
                                    onClick={rotateProjectSecret}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-primary-content bg-primary hover:bg-primary-focus transition-colors"
                                    disabled={rotatingSecret}
                                >
                                    {rotatingSecret ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-content mr-2"></span> : <RefreshCw className="w-4 h-4 mr-2" />}
                                    Generate secret
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiKeys;


