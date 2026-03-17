import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WebSocketProvider } from './context/WebSocketContext'
import EmergencyBanner from './components/shared/EmergencyBanner'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import ProfileSetup from './pages/ProfileSetup'
import UserProfile from './pages/UserProfile'

function RequireCompletedProfile({ children }) {
  const { user, needsProfileSetup } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return needsProfileSetup ? <Navigate to="/perfil" replace /> : children
}

function OnlyIfProfilePending({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <EmergencyBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <RequireCompletedProfile>
              <Dashboard />
            </RequireCompletedProfile>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireCompletedProfile>
              <UserProfile />
            </RequireCompletedProfile>
          }
        />
        <Route
          path="/perfil"
          element={
            <OnlyIfProfilePending>
              <ProfileSetup />
            </OnlyIfProfilePending>
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WebSocketProvider>
          <AppRoutes />
        </WebSocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
