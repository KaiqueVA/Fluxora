import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../components/services/api'

const initialFormData = {
  name: '',
  email: '',
  password: '',
  confirm_password: '',
  birth_date: '',
  phone: '',
  profession: '',
  monthly_income: '',
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

function isFutureDate(date) {
  if (!date) {
    return false
  }

  const selectedDate = new Date(`${date}T00:00:00`)
  const today = new Date(`${getTodayDate()}T00:00:00`)

  return selectedDate > today
}

function isValidPhone(phone) {
  if (!phone) {
    return true
  }

  const digits = phone.replace(/\D/g, '')
  const phonePattern = /^\+?[\d\s().-]{8,20}$/

  return phonePattern.test(phone) && digits.length >= 8 && digits.length <= 15
}

function normalizeMoneyValue(value) {
  if (value === '') {
    return ''
  }

  return String(value).replace(',', '.')
}

function validateForm(formData) {
  if (!formData.name.trim()) {
    return 'Informe seu nome.'
  }

  if (!formData.email.trim()) {
    return 'Informe seu e-mail.'
  }

  if (!formData.password.trim()) {
    return 'Informe sua senha.'
  }

  if (!formData.confirm_password.trim()) {
    return 'Confirme sua senha.'
  }

  if (formData.password !== formData.confirm_password) {
    return 'As senhas não conferem.'
  }

  if (formData.birth_date && isFutureDate(formData.birth_date)) {
    return 'A data de nascimento não pode ser futura.'
  }

  if (!isValidPhone(formData.phone.trim())) {
    return 'Informe um telefone válido. Exemplo: (15) 99999-9999.'
  }

  if (formData.profession.trim().length > 100) {
    return 'A profissão deve ter no máximo 100 caracteres.'
  }

  const monthlyIncome = normalizeMoneyValue(formData.monthly_income)

  if (monthlyIncome !== '' && Number(monthlyIncome) < 0) {
    return 'A renda mensal não pode ser negativa.'
  }

  return ''
}

function buildRegisterPayload(formData) {
  return {
    name: formData.name.trim(),
    email: formData.email.trim(),
    password: formData.password,
    confirm_password: formData.confirm_password,
    birth_date: formData.birth_date || null,
    phone: formData.phone.trim(),
    profession: formData.profession.trim() || null,
    monthly_income:
      formData.monthly_income === ''
        ? null
        : normalizeMoneyValue(formData.monthly_income),
  }
}

function saveBirthDateLocally(birthDate) {
  if (birthDate) {
    localStorage.setItem('fluxora_last_birth_date', birthDate)
  }
}

function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState(initialFormData)
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

    const validationMessage = validateForm(formData)

    if (validationMessage) {
      setError(validationMessage)
      setSuccess('')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      setSuccess('')

      await authService.register(buildRegisterPayload(formData))
      saveBirthDateLocally(formData.birth_date)

      setSuccess('Cadastro criado com sucesso. Redirecionando para o login...')
      setFormData(initialFormData)

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
          <span className="brand-mark brand-logo-mark">
            <img src="/fluxora-icon.png" alt="Fluxora" />
          </span>
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

          <label>
            Data de nascimento
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              max={getTodayDate()}
            />
          </label>

          <label>
            Telefone
            <input
              type="tel"
              name="phone"
              placeholder="Ex: (15) 99999-9999"
              value={formData.phone}
              onChange={handleChange}
              maxLength={20}
            />
          </label>

          <label>
            Profissão
            <input
              type="text"
              name="profession"
              placeholder="Ex: Desenvolvedor frontend"
              value={formData.profession}
              onChange={handleChange}
              maxLength={100}
            />
          </label>

          <label>
            Renda mensal
            <input
              type="number"
              name="monthly_income"
              placeholder="Ex: 3500.00"
              value={formData.monthly_income}
              onChange={handleChange}
              min="0"
              step="0.01"
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