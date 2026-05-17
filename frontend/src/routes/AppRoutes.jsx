import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import ReceitasPage from '../pages/ReceitasPage'
import DespesasPage from '../pages/DespesasPage'
import ComprovantesPage from '../pages/ComprovantesPage'
import GoalsPage from '../pages/GoalsPage'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/receitas" element={<ReceitasPage />} />
        <Route path="/despesas" element={<DespesasPage />} />
        <Route path="/metas" element={<GoalsPage />} />
        <Route path="/comprovantes" element={<ComprovantesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes