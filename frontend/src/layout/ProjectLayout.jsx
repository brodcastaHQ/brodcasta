import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ProjectSidebar from '../components/ProjectSidebar';
import Topbar from '../components/Topbar';

const ProjectLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <ProjectSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen xl:pl-[20rem]">
        <div className="mx-auto max-w-[1280px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="pt-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProjectLayout;
