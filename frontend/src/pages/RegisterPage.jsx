import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '../components/services/api'

function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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

    if (formData.password !== formData.confirm_password) {
      setError('As senhas não conferem.')
      setSuccess('')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      await authService.register({
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
      })

      setSuccess('Conta criada com sucesso. Redirecionando para o login...')

      setTimeout(() => {
        navigate('/login')
      }, 1200)
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
          <span className="brand-mark">F</span>
          Fluxora
        </Link>

        <div className="auth-header">
          <p className="section-label">Criar acesso</p>
          <h1>Crie sua conta</h1>
          <p>
            Cadastre-se para organizar receitas, despesas e comprovantes em uma
            plataforma financeira centralizada.
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
              placeholder="Crie uma senha"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <label>
            Confirmar senha
            <input
              type="password"
              name="confirm_password"
              placeholder="Repita sua senha"
              value={formData.confirm_password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button className="primary-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </section>

      <section className="auth-side">
        <p className="eyebrow">Fluxora Web</p>
        <h2>Comece sua organização financeira com clareza.</h2>
        <p>
          Crie sua conta para acompanhar movimentações, visualizar seu fluxo de
          caixa e transformar registros financeiros em informações úteis.
        </p>
      </section>
    </main>
  )
}

export default RegisterPage