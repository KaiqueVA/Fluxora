import { useEffect, useMemo, useState } from 'react'
import PlatformLayout from '../components/platform/PlatformLayout'
import Topbar from '../components/platform/Topbar'
import { userProfileService } from '../components/services/api'

const initialProfileData = {
  phone: '',
  profession: '',
  monthly_income: '',
}

function normalizeApiValue(data, fieldName) {
  if (data === null || data === undefined) {
    return ''
  }

  if (typeof data !== 'object') {
    return String(data)
  }

  return String(data[fieldName] ?? data.data?.[fieldName] ?? data.value ?? '')
}

function normalizeMoneyValue(value) {
  if (value === '' || value === null || value === undefined) {
    return ''
  }

  return String(value).replace(',', '.')
}

function isValidPhone(phone) {
  if (!phone) {
    return true
  }

  const phonePattern = /^\+?[\d\s().-]{8,20}$/
  const digits = phone.replace(/\D/g, '')

  return phonePattern.test(phone) && digits.length >= 8 && digits.length <= 15
}

function validateProfileData(formData) {
  if (!isValidPhone(formData.phone.trim())) {
    return 'Informe um telefone válido. Exemplo: (15) 99999-9999.'
  }

  if (formData.profession.trim().length > 100) {
    return 'A profissão deve ter no máximo 100 caracteres.'
  }

  const normalizedIncome = normalizeMoneyValue(formData.monthly_income)

  if (normalizedIncome !== '' && Number(normalizedIncome) < 0) {
    return 'A renda mensal não pode ser negativa.'
  }

  return ''
}

function formatCurrency(value) {
  if (value === '' || value === null || value === undefined) {
    return 'Não informado'
  }

  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatBirthDate(date) {
  if (!date) {
    return 'Não informada'
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}

function getStoredBirthDate() {
  return localStorage.getItem('fluxora_last_birth_date') || ''
}

function ProfilePage() {
  const [formData, setFormData] = useState(initialProfileData)
  const [initialData, setInitialData] = useState(initialProfileData)
  const [birthDate] = useState(getStoredBirthDate)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const hasChanges = useMemo(() => {
    return (
      formData.phone !== initialData.phone ||
      formData.profession !== initialData.profession ||
      formData.monthly_income !== initialData.monthly_income
    )
  }, [formData, initialData])

  async function loadProfileData() {
    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      const [phoneResponse, professionResponse, monthlyIncomeResponse] =
        await Promise.allSettled([
          userProfileService.getPhone(),
          userProfileService.getProfession(),
          userProfileService.getMonthlyIncome(),
        ])

      const nextData = {
        phone:
          phoneResponse.status === 'fulfilled'
            ? normalizeApiValue(phoneResponse.value, 'phone')
            : '',
        profession:
          professionResponse.status === 'fulfilled'
            ? normalizeApiValue(professionResponse.value, 'profession')
            : '',
        monthly_income:
          monthlyIncomeResponse.status === 'fulfilled'
            ? normalizeApiValue(monthlyIncomeResponse.value, 'monthly_income')
            : '',
      }

      setFormData(nextData)
      setInitialData(nextData)

      if (
        phoneResponse.status === 'rejected' ||
        professionResponse.status === 'rejected' ||
        monthlyIncomeResponse.status === 'rejected'
      ) {
        setError(
          'Alguns dados não puderam ser carregados agora. Verifique sua sessão e tente novamente.',
        )
      }
    } catch (error) {
      setError(error.message || 'Não foi possível carregar os dados do perfil.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfileData()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationMessage = validateProfileData(formData)

    if (validationMessage) {
      setError(validationMessage)
      setSuccess('')
      return
    }

    try {
      setIsSaving(true)
      setError('')
      setSuccess('')

      const monthlyIncome =
        formData.monthly_income === ''
          ? ''
          : normalizeMoneyValue(formData.monthly_income)

      const updatedResponses = await Promise.all([
        userProfileService.updatePhone(formData.phone.trim()),
        userProfileService.updateProfession(formData.profession.trim()),
        userProfileService.updateMonthlyIncome(monthlyIncome),
      ])

      const updatedData = {
        phone: normalizeApiValue(updatedResponses[0], 'phone'),
        profession: normalizeApiValue(updatedResponses[1], 'profession'),
        monthly_income: normalizeApiValue(
          updatedResponses[2],
          'monthly_income',
        ),
      }

      setFormData(updatedData)
      setInitialData(updatedData)
      setSuccess('Perfil atualizado com sucesso.')
    } catch (error) {
      setError(error.message || 'Não foi possível atualizar o perfil.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PlatformLayout>
      <Topbar title="Perfil" label="Dados complementares" />

      <section className="profile-page">
        <section className="profile-grid">
          <article className="profile-card profile-form-card">
            <div className="profile-card-header">
              <div>
                <p className="section-label">Cadastro complementar</p>
                <h2>Editar informações</h2>
              </div>

              <span className="profile-status-pill">
                {hasChanges ? 'Alterações pendentes' : 'Atualizado'}
              </span>
            </div>

            <p className="profile-description">
              Consulte e edite telefone, profissão e renda mensal usando apenas
              os endpoints disponíveis no backend.
            </p>

            {isLoading ? (
              <p className="profile-loading">Carregando dados do perfil...</p>
            ) : (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="profile-form-grid">
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
                </div>

                {error && (
                  <p className="profile-alert profile-alert-error">{error}</p>
                )}

                {success && (
                  <p className="profile-alert profile-alert-success">
                    {success}
                  </p>
                )}

                <div className="profile-actions">
                  <button
                    className="primary-btn"
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Salvando...' : 'Salvar alterações'}
                  </button>

                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={loadProfileData}
                    disabled={isSaving}
                  >
                    Recarregar dados
                  </button>
                </div>
              </form>
            )}
          </article>

          <aside className="profile-card profile-summary-card">
            <div className="profile-card-header">
              <div>
                <p className="section-label">Resumo</p>
                <h2>Dados atuais</h2>
              </div>
            </div>

            <div className="profile-summary-list">
              <div>
                <span>Telefone</span>
                <strong>{formData.phone || 'Não informado'}</strong>
              </div>

              <div>
                <span>Profissão</span>
                <strong>{formData.profession || 'Não informada'}</strong>
              </div>

              <div>
                <span>Renda mensal</span>
                <strong>{formatCurrency(formData.monthly_income)}</strong>
              </div>
            </div>
          </aside>
        </section>

        <article className="profile-card profile-readonly-card">
          <div>
            <p className="section-label">Data de nascimento</p>
            <h2>{formatBirthDate(birthDate)}</h2>
          </div>

          <p>
            A data de nascimento pode ser enviada no cadastro, mas o backend
            atual não possui endpoint para consultar ou editar esse campo depois.
            Por isso, ela fica apenas como informação local quando disponível.
          </p>
        </article>
      </section>
    </PlatformLayout>
  )
}

export default ProfilePage