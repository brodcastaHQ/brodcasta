import { ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
    return (
        <div className="card bg-base-100 border border-base-200 hover:border-primary/50 transition-colors shadow-none hover:shadow-sm group">
            <div className="card-body p-5">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <Link to={`/dashboard/projects/${project.id}`} className="font-bold text-lg hover:text-primary transition-colors flex items-center gap-2">
                            {project.name}
                            <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-base-content/50" />
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${project.updated_at ? 'bg-success' : 'bg-base-300'}`}></div>
                            <span className="text-xs text-base-content/50">
                                {project.updated_at ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                    <button className="btn btn-ghost btn-square btn-sm opacity-60 hover:opacity-100">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                <div className="divider my-0"></div>

                <div className="py-2">
                    <p className="text-xs font-medium text-base-content/40 uppercase mb-2">Last 24h</p>
                    <div className="flex items-center gap-2 text-base-content/60 text-sm">
                        <span className="italic">No messages</span>
                    </div>
                    {/* Placeholder for chart/activity line */}
                    <div className="h-1 w-full bg-base-200 mt-3 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/20 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                    </div>
                </div>

                <div className="mt-2 pt-2 text-sm text-base-content/60">
                    No connections
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
