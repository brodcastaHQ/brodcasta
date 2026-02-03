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
        <div className="bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                    <Icon className={color.replace('bg-', 'text-')} size={20} />
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
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <p className="text-base-content/60">Manage your application's real-time communication.</p>
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
                <div className="lg:col-span-2 bg-base-100 border border-base-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">Quick Integration</h2>
                    <div className="mockup-code bg-base-200 text-base-content border-none">
                        <pre data-prefix="1"><code>{`// Connect to Pingly`}</code></pre>
                        <pre data-prefix="2"><code>{`const socket = new WebSocket('ws://.../${projectId}?secret=...');`}</code></pre>
                        <pre data-prefix="3"><code>{``}</code></pre>
                        <pre data-prefix="4"><code>{`socket.onmessage = (event) => {`}</code></pre>
                        <pre data-prefix="5"><code>{`  console.log('Message received:', event.data);`}</code></pre>
                        <pre data-prefix="6"><code>{`};`}</code></pre>
                    </div>
                </div>

                <div className="bg-base-100 border border-base-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">Project Settings</h2>
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
                    <div className="divider"></div>
                    <button className="btn btn-outline btn-sm w-full">View Documentation</button>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverview;
