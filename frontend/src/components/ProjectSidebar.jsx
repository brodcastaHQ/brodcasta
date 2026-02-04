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
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors mb-1
                ${isActive(path)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </Link>
    );

    return (
        <aside className="w-64 border-r border-base-200 min-h-screen bg-base-100 flex flex-col fixed left-0 top-0 bottom-0 z-20">
            {/* Context Switcher / Back */}
            <div className="h-16 flex items-center px-4 border-b border-base-200">
                <Link to="/dashboard" className="btn btn-ghost btn-sm gap-2 text-base-content/70 font-normal hover:bg-base-200 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Apps
                </Link>
            </div>

            {/* Project Title branding */}
            <div className="p-4 px-6 mt-4">
                <div className="text-[10px] font-bold text-base-content/30 uppercase tracking-[0.25em] mb-1">Navigation</div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3">
                <NavItem to="" path="" icon={LayoutDashboard} label="Overview" />
                <NavItem to="/api-keys" path="/api-keys" icon={Key} label="API Keys" />
                <NavItem to="/analytics" path="/analytics" icon={Activity} label="Analytics" />
                <NavItem to="/playground" path="/playground" icon={Code} label="Playground" />
                <NavItem to="/settings" path="/settings" icon={Settings} label="Settings" />
            </div>

            <div className="p-6 border-t border-base-200">
                <div className="text-[10px] font-bold text-base-content/30 uppercase tracking-[0.2em] mb-3">Project ID</div>
                <div className="font-mono text-[11px] bg-base-200/50 text-base-content/50 p-2.5 rounded-lg break-all select-all border border-base-200/40">
                    {projectId}
                </div>
            </div>
        </aside>
    );
};

export default ProjectSidebar;
