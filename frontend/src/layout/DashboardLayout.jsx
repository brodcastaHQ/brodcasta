import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-base-100">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-w-0">
                {/* <Topbar /> */}
                <main className="flex-1 p-4 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
