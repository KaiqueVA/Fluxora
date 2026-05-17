import { useMemo, useState } from 'react'
import PlatformLayout from '../components/platform/PlatformLayout'
import Topbar from '../components/platform/Topbar'

const currentBalance = 2450

const initialGoals = [
  {
    id: 1,
    title: 'Comprar notebook',
    description: 'Meta para trocar de computador.',
    targetValue: 5000,
    deadline: '2026-12-31',
  },
  {
    id: 2,
    title: 'Reserva de emergência',
    description: 'Construir uma reserva para imprevistos.',
    targetValue: 8000,
    deadline: '2027-06-30',
  },
  {
    id: 3,
    title: 'Curso de especialização',
    description: 'Investimento em desenvolvimento profissional.',
    targetValue: 3200,
    deadline: '2026-09-15',
  },
]

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

function calculateProgress(targetValue) {
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

function getRemainingValue(targetValue) {
  const remainingValue = Number(targetValue || 0) - currentBalance

  if (remainingValue <= 0) {
    return 0
  }

  return remainingValue
}

function getGoalStatus(progress, deadline) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const limitDate = deadline ? new Date(`${deadline}T00:00:00`) : null

  if (progress >= 100) {
    return {
      label: 'Concluída',
      className: 'is-completed',
    }
  }

  if (limitDate && limitDate < today) {
    return {
      label: 'Atrasada',
      className: 'is-late',
    }
  }

  return {
    label: 'Em andamento',
    className: 'is-active',
  }
}

function GoalsPage() {
  const [goals, setGoals] = useState(initialGoals)
  const [formData, setFormData] = useState(emptyForm)
  const [editingGoalId, setEditingGoalId] = useState(null)
  const [message, setMessage] = useState('')

  const goalsWithProgress = useMemo(() => {
    return goals.map((goal) => {
      const progress = calculateProgress(goal.targetValue)
      const remainingValue = getRemainingValue(goal.targetValue)
      const status = getGoalStatus(progress, goal.deadline)

      return {
        ...goal,
        progress,
        remainingValue,
        status,
      }
    })
  }, [goals])

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

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function resetForm() {
    setFormData(emptyForm)
    setEditingGoalId(null)
    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const numericTargetValue = Number(formData.targetValue)

    if (!formData.title.trim()) {
      setMessage('Informe o nome da meta.')
      return
    }

    if (!numericTargetValue || numericTargetValue <= 0) {
      setMessage('Informe um valor alvo maior que zero.')
      return
    }

    if (!formData.deadline) {
      setMessage('Informe o prazo da meta.')
      return
    }

    const goalPayload = {
      title: formData.title.trim(),
      targetValue: numericTargetValue,
      deadline: formData.deadline,
      description: formData.description.trim(),
    }

    if (editingGoalId) {
      setGoals((currentGoals) =>
        currentGoals.map((goal) =>
          goal.id === editingGoalId
            ? {
                ...goal,
                ...goalPayload,
              }
            : goal,
        ),
      )

      setMessage('Meta atualizada com sucesso.')
      setEditingGoalId(null)
      setFormData(emptyForm)
      return
    }

    const newGoal = {
      id: Date.now(),
      ...goalPayload,
    }

    setGoals((currentGoals) => [newGoal, ...currentGoals])
    setFormData(emptyForm)
    setMessage('Meta criada com sucesso.')
  }

  function handleEdit(goal) {
    setEditingGoalId(goal.id)
    setFormData({
      title: goal.title,
      targetValue: String(goal.targetValue),
      deadline: goal.deadline,
      description: goal.description || '',
    })
    setMessage('')
  }

  function handleRemove(goalId) {
    setGoals((currentGoals) => {
      return currentGoals.filter((goal) => goal.id !== goalId)
    })

    if (editingGoalId === goalId) {
      resetForm()
    }

    setMessage('Meta removida.')
  }

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

          <a className="goals-hero-action" href="#goal-form">
            + Nova meta
          </a>
        </article>

        <section className="goals-summary-grid">
          <article className="goals-summary-card is-balance">
            <span>Saldo atual</span>
            <strong>{formatCurrency(currentBalance)}</strong>
            <p>Valor usado como base para simular o progresso das metas.</p>
          </article>

          <article className="goals-summary-card">
            <span>Metas ativas</span>
            <strong>{activeGoals}</strong>
            <p>{goalsWithProgress.length} metas cadastradas no total.</p>
          </article>

          <article className="goals-summary-card">
            <span>Progresso médio</span>
            <strong>{averageProgress.toFixed(0)}%</strong>

            <div className="goals-mini-progress">
              <div style={{ width: `${averageProgress}%` }} />
            </div>
          </article>

          <article className="goals-summary-card">
            <span>Prazo mais próximo</span>
            <strong>
              {nearestGoal ? formatDate(nearestGoal.deadline) : '-'}
            </strong>
            <p>{nearestGoal ? nearestGoal.title : 'Nenhuma meta cadastrada.'}</p>
          </article>
        </section>

        <section className="goals-content-grid">
          <article className="goals-card goals-form-card" id="goal-form">
            <div className="goals-card-header">
              <div>
                <p className="section-label">
                  {editingGoalId ? 'Editar meta' : 'Nova meta'}
                </p>

                <h2>
                  {editingGoalId
                    ? 'Atualize sua meta financeira'
                    : 'Cadastre um novo objetivo'}
                </h2>
              </div>
            </div>

            <form className="goals-form" onSubmit={handleSubmit}>
              <label>
                Nome da meta
                <input
                  type="text"
                  name="title"
                  placeholder="Ex: Comprar notebook"
                  value={formData.title}
                  onChange={handleChange}
                />
              </label>

              <label>
                Valor alvo
                <input
                  type="number"
                  name="targetValue"
                  min="0"
                  step="0.01"
                  placeholder="5000.00"
                  value={formData.targetValue}
                  onChange={handleChange}
                />
              </label>

              <label>
                Prazo
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </label>

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

              {message && <p className="goals-message">{message}</p>}

              <div className="goals-form-actions">
                {editingGoalId && (
                  <button
                    className="goals-secondary-button"
                    type="button"
                    onClick={resetForm}
                  >
                    Cancelar edição
                  </button>
                )}

                <button className="primary-btn" type="submit">
                  {editingGoalId ? 'Salvar alterações' : 'Criar meta'}
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
            </div>

            {goalsWithProgress.length === 0 ? (
              <p className="goals-empty">
                Nenhuma meta cadastrada até o momento.
              </p>
            ) : (
              <div className="goals-list">
                {goalsWithProgress.map((goal) => (
                  <article className="goal-item" key={goal.id}>
                    <div className="goal-item-header">
                      <div>
                        <strong>{goal.title}</strong>

                        <span>
                          {formatCurrency(currentBalance)} /{' '}
                          {formatCurrency(goal.targetValue)}
                        </span>
                      </div>

                      <span className={`goal-status ${goal.status.className}`}>
                        {goal.status.label}
                      </span>
                    </div>

                    <div className="goal-progress-row">
                      <div className="goal-progress-bar">
                        <div style={{ width: `${goal.progress}%` }} />
                      </div>

                      <strong>{goal.progress.toFixed(0)}%</strong>
                    </div>

                    <div className="goal-item-footer">
                      <span>Falta {formatCurrency(goal.remainingValue)}</span>
                      <span>Prazo: {formatDate(goal.deadline)}</span>
                    </div>

                    {goal.description && (
                      <p className="goal-description">{goal.description}</p>
                    )}

                    <div className="goal-actions">
                      <button type="button" onClick={() => handleEdit(goal)}>
                        Editar
                      </button>

                      <button
                        className="is-danger"
                        type="button"
                        onClick={() => handleRemove(goal.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>
        </section>
      </section>
    </PlatformLayout>
  )
}

export default GoalsPage