import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import DashboardLayout from './layout/DashboardLayout';
import ProjectDashboardLayout from './layout/ProjectDashboardLayout';
import Dashboard from './pages/dashboard';
import AccountSettings from './pages/dashboard/AccountSettings';
import AdminUsers from './pages/dashboard/AdminUsers';
import NewProject from './pages/dashboard/new';
import ProjectAnalytics from './pages/dashboard/projects/Analytics';
import ProjectApiKeys from './pages/dashboard/projects/ApiKeys';
import ProjectMessages from './pages/dashboard/projects/Messages';
import ProjectOverview from './pages/dashboard/projects/Overview';
import ProjectPlayground from './pages/dashboard/projects/Playground';
import ProjectSettings from './pages/dashboard/projects/Settings';
import Login from './pages/login';
import Signup from './pages/signup';

const PlaceholderPage = ({ title, copy }) => (
  <div className="surface-card mx-auto max-w-3xl p-10 text-center">
    <h1 className="text-3xl font-semibold text-white">{title}</h1>
    <p className="mt-3 text-[var(--app-muted)]">{copy}</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/pricing" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="new" element={<NewProject />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route
              path="*"
              element={
                <PlaceholderPage
                  title="Dashboard page not found"
                  copy="This route is not part of the current control panel surface yet."
                />
              }
            />
          </Route>
        </Route>

        <Route path="/dashboard/projects/:projectId" element={<ProtectedRoute />}>
          <Route element={<ProjectDashboardLayout />}>
            <Route index element={<ProjectOverview />} />
            <Route path="analytics" element={<ProjectAnalytics />} />
            <Route path="api-keys" element={<ProjectApiKeys />} />
            <Route path="playground" element={<ProjectPlayground />} />
            <Route path="messages" element={<ProjectMessages />} />
            <Route path="settings" element={<ProjectSettings />} />
            <Route
              path="*"
              element={
                <PlaceholderPage
                  title="Project page not found"
                  copy="This project surface is still being built."
                />
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
