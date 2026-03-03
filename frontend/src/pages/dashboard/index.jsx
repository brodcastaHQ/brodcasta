import { Activity, ArrowUpRight, BookOpen, ExternalLink, Globe, Plus, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import Loading from '../../components/ui/Loading';
import { createClient } from '../../utils/client';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const client = createClient('/api/projects');
                const response = await client.get('/');
                setProjects(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load projects.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Dot Pattern Background */}
            <div className="absolute inset-0">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8"/>
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2"/>
                        </radialGradient>
                    </defs>
                    
                    {/* Dot grid pattern */}
                    <circle cx="50" cy="50" r="10" fill="url(#dotGradient)" />
                    <circle cx="150" cy="50" r="10" fill="url(#dotGradient)" />
                    <circle cx="250" cy="50" r="10" fill="url(#dotGradient)" />
                    <circle cx="350" cy="50" r="10" fill="url(#dotGradient)" />
                    <circle cx="450" cy="50" r="10" fill="url(#dotGradient)" />
                    <circle cx="550" cy="50" r="10" fill="url(#dotGradient)" />
                    <circle cx="650" cy="50" r="10" fill="url(#dotGradient)" />
                    <circle cx="750" cy="50" r="10" fill="url(#dotGradient)" />
                    
                    <circle cx="50" cy="200" r="6" fill="url(#dotGradient)" />
                    <circle cx="150" cy="200" r="6" fill="url(#dotGradient)" />
                    <circle cx="250" cy="200" r="6" fill="url(#dotGradient)" />
                    <circle cx="350" cy="200" r="6" fill="url(#dotGradient)" />
                    <circle cx="450" cy="200" r="6" fill="url(#dotGradient)" />
                    <circle cx="550" cy="200" r="6" fill="url(#dotGradient)" />
                    <circle cx="650" cy="200" r="6" fill="url(#dotGradient)" />
                    <circle cx="750" cy="200" r="6" fill="url(#dotGradient)" />
                    
                    <circle cx="50" cy="400" r="3" fill="url(#dotGradient)" />
                    <circle cx="150" cy="400" r="3" fill="url(#dotGradient)" />
                    <circle cx="250" cy="400" r="3" fill="url(#dotGradient)" />
                    <circle cx="350" cy="400" r="3" fill="url(#dotGradient)" />
                    <circle cx="450" cy="400" r="3" fill="url(#dotGradient)" />
                    <circle cx="550" cy="400" r="3" fill="url(#dotGradient)" />
                    <circle cx="650" cy="400" r="3" fill="url(#dotGradient)" />
                    <circle cx="750" cy="400" r="3" fill="url(#dotGradient)" />
                </svg>
            </div>
            
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-base-200/80"></div>
            
            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="bg-base-100 border-b border-base-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-8">
                            <div>
                                <h1 className="text-3xl font-bold text-base-content">Projects</h1>
                                <p className="text-base-content/60 mt-1">Manage your real-time applications</p>
                            </div>
                            <a href="/dashboard/new" className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-primary-content bg-primary hover:bg-primary-focus transition-colors">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Project
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Getting Started Banner */}
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-primary/20 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-base-content">Getting Started with Pingly</h3>
                                    <p className="text-base-content/70 text-sm mt-1">
                                        Learn how to build real-time applications with WebSocket and Server-Sent Events
                                    </p>
                                </div>
                            </div>
                            <a 
                                href="https://docs.pingly.dev" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-primary/30 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Docs
                            </a>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-base-100 rounded-xl border border-base-300 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-xs text-success font-medium flex items-center">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    Active
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-base-content">{projects.length}</h3>
                            <p className="text-sm text-base-content/60">Active Projects</p>
                        </div>
                        
                        <div className="bg-base-100 rounded-xl border border-base-300 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-success/10 rounded-lg">
                                    <Users className="w-6 h-6 text-success" />
                                </div>
                                <span className="text-xs text-success font-medium flex items-center">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    Live
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-base-content">
                                {projects.reduce((sum, p) => sum + (p.total_connections || 0), 0)}
                            </h3>
                            <p className="text-sm text-base-content/60">Total Connections</p>
                        </div>
                        
                        <div className="bg-base-100 rounded-xl border border-base-300 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-info/10 rounded-lg">
                                    <Zap className="w-6 h-6 text-info" />
                                </div>
                                <span className="text-xs text-success font-medium flex items-center">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    99.9%
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-base-content">24/7</h3>
                            <p className="text-sm text-base-content/60">Uptime</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 bg-error/10 border border-error/20 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Activity className="h-5 w-5 text-error" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-error">Error loading projects</h3>
                                    <div className="mt-2 text-sm text-error/80">{error}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {projects.length === 0 && !error && (
                        <div className="text-center py-16">
                            <div className="text-base-content/30 mb-6">
                                <Globe className="mx-auto h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-content mb-3">Start your first project</h3>
                            <p className="text-base-content/60 mb-8 max-w-md mx-auto">
                                Create a new project to begin building real-time applications with WebSocket and SSE connections
                            </p>
                            <a href="/dashboard/new" className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-primary-content bg-primary hover:bg-primary-focus transition-colors">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Project
                            </a>
                        </div>
                    )}

                    {projects.length > 0 && (
                        <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
                            <div className="px-6 py-4 border-b border-base-300 bg-base-100">
                                <h2 className="text-lg font-semibold text-base-content">Recent Projects</h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-base-300">
                                    <thead className="bg-base-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">
                                                Project Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">
                                                Authentication
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">
                                                Connections
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">
                                                Created
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-base-100 divide-y divide-base-300">
                                        {projects.map((project) => (
                                            <tr 
                                                key={project.id} 
                                                className="hover:bg-base-200 cursor-pointer transition-colors"
                                                onClick={() => window.location.href = `/dashboard/projects/${project.id}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-base-content">{project.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                                                        {project.auth_type === 'all' ? 'Private' : project.auth_type === 'none' ? 'Public' : 'Publishing'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5"></div>
                                                        Running
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/80">
                                                    <div className="flex items-center">
                                                        <Users className="h-4 w-4 mr-1 text-base-content/40" />
                                                        <span className="font-medium">{project.total_connections || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/80">
                                                    {new Date(project.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
