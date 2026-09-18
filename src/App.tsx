import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import UserPanel from './pages/UserPanel'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ConsentProvider>
      <AuthProvider>
        <BrowserRouter>
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
              {/* Role-based panels */}
              <Route
                path="/user"
                element={
                  <RequireRole role="user">
                    <UserPanel />
                  </RequireRole>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireRole role="admin">
                    <Admin />
                  </RequireRole>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConsentProvider>
  )
}
