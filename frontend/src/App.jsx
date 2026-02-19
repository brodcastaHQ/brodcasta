import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'
import DashboardLayout from './layout/DashboardLayout'
import ProjectDashboardLayout from './layout/ProjectDashboardLayout'
import Dashboard from './pages/dashboard'
import NewProject from './pages/dashboard/new'
import ProjectAnalytics from './pages/dashboard/projects/Analytics'
import ProjectApiKeys from './pages/dashboard/projects/ApiKeys'
import ProjectOverview from './pages/dashboard/projects/Overview'
import ProjectPlayground from './pages/dashboard/projects/Playground'
import ProjectSettings from './pages/dashboard/projects/Settings'
import LandingPage from './pages/homepage/LandingPage'
import Login from './pages/login'
import Signup from './pages/signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="new" element={<NewProject />} />
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
            <Route path="settings" element={<ProjectSettings />} />
            <Route path="*" element={<div className="p-8">Feature under construction.</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
