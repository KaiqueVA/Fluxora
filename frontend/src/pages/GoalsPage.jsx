import { useEffect, useMemo, useState } from 'react'
import PlatformLayout from '../components/platform/PlatformLayout'
import Topbar from '../components/platform/Topbar'
import { metasService, saldoService } from '../components/services/api'

const emptyForm = {
  title: '',
  targetValue: '',
  deadline: '',
  description: '',
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(date) {
  if (!date) {
    return 'Sem prazo'
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}

function getTodayDateValue() {
  return new Date().toISOString().split('T')[0]
}

function normalizeNumber(value) {
  const numberValue = Number(value)

  if (Number.isNaN(numberValue)) {
    return 0
  }

  return numberValue
}

function normalizeApiList(data) {
  if (Array.isArray(data)) {
    return data
  }

  return data?.results || []
}

function mapGoalFromApi(goal) {
  return {
    id: goal.id,
    title: goal.name,
    description: goal.description || '',
    targetValue: normalizeNumber(goal.target_value),
    deadline: goal.deadline,
    createdAt: goal.created_at,
    updatedAt: goal.updated_at,
  }
}

function mapGoalToApiPayload(goal) {
  return {
    name: goal.title.trim(),
    description: goal.description.trim() || null,
    target_value: Number(goal.targetValue).toFixed(2),
    deadline: goal.deadline,
  }
}

function calculateProgress(targetValue, currentBalance) {
  if (!targetValue || Number(targetValue) <= 0) {
    return 0
  }

  const progress = (currentBalance / Number(targetValue)) * 100

  if (progress < 0) {
    return 0
  }

  if (progress > 100) {
    return 100
  }

  return progress
}

function getRemainingValue(targetValue, currentBalance) {
  const remainingValue = Number(targetValue || 0) - currentBalance

  if (remainingValue <= 0) {
    return 0
  }

  return remainingValue
}

function getDaysRemaining(deadline) {
  if (!deadline) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const limitDate = new Date(`${deadline}T00:00:00`)
  const differenceInMilliseconds = limitDate - today
  const differenceInDays = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  )

  return differenceInDays
}

function getGoalStatus(progress, deadline) {
  const daysRemaining = getDaysRemaining(deadline)

  if (progress >= 100) {
    return {
      label: 'Concluída',
      className: 'is-completed',
    }
  }

  if (daysRemaining !== null && daysRemaining < 0) {
    return {
      label: 'Atrasada',
      className: 'is-late',
    }
  }

  if (daysRemaining !== null && daysRemaining <= 30) {
    return {
      label: 'Prazo próximo',
      className: 'is-warning',
    }
  }

  return {
    label: 'Em andamento',
    className: 'is-active',
  }
}

function formatDeadlineInfo(deadline) {
  const daysRemaining = getDaysRemaining(deadline)

  if (daysRemaining === null) {
    return 'Sem prazo definido'
  }

  if (daysRemaining < 0) {
    return `${Math.abs(daysRemaining)} dias atrasada`
  }

  if (daysRemaining === 0) {
    return 'Vence hoje'
  }

  if (daysRemaining === 1) {
    return 'Falta 1 dia'
  }

  return `Faltam ${daysRemaining} dias`
}

function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingGoalId, setEditingGoalId] = useState(null)
  const [feedback, setFeedback] = useState({
    type: '',
    text: '',
  })
  const [pageError, setPageError] = useState('')
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [expandedGoalIds, setExpandedGoalIds] = useState([])
  const [currentBalance, setCurrentBalance] = useState(0)
  const [isBalanceLoading, setIsBalanceLoading] = useState(true)
  const [isGoalsLoading, setIsGoalsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [removingGoalId, setRemovingGoalId] = useState(null)

  const todayDateValue = getTodayDateValue()

  async function loadGoals() {
    try {
      setIsGoalsLoading(true)
      setPageError('')

      const data = await metasService.list()
      const normalizedGoals = normalizeApiList(data).map(mapGoalFromApi)

      setGoals(normalizedGoals)
    } catch (error) {
      setPageError(error.message || 'Não foi possível carregar as metas.')
    } finally {
      setIsGoalsLoading(false)
    }
  }

  async function loadBalance() {
    try {
      setIsBalanceLoading(true)
      setPageError('')

      const data = await saldoService.get()

      setCurrentBalance(normalizeNumber(data?.saldo))
    } catch (error) {
      setPageError(error.message || 'Não foi possível carregar o saldo atual.')
    } finally {
      setIsBalanceLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
    loadBalance()
  }, [])

  const goalsWithProgress = useMemo(() => {
    return goals.map((goal) => {
      const progress = calculateProgress(goal.targetValue, currentBalance)
      const remainingValue = getRemainingValue(goal.targetValue, currentBalance)
      const status = getGoalStatus(progress, goal.deadline)

      return {
        ...goal,
        progress,
        remainingValue,
        status,
      }
    })
  }, [goals, currentBalance])

  const activeGoals = goalsWithProgress.filter((goal) => {
    return goal.progress < 100
  }).length

  const averageProgress =
    goalsWithProgress.length > 0
      ? goalsWithProgress.reduce((total, goal) => {
          return total + goal.progress
        }, 0) / goalsWithProgress.length
      : 0

  const nearestGoal = useMemo(() => {
    if (goalsWithProgress.length === 0) {
      return null
    }

    return [...goalsWithProgress]
      .filter((goal) => goal.deadline)
      .sort((a, b) => {
        return (
          new Date(`${a.deadline}T00:00:00`) -
          new Date(`${b.deadline}T00:00:00`)
        )
      })[0]
  }, [goalsWithProgress])

  function showFeedback(type, text) {
    setFeedback({
      type,
      text,
    })
  }

  function clearFeedback() {
    setFeedback({
      type: '',
      text: '',
    })
  }

  function scrollToForm() {
    window.requestAnimationFrame(() => {
      const formElement = document.getElementById('goal-form')

      if (formElement) {
        formElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    })
  }

  function handleOpenForm() {
    setIsFormVisible(true)
    clearFeedback()
    scrollToForm()
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    if (feedback.type === 'error' || feedback.type === 'warning') {
      clearFeedback()
    }
  }

  function resetForm() {
    setFormData(emptyForm)
    setEditingGoalId(null)
    clearFeedback()
  }

  function handleCloseForm() {
    resetForm()
    setIsFormVisible(false)
  }

  function toggleGoalDetails(goalId) {
    setExpandedGoalIds((currentIds) => {
      if (currentIds.includes(goalId)) {
        return currentIds.filter((id) => id !== goalId)
      }

      return [...currentIds, goalId]
    })
  }

  function validateForm() {
    const numericTargetValue = Number(formData.targetValue)
    const trimmedTitle = formData.title.trim()

    if (!trimmedTitle) {
      return 'Informe o nome da meta.'
    }

    if (trimmedTitle.length < 3) {
      return 'O nome da meta deve ter pelo menos 3 caracteres.'
    }

    if (!numericTargetValue || numericTargetValue <= 0) {
      return 'Informe um valor alvo maior que zero.'
    }

    if (!formData.deadline) {
      return 'Informe o prazo da meta.'
    }

    if (formData.deadline < todayDateValue) {
      return 'O prazo da meta não pode ser uma data passada.'
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationMessage = validateForm()

    if (validationMessage) {
      showFeedback('error', validationMessage)
      setIsFormVisible(true)
      return
    }

    try {
      setIsSubmitting(true)
      clearFeedback()
      setPageError('')

      const payload = mapGoalToApiPayload(formData)

      if (editingGoalId) {
        const updatedGoal = await metasService.update(editingGoalId, payload)

        setGoals((currentGoals) =>
          currentGoals.map((goal) =>
            goal.id === editingGoalId ? mapGoalFromApi(updatedGoal) : goal,
          ),
        )

        showFeedback('success', 'Meta atualizada com sucesso.')
        setEditingGoalId(null)
        setFormData(emptyForm)
        setIsFormVisible(false)
        return
      }

      const createdGoal = await metasService.create(payload)
      const normalizedGoal = mapGoalFromApi(createdGoal)

      setGoals((currentGoals) => [normalizedGoal, ...currentGoals])
      setExpandedGoalIds((currentIds) => [normalizedGoal.id, ...currentIds])
      setFormData(emptyForm)
      setIsFormVisible(false)
      showFeedback('success', 'Meta criada com sucesso.')
    } catch (error) {
      showFeedback('error', error.message || 'Não foi possível salvar a meta.')
      setIsFormVisible(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(goal) {
    setEditingGoalId(goal.id)
    setIsFormVisible(true)
    setExpandedGoalIds((currentIds) => {
      if (currentIds.includes(goal.id)) {
        return currentIds
      }

      return [...currentIds, goal.id]
    })

    setFormData({
      title: goal.title,
      targetValue: String(goal.targetValue),
      deadline: goal.deadline,
      description: goal.description || '',
    })

    clearFeedback()
    scrollToForm()
  }

  async function handleRemove(goalId, goalTitle) {
    const shouldRemove = window.confirm(
      `Tem certeza que deseja remover a meta "${goalTitle}"?`,
    )

    if (!shouldRemove) {
      showFeedback('warning', 'Remoção cancelada. Nenhuma meta foi excluída.')
      return
    }

    try {
      setRemovingGoalId(goalId)
      setPageError('')
      clearFeedback()

      await metasService.remove(goalId)

      setGoals((currentGoals) => {
        return currentGoals.filter((goal) => goal.id !== goalId)
      })

      setExpandedGoalIds((currentIds) => {
        return currentIds.filter((id) => id !== goalId)
      })

      if (editingGoalId === goalId) {
        resetForm()
        setIsFormVisible(false)
      }

      showFeedback('success', 'Meta removida com sucesso.')
    } catch (error) {
      setPageError(error.message || 'Não foi possível remover a meta.')
    } finally {
      setRemovingGoalId(null)
    }
  }

  const balanceText = isBalanceLoading
    ? 'Carregando...'
    : formatCurrency(currentBalance)

  return (
    <PlatformLayout>
      <Topbar
        title="Metas financeiras"
        label="Planejamento e acompanhamento de objetivos"
      />

      <section className="goals-page">
        <article className="goals-hero">
          <div>
            <p className="section-label">Objetivos financeiros</p>

            <h2>Planeje metas com base no seu saldo atual.</h2>

            <p>
              Crie objetivos financeiros, acompanhe o progresso de cada meta e
              visualize quanto ainda falta para alcançar seus próximos planos.
            </p>
          </div>

          <button
            className="goals-hero-action"
            type="button"
            onClick={handleOpenForm}
          >
            + Nova meta
          </button>
        </article>

        {pageError && (
          <p className="goals-message is-error" role="alert">
            {pageError}
          </p>
        )}

        {feedback.text && !isFormVisible && (
          <p
            className={`goals-message is-${feedback.type}`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {feedback.text}
          </p>
        )}

        <section className="goals-summary-grid">
          <article className="goals-summary-card is-balance">
            <span>Saldo atual</span>
            <strong>{balanceText}</strong>
            <p>Calculado pelo endpoint de saldo.</p>
          </article>

          <article className="goals-summary-card">
            <span>Metas ativas</span>
            <strong>{activeGoals}</strong>
            <p>{goalsWithProgress.length} objetivos cadastrados.</p>
          </article>

          <article className="goals-summary-card">
            <span>Progresso médio</span>
            <strong>{averageProgress.toFixed(0)}%</strong>

            <div className="goals-mini-progress">
              <div style={{ width: `${averageProgress}%` }} />
            </div>
          </article>

          <article className="goals-summary-card">
            <span>Próximo prazo</span>
            <strong>
              {nearestGoal ? formatDate(nearestGoal.deadline) : '-'}
            </strong>
            <p>{nearestGoal ? nearestGoal.title : 'Nenhuma meta cadastrada.'}</p>
          </article>
        </section>

        <section className="goals-mobile-summary-card">
          <div className="goals-mobile-balance">
            <span>Saldo atual</span>
            <strong>{balanceText}</strong>
          </div>

          <div className="goals-mobile-summary-row">
            <div>
              <span>Metas</span>
              <strong>{activeGoals} ativas</strong>
            </div>

            <div>
              <span>Progresso</span>
              <strong>{averageProgress.toFixed(0)}% médio</strong>
            </div>
          </div>

          <div className="goals-mini-progress">
            <div style={{ width: `${averageProgress}%` }} />
          </div>

          <div className="goals-mobile-nearest">
            <span>Próximo prazo</span>
            <strong>{nearestGoal ? nearestGoal.title : 'Nenhuma meta'}</strong>
            <small>{nearestGoal ? formatDate(nearestGoal.deadline) : '-'}</small>
          </div>
        </section>

        <section className="goals-workspace">
          <article
            className={`goals-card goals-form-card ${
              isFormVisible ? 'is-visible' : 'is-mobile-collapsed'
            }`}
            id="goal-form"
          >
            <div className="goals-card-header">
              <div>
                <p className="section-label">
                  {editingGoalId ? 'Editar meta' : 'Nova meta'}
                </p>

                <h2>
                  {editingGoalId
                    ? 'Atualize seu objetivo'
                    : 'Cadastre um objetivo'}
                </h2>
              </div>

              <button
                className="goals-form-close"
                type="button"
                aria-label="Fechar formulário"
                onClick={handleCloseForm}
              >
                ×
              </button>
            </div>

            <form className="goals-form" onSubmit={handleSubmit} noValidate>
              <label>
                Nome da meta
                <input
                  type="text"
                  name="title"
                  placeholder="Ex: Comprar notebook"
                  value={formData.title}
                  onChange={handleChange}
                  minLength="3"
                  required
                  aria-invalid={feedback.type === 'error'}
                />
              </label>

              <div className="goals-form-row">
                <label>
                  Valor alvo
                  <input
                    type="number"
                    name="targetValue"
                    min="0.01"
                    step="0.01"
                    placeholder="5000.00"
                    value={formData.targetValue}
                    onChange={handleChange}
                    required
                    aria-invalid={feedback.type === 'error'}
                  />
                </label>

                <label>
                  Prazo
                  <input
                    type="date"
                    name="deadline"
                    min={todayDateValue}
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    aria-invalid={feedback.type === 'error'}
                  />
                </label>
              </div>

              <label>
                Descrição
                <textarea
                  name="description"
                  placeholder="Descreva o objetivo da meta"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </label>

              {feedback.text && isFormVisible && (
                <p
                  className={`goals-message is-${feedback.type}`}
                  role={feedback.type === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                >
                  {feedback.text}
                </p>
              )}

              <div className="goals-form-actions">
                <button
                  className="goals-secondary-button"
                  type="button"
                  onClick={handleCloseForm}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>

                <button
                  className="primary-btn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Salvando...'
                    : editingGoalId
                      ? 'Salvar alterações'
                      : 'Criar meta'}
                </button>
              </div>
            </form>
          </article>

          <article className="goals-card goals-list-card">
            <div className="goals-card-header">
              <div>
                <p className="section-label">Acompanhamento</p>
                <h2>Suas metas</h2>
              </div>

              <button
                className="goals-list-action"
                type="button"
                onClick={handleOpenForm}
              >
                + Nova
              </button>
            </div>

            {isGoalsLoading ? (
              <p className="goals-empty" role="status" aria-live="polite">
                Carregando metas...
              </p>
            ) : goalsWithProgress.length === 0 ? (
              <p className="goals-empty">
                Nenhuma meta cadastrada até o momento. Crie uma nova meta para
                acompanhar seu progresso financeiro.
              </p>
            ) : (
              <div className="goals-list">
                {goalsWithProgress.map((goal) => {
                  const isExpanded = expandedGoalIds.includes(goal.id)
                  const isRemoving = removingGoalId === goal.id

                  return (
                    <article
                      className={`goal-item ${
                        isExpanded ? 'is-expanded' : ''
                      }`}
                      key={goal.id}
                    >
                      <div className="goal-item-header">
                        <div>
                          <strong>{goal.title}</strong>

                          <span>
                            {formatCurrency(currentBalance)} de{' '}
                            {formatCurrency(goal.targetValue)}
                          </span>
                        </div>

                        <span className={`goal-status ${goal.status.className}`}>
                          {goal.status.label}
                        </span>
                      </div>

                      <div className="goal-progress-row">
                        <div
                          className="goal-progress-bar"
                          aria-label={`Progresso da meta ${goal.title}`}
                        >
                          <div style={{ width: `${goal.progress}%` }} />
                        </div>

                        <strong>{goal.progress.toFixed(0)}%</strong>
                      </div>

                      <button
                        className="goal-details-toggle"
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() => toggleGoalDetails(goal.id)}
                      >
                        <span>
                          {isExpanded ? 'Ocultar detalhes' : 'Ver detalhes'}
                        </span>

                        <strong>{isExpanded ? '−' : '+'}</strong>
                      </button>

                      {isExpanded && (
                        <div className="goal-details">
                          <div className="goal-meta-grid">
                            <div>
                              <span>Falta</span>
                              <strong>
                                {formatCurrency(goal.remainingValue)}
                              </strong>
                            </div>

                            <div>
                              <span>Prazo</span>
                              <strong>{formatDate(goal.deadline)}</strong>
                            </div>

                            <div>
                              <span>Status do prazo</span>
                              <strong>{formatDeadlineInfo(goal.deadline)}</strong>
                            </div>
                          </div>

                          {goal.description && (
                            <p className="goal-description">
                              {goal.description}
                            </p>
                          )}

                          <div className="goal-actions">
                            <button
                              type="button"
                              onClick={() => handleEdit(goal)}
                              disabled={isRemoving}
                            >
                              Editar
                            </button>

                            <button
                              className="is-danger"
                              type="button"
                              onClick={() => handleRemove(goal.id, goal.title)}
                              disabled={isRemoving}
                            >
                              {isRemoving ? 'Removendo...' : 'Remover'}
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </article>
        </section>
      </section>
    </PlatformLayout>
  )
}

export default GoalsPage