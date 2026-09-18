import { Routes, Route } from 'react-router-dom'
import { ConsentProvider } from './lib/consent'
import AuthProvider from './lib/auth'
import RequireRole from './components/RequireRole'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Trace from './pages/Trace'
import Rewards from './pages/Rewards'
import Esg from './pages/Esg'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Login from './pages/Login'
import Register from './pages/Register'
import UserPanel from './pages/UserPanel'
import StaffConsole from './pages/StaffConsole'
import NotFound from './pages/NotFound'

// NOTE: the single <BrowserRouter> (with the deploy basename) lives in
// components/RouterBase.tsx. App renders routes only.
export default function App() {
  return (
    <ConsentProvider>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trace" element={<Trace />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/esg" element={<Esg />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Member panel (mess / ngo / vendor) */}
            <Route
              path="/user"
              element={
                <RequireRole role="member">
                  <UserPanel />
                </RequireRole>
              }
            />
            {/* Staff console — internal tool, not linked from public nav */}
            <Route
              path="/staff-console"
              element={
                <RequireRole role="staff">
                  <StaffConsole />
                </RequireRole>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ConsentProvider>
  )
}
