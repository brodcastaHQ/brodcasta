import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'
import DashboardLayout from './layout/DashboardLayout'
import Dashboard from './pages/dashboard'
import Login from './pages/login'
import Signup from './pages/signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            {/* Add other dashboard routes here as placeholders for now */}
            <Route path="*" element={<div className="p-8">Page not found or under construction.</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
