import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../components/services/api'

function LoginPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setIsLoading(true)
      setError('')

      const data = await authService.login({
        email: formData.email,
        password: formData.password,
      })

      if (data.access) {
        localStorage.setItem('accessToken', data.access)
      }

      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh)
      }

      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="auth-brand" to="/">
          <span className="brand-mark brand-logo-mark">
            <img src="/fluxora-icon.png" alt="Fluxora" />
          </span>
          Fluxora
        </Link>

        <div className="auth-header">
          <p className="section-label">Acesso à plataforma</p>
          <h1>Entre na sua conta</h1>
          <p>
            Acesse seu painel financeiro para acompanhar receitas, despesas e
            comprovantes organizados.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="primary-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Ainda não tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </section>

      <section className="auth-side">
        <p className="eyebrow">Fluxora Web</p>
        <h2>Organize seus dados financeiros em um só lugar.</h2>
        <p>
          Controle movimentações, acompanhe o fluxo de caixa e visualize
          informações importantes para tomar decisões melhores.
        </p>
      </section>
    </main>
  )
}

export default LoginPage