import { Activity, ArrowUpRight, BookOpen, ExternalLink, Globe, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '../../../utils/client';

const ProjectOverview = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const client = createClient(`/api/projects/${projectId}`);
                const [projectRes, statsRes] = await Promise.all([
                    client.get('/'),
                    client.get('/stats')
                ]);
                setProject(projectRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load project details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();

        // Refresh stats every 30 seconds
        const interval = setInterval(async () => {
            try {
                const client = createClient(`/api/projects/${projectId}`);
                const statsRes = await client.get('/stats');
                setStats(statsRes.data);
            } catch (err) {
                console.error('Failed to refresh stats:', err);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [projectId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200">
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-base-200">
                <div className="flex items-center justify-center h-screen">
                    <div className="bg-error/10 border border-error/20 rounded-lg p-4 max-w-md mx-auto">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Activity className="h-5 w-5 text-error" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-error">Error</h3>
                                <div className="mt-2 text-sm text-error/80">{error}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, description }) => (
        <div className="bg-base-100 rounded-xl border border-base-300 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-base-200">
                    <Icon className="w-6 h-6 text-base-content" />
                </div>
                <span className="text-xs text-success font-medium flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    Live
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-base-content mb-1">{value}</span>
                <span className="text-sm font-semibold text-base-content/60">{title}</span>
                <p className="text-xs text-base-content/40 mt-3 leading-relaxed">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Getting Started Banner */}
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-primary/20 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-base-content">Getting Started with {project.name}</h3>
                                    <p className="text-base-content/70 text-sm mt-1">
                                        Learn how to build real-time applications with WebSocket and Server-Sent Events
                                    </p>
                                </div>
                            </div>
                            <a 
                                href="https://docs.Brodcastay.dev" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-primary/30 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Docs
                            </a>
                        </div>
                    </div>

                    {/* Project Header */}
                    <div className="bg-base-100 rounded-xl border border-base-300 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-base-content mb-2">{project.name}</h1>
                                <p className="text-base-content/60">
                                    Real-time ecosystem broadcasting from <span className="font-mono text-primary">{projectId.split('-')[0]}...</span>
                                </p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                                <div className="w-1.5 h-1.5 bg-success rounded-full mr-1.5"></div>
                                ACTIVE
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <span className="text-xs font-bold text-base-content/40 uppercase tracking-wider">Total Clients</span>
                                <span className="text-2xl font-bold text-base-content">{stats.total_connections}</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-base-content/40 uppercase tracking-wider">Active Rooms</span>
                                <span className="text-2xl font-bold text-base-content">{stats.rooms_count}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Connections"
                            value={stats.total_connections}
                            icon={Users}
                            description="Total active WebSocket and SSE clients"
                        />
                        <StatCard
                            title="Active Rooms"
                            value={stats.rooms_count}
                            icon={Globe}
                            description="Number of groups currently with participants"
                        />
                        <StatCard
                            title="WebSocket Clients"
                            value={stats.websocket_connections}
                            icon={Activity}
                            description="Connections using native WebSockets"
                        />
                        <StatCard
                            title="SSE Clients"
                            value={stats.sse_connections}
                            icon={Zap}
                            description="Connections using HTTP Server-Sent Events"
                        />
                    </div>

                    {/* Quick Integration */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-base-100 rounded-xl border border-base-300 p-8">
                            <h2 className="text-xl font-bold mb-6 text-base-content">Quick Integration</h2>
                            <div className="bg-base-200 rounded-xl p-6 font-mono text-md relative border border-base-300">
                                <div className="text-base-content/40 mb-2">// Connect to Brodcastay</div>
                                <div className="text-primary">const<span className="text-base-content"> socket = </span>new<span className="text-secondary"> WebSocket</span><span className="text-base-content">(</span><span className="text-success">'ws://.../{projectId}?secret=...'</span><span className="text-base-content">);</span></div>
                                <div className="my-2"></div>
                                <div className="text-base-content">socket.onmessage = (event) =&gt; {'{'}</div>
                                <div className="pl-4 text-base-content">  console.log(<span className="text-success">'Message received:'</span>, event.data);</div>
                                <div className="text-base-content">{'}'};</div>
                            </div>
                        </div>

                        <div className="bg-base-100 rounded-xl border border-base-300 p-8">
                            <h2 className="text-xl font-bold mb-6 text-base-content">App Settings</h2>
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-base-content/40 uppercase tracking-wider">Auth Type</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-base-200 text-base-content">
                                        {project.auth_type.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-base-content/40 uppercase tracking-wider">History</span>
                                    <span className="text-sm font-bold text-base-content/70">{project.history_enabled ? 'Enabled' : 'Disabled'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-base-content/40 uppercase tracking-wider">Created</span>
                                    <span className="text-sm font-bold text-base-content/70">{new Date(project.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="border-t border-base-300 my-4 pt-4">
                                <a 
                                    href="https://docs.Brodcastay.dev" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center w-full px-4 py-2 border border-base-300 rounded-lg text-sm font-medium text-base-content bg-base-100 hover:bg-base-200 transition-colors justify-center"
                                >
                                    Documentation
                                    <ArrowUpRight className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverview;
