import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ProjectSidebar from '../components/ProjectSidebar';
import Topbar from '../components/Topbar';

const ProjectDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <ProjectSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="xl:pl-60">
        <div className="px-4 py-4 sm:px-6">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="py-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboardLayout;