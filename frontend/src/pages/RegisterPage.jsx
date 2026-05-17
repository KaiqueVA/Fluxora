import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../components/services/api'

function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      setSuccess('')

      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
      })

      setSuccess('Cadastro criado com sucesso. Redirecionando para o login...')

      setFormData({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
      })

      setTimeout(() => {
        navigate('/login')
      }, 900)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="auth-brand" to="/">
          <span className="brand-mark">F</span>
          <span>Fluxora</span>
        </Link>

        <div className="auth-header">
          <h1>Crie sua conta</h1>

          <p>
            Cadastre-se para organizar receitas, despesas e acompanhar sua
            evolução financeira em uma plataforma simples e visual.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              type="text"
              name="name"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              value={formData.email}
              onChange={handleChange}
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
              minLength={8}
              required
            />
          </label>

          <label>
            Confirmar senha
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirme sua senha"
              value={formData.confirm_password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button className="primary-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-footer">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </section>

      <section className="auth-side">
        <p className="eyebrow">Fluxora Web</p>

        <h2>Comece a visualizar melhor sua vida financeira.</h2>

        <p>
          Registre suas entradas e saídas para transformar movimentações
          financeiras em informações mais claras para tomada de decisão.
        </p>
      </section>
    </main>
  )
}

export default RegisterPage