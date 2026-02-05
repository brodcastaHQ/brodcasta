import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard';
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
                // The API endpoint is /projects/ (so just / relative to client base)
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
        <div className="space-y-8">
            {/* Banner */}
            <div className="w-full h-48 rounded-2xl bg-neutral text-neutral-content relative overflow-hidden flex items-center p-8 shadow-lg">
                <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent z-10"></div>
                {/* Decorative background similar to the reference, maybe a gradient or pattern */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-neutral to-secondary/30 z-0"></div>

                <div className="relative z-20 max-w-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-white">Annotations</h2>
                        <span className="badge badge-success text-xs font-bold text-white border-none">NEW</span>
                    </div>
                    <p className="text-white/80 mb-6 text-md leading-relaxed max-w-md">
                        Add rich context to messages with emoji reactions, read receipts, custom tags, and more.
                    </p>
                    <button className="btn btn-primary btn-md border-none text-white hover:brightness-110">
                        View docs &rarr;
                    </button>
                </div>
            </div>

            {/* Apps Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-base-content">Your apps</h1>
                    <a href="/dashboard/new" className="btn btn-neutral text-white gap-2 shadow-lg shadow-neutral/20">
                        <Plus size={18} />
                        Create new app
                    </a>
                </div>

                {error && (
                    <div role="alert" className="alert alert-error mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                )}

                {projects.length === 0 && !error ? (
                    <div className="text-center py-12 border-2 border-dashed border-base-200 rounded-xl bg-base-50/50">
                        <p className="text-base-content/50 font-medium">You don't have any apps yet.</p>
                        <a href="/dashboard/new" className="btn btn-link btn-md text-primary mt-2">Create your first app</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
