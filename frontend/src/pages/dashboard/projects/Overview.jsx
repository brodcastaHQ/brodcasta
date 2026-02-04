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
        <div className="card bg-base-100 border border-base-200 hover:border-primary/50 transition-all shadow-none hover:shadow-sm group">
            <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${color} bg-opacity-10`}>
                        <Icon className={color.replace('bg-', 'text-')} size={20} strokeWidth={2} />
                    </div>
                    <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">Live Status</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold mb-1 text-base-content">{value}</span>
                    <span className="text-sm font-semibold text-base-content/60">{title}</span>
                    <p className="text-xs text-base-content/40 mt-3 leading-relaxed">{description}</p>
                </div>
                <div className="h-1 w-full bg-base-200 mt-4 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/20 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Banner matching the main dashboard */}
            <div className="w-full h-48 rounded-2xl bg-neutral text-neutral-content relative overflow-hidden flex items-center p-8 shadow-lg">
                <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-neutral to-secondary/30 z-0"></div>

                <div className="relative z-20 max-w-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                        <span className="badge badge-success text-[10px] font-bold text-white border-none px-2.5">ACTIVE</span>
                    </div>
                    <p className="text-white/70 mb-0 text-sm leading-relaxed max-w-md">
                        Real-time ecosystem broadcasting from <span className="text-primary-content font-mono font-bold">{projectId.split('-')[0]}...</span>
                    </p>
                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Clients</span>
                            <span className="text-xl font-bold text-white">{stats.total_connections}</span>
                        </div>
                        <div className="divider divider-horizontal mx-0 opacity-20"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Rooms</span>
                            <span className="text-xl font-bold text-white">{stats.rooms_count}</span>
                        </div>
                    </div>
                </div>
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
                <div className="lg:col-span-2 card bg-base-100 border border-base-200 shadow-none hover:border-primary/30 transition-colors">
                    <div className="card-body p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
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
                </div>

                <div className="card bg-base-100 border border-base-200 shadow-none hover:border-primary/30 transition-colors">
                    <div className="card-body p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            App Settings
                        </h2>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-base-content/40 uppercase tracking-wider">Auth Type</span>
                                <span className="badge badge-ghost font-bold text-[10px] capitalize">{project.auth_type.replace('_', ' ')}</span>
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
                        <div className="divider my-4"></div>
                        <button className="btn btn-neutral btn-sm w-full text-white font-bold tracking-tight">
                            Documentation &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverview;
