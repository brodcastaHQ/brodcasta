import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'
import DashboardLayout from './layout/DashboardLayout'
import ProjectDashboardLayout from './layout/ProjectDashboardLayout'
import Dashboard from './pages/dashboard'
import AccountSettings from './pages/dashboard/AccountSettings'
import AdminUsers from './pages/dashboard/AdminUsers'
import NewProject from './pages/dashboard/new'
import ProjectAnalytics from './pages/dashboard/projects/Analytics'
import ProjectApiKeys from './pages/dashboard/projects/ApiKeys'
import ProjectMessages from './pages/dashboard/projects/Messages'
import ProjectOverview from './pages/dashboard/projects/Overview'
import ProjectPlayground from './pages/dashboard/projects/Playground'
import ProjectSettings from './pages/dashboard/projects/Settings'
import Login from './pages/login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="new" element={<NewProject />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="*" element={<div className="p-8">Page not found or under construction.</div>} />
          </Route>
        </Route>

        {/* Project Dashboard Routes */}
        <Route path="/dashboard/projects/:projectId" element={<ProtectedRoute />}>
          <Route element={<ProjectDashboardLayout />}>
            <Route index element={<ProjectOverview />} />
            <Route path="analytics" element={<ProjectAnalytics />} />
            <Route path="api-keys" element={<ProjectApiKeys />} />
            <Route path="playground" element={<ProjectPlayground />} />
            <Route path="messages" element={<ProjectMessages />} />
            <Route path="settings" element={<ProjectSettings />} />
            <Route path="*" element={<div className="p-8">Feature under construction.</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
