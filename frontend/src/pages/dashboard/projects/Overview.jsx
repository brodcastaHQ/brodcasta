import { Activity, Globe, MessageSquare, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
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

    if (loading) return <Loading fullScreen />;

    if (error) {
        return (
            <div role="alert" className="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, description, color }) => (
        <div className="bg-base-100 border border-base-200/60 p-6 rounded-2xl shadow-none hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${color} bg-opacity-5`}>
                    <Icon className={color.replace('bg-', 'text-')} size={20} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium text-base-content/40 uppercase tracking-wider">Real-time</span>
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-bold mb-1">{value}</span>
                <span className="text-sm font-semibold text-base-content/70">{title}</span>
                <p className="text-xs text-base-content/40 mt-2">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-extrabold tracking-tight">{project.name}</h1>
                <p className="text-base-content/50 text-sm font-medium">Real-time communication dashboard & metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Connections"
                    value={stats.total_connections}
                    icon={Users}
                    description="Total active WebSocket and SSE clients"
                    color="bg-primary"
                />
                <StatCard
                    title="Active Rooms"
                    value={stats.rooms_count}
                    icon={Globe}
                    description="Number of groups currently with participants"
                    color="bg-secondary"
                />
                <StatCard
                    title="WebSocket Clients"
                    value={stats.websocket_connections}
                    icon={Activity}
                    description="Connections using native WebSockets"
                    color="bg-accent"
                />
                <StatCard
                    title="SSE Clients"
                    value={stats.sse_connections}
                    icon={MessageSquare}
                    description="Connections using HTTP Server-Sent Events"
                    color="bg-info"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-base-100 border border-base-200/60 rounded-2xl p-8 shadow-none">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Quick Integration
                    </h2>
                    <div className="bg-neutral/5 rounded-xl p-6 font-mono text-sm relative border border-base-200/40">
                        <div className="text-base-content/40 mb-2">// Connect to Pingly</div>
                        <div className="text-primary">const<span className="text-base-content"> socket = </span>new<span className="text-secondary"> WebSocket</span><span className="text-base-content">(</span><span className="text-success">'ws://.../{projectId}?secret=...'</span><span className="text-base-content">);</span></div>
                        <div className="my-2"></div>
                        <div className="text-base-content">socket.onmessage = (event) =&gt; {'{'}</div>
                        <div className="pl-4 text-base-content">  console.log(<span className="text-success">'Message received:'</span>, event.data);</div>
                        <div className="text-base-content">{'}'};</div>
                    </div>
                </div>

                <div className="bg-base-100 border border-base-200/60 rounded-2xl p-8 shadow-none">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                        App Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-base-content/40 uppercase mb-1">Auth Type</p>
                            <p className="text-sm font-medium capitalize">{project.auth_type.replace('_', ' ')}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-base-content/40 uppercase mb-1">History</p>
                            <p className="text-sm font-medium">{project.history_enabled ? 'Enabled' : 'Disabled'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-base-content/40 uppercase mb-1">Created At</p>
                            <p className="text-sm font-medium">{new Date(project.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="divider opacity-50"></div>
                    <button className="btn btn-ghost border border-base-200 hover:border-primary/30 btn-sm w-full font-bold">View Documentation</button>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverview;
