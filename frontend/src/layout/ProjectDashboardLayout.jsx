import { Outlet } from 'react-router-dom';
import ProjectSidebar from '../components/ProjectSidebar';
import Topbar from '../components/Topbar';

const ProjectDashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-base-100">
            <ProjectSidebar />
            <div className="flex-1 ml-64 flex flex-col min-w-0">
                <Topbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProjectDashboardLayout;
