import { Navigate, Route, Routes } from 'react-router-dom'

import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import ReceitasPage from '../pages/ReceitasPage'
import DespesasPage from '../pages/DespesasPage'
import ComprovantesPage from '../pages/ComprovantesPage'
import GoalsPage from '../pages/GoalsPage'
import ProfilePage from '../pages/ProfilePage'

function isAuthenticated() {
  return Boolean(localStorage.getItem('accessToken'))
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receitas"
        element={
          <ProtectedRoute>
            <ReceitasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/despesas"
        element={
          <ProtectedRoute>
            <DespesasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/metas"
        element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/comprovantes"
        element={
          <ProtectedRoute>
            <ComprovantesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes