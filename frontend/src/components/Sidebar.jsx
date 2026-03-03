import {
    Activity,

    BarChart,

    FileText,

    LayoutGrid,

    Settings,

    Shield,

    Users
} from 'lucide-react';

import { Link, useLocation } from 'react-router-dom';



const Sidebar = () => {

    const location = useLocation();



    const isActive = (path) => {

        return location.pathname === path;

    };



    const NavItem = ({ to, icon: Icon, label, active }) => (

        <Link

            to={to}

            className={`flex items-center gap-3 px-3 py-2 rounded-md text-md transition-colors mb-1

                ${active

                    ? 'bg-primary/10 text-primary font-medium'

                    : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'

                }`}

        >

            <Icon size={18} />

            <span>{label}</span>

        </Link>

    );



    const SectionLabel = ({ label }) => (

        <div className="px-3 mt-6 mb-2 text-xs font-bold text-base-content/40 uppercase tracking-wider">

            {label}

        </div>

    );



    return (

        <aside className="w-64 border-r border-base-200 min-h-screen bg-base-100 flex flex-col fixed left-0 top-0 bottom-0 z-20">

            {/* Logo Area */}

            <div className="h-16 flex items-center px-6 border-b border-base-200">

                <Link to="/" className="flex items-center gap-2">

                    <img src="/logo.svg" alt="Pingly Logo" className="w-8 h-8 object-contain" />

                    <span className="font-bold text-lg">Pingly</span>

                </Link>

            </div>



            {/* Navigation */}

            <div className="flex-1 overflow-y-auto py-4 px-3">



                <NavItem to="/dashboard" icon={LayoutGrid} label="Apps" active={isActive('/dashboard')} />



                <SectionLabel label="Configuration" />

                <NavItem to="/dashboard/admin/users" icon={Users} label="User Management" active={isActive('/dashboard/admin/users')} />

                <NavItem to="/dashboard/settings" icon={Settings} label="Account Settings" active={isActive('/dashboard/settings')} />

                <NavItem to="/dashboard/team" icon={Users} label="Team" active={isActive('/dashboard/team')} />



                <SectionLabel label="Billing" />

                <NavItem to="/dashboard/billing/package" icon={Shield} label="Package" active={isActive('/dashboard/billing/package')} />

                <NavItem to="/dashboard/billing/invoices" icon={FileText} label="Invoices" active={isActive('/dashboard/billing/invoices')} />

                <NavItem to="/dashboard/billing/usage" icon={Activity} label="Usage" active={isActive('/dashboard/billing/usage')} />

                <NavItem to="/dashboard/billing/limits" icon={BarChart} label="Limits" active={isActive('/dashboard/billing/limits')} />



                <SectionLabel label="Monitoring" />

                <NavItem to="/dashboard/reports" icon={FileText} label="Reports" active={isActive('/dashboard/reports')} />

            </div>



            {/* User Profile / Bottom */}

            <div className="p-4 border-t border-base-200">

                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 cursor-pointer transition-colors">

                    <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-md font-medium">

                        JD

                    </div>

                    <div className="flex-1 min-w-0">

                        <div className="text-md font-medium truncate">John Doe</div>

                        <div className="text-xs text-base-content/60 truncate">Free account</div>

                    </div>

                </div>

            </div>

        </aside>

    );

};



export default Sidebar;

