import {
    Activity,
    ArrowLeft,
    Code,
    Key,
    LayoutDashboard,
    Settings
} from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';

const ProjectSidebar = () => {
    const location = useLocation();
    const { projectId } = useParams();

    const isActive = (path) => {
        // Match exact path or subpaths if needed
        return location.pathname === `/dashboard/projects/${projectId}${path}`;
    };

    const NavItem = ({ to, icon: Icon, label, path }) => (
        <Link
            to={`/dashboard/projects/${projectId}${to}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 mb-1
                ${isActive(path)
                    ? 'bg-primary/5 text-primary font-bold border border-primary/10'
                    : 'text-base-content/50 hover:bg-base-200/50 hover:text-base-content border border-transparent'
                }`}
        >
            <Icon size={18} strokeWidth={1.5} />
            <span>{label}</span>
        </Link>
    );

    return (
        <aside className="w-64 border-r border-base-200/60 min-h-screen bg-base-100 flex flex-col fixed left-0 top-0 bottom-0 z-20 shadow-none">
            {/* Context Switcher / Back */}
            <div className="h-16 flex items-center px-4 border-b border-base-200/60">
                <Link to="/dashboard" className="btn btn-ghost btn-sm gap-2 text-base-content/40 font-bold hover:bg-base-200/50 hover:text-primary transition-colors">
                    <ArrowLeft size={16} strokeWidth={2} />
                    Back to Apps
                </Link>
            </div>

            {/* Project Info Placeholder */}
            <div className="p-6">
                <div className="text-[10px] font-extrabold text-base-content/30 uppercase tracking-[0.2em] mb-4">
                    Management
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4">
                <NavItem to="" path="" icon={LayoutDashboard} label="Overview" />
                <NavItem to="/api-keys" path="/api-keys" icon={Key} label="API Keys" />
                <NavItem to="/analytics" path="/analytics" icon={Activity} label="Analytics" />
                <NavItem to="/playground" path="/playground" icon={Code} label="Playground" />
                <NavItem to="/settings" path="/settings" icon={Settings} label="Settings" />
            </div>

            <div className="p-6 border-t border-base-200/60">
                <div className="text-[10px] font-extrabold text-base-content/30 uppercase tracking-[0.2em] mb-2">Project ID</div>
                <div className="font-mono text-[11px] bg-base-200/50 text-base-content/60 p-2.5 rounded-lg break-all select-all border border-base-200/40">
                    {projectId}
                </div>
            </div>
        </aside>
    );
};

export default ProjectSidebar;
