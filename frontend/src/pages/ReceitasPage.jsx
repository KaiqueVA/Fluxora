import { useEffect, useMemo, useState } from 'react'
import PlatformLayout from '../components/platform/PlatformLayout'
import Topbar from '../components/platform/Topbar'
import { receitasService } from '../components/services/api'

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(date) {
  if (!date) {
    return '-'
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}

function getMonthLabel(date) {
  if (!date) {
    return 'Sem data'
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR', {
    month: 'short',
    year: '2-digit',
  })
}

function ReceitasPage() {
  const [receitas, setReceitas] = useState([])
  const [formData, setFormData] = useState({
    description: '',
    value: '',
    date: '',
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  async function loadReceitas() {
    try {
      setIsLoading(true)
      setError('')

      const data = await receitasService.list()
      const receitasData = Array.isArray(data) ? data : data.results || []

      setReceitas(receitasData)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReceitas()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function handleCloseForm() {
    setIsFormOpen(false)
    setError('')
    setFormData({
      description: '',
      value: '',
      date: '',
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setError('')

      await receitasService.create({
        description: formData.description,
        value: formData.value,
        date: formData.date,
      })

      setFormData({
        description: '',
        value: '',
        date: '',
      })

      setIsFormOpen(false)
      await loadReceitas()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id) {
    try {
      setError('')

      await receitasService.remove(id)
      await loadReceitas()
    } catch (error) {
      setError(error.message)
    }
  }

  const sortedReceitas = useMemo(() => {
    return [...receitas].sort((a, b) => {
      return new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`)
    })
  }, [receitas])

  const totalReceitas = receitas.reduce((total, receita) => {
    return total + Number(receita.value || 0)
  }, 0)

  const averageReceita =
    receitas.length > 0 ? totalReceitas / receitas.length : 0

  const biggestReceita = useMemo(() => {
    if (receitas.length === 0) {
      return null
    }

    return receitas.reduce((biggest, receita) => {
      return Number(receita.value || 0) > Number(biggest.value || 0)
        ? receita
        : biggest
    }, receitas[0])
  }, [receitas])

  const monthlyRevenue = useMemo(() => {
    const groupedRevenue = receitas.reduce((accumulator, receita) => {
      const month = getMonthLabel(receita.date)
      const value = Number(receita.value || 0)

      accumulator[month] = (accumulator[month] || 0) + value

      return accumulator
    }, {})

    return Object.entries(groupedRevenue)
      .map(([month, value]) => ({
        month,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [receitas])

  const maxMonthlyValue = Math.max(
    ...monthlyRevenue.map((item) => item.value),
    1,
  )

  const biggestPercentage =
    totalReceitas > 0 && biggestReceita
      ? (Number(biggestReceita.value || 0) / totalReceitas) * 100
      : 0

  function getIncomeInsight() {
    if (receitas.length === 0) {
      return 'Cadastre sua primeira receita para começar a acompanhar suas entradas financeiras.'
    }

    if (biggestReceita) {
      return `Sua maior entrada foi ${
        biggestReceita.description
      }, representando ${biggestPercentage.toFixed(0)}% do total recebido.`
    }

    return 'Acompanhe suas entradas para entender melhor a evolução das suas receitas.'
  }

  return (
    <PlatformLayout>
      <Topbar title="Receitas" label="Entradas financeiras" />

      <section className="income-page">
        {error && !isFormOpen && <p className="auth-error">{error}</p>}

        <article className="income-hero">
          <div>
            <p className="section-label">Total recebido</p>
            <h2>{formatCurrency(totalReceitas)}</h2>
            <p>{getIncomeInsight()}</p>
          </div>

          <button
            className="income-add-button"
            type="button"
            onClick={() => setIsFormOpen((currentValue) => !currentValue)}
          >
            {isFormOpen ? 'Fechar' : '+ Adicionar receita'}
          </button>
        </article>

        {isFormOpen && (
          <article className="income-form-card">
            <div className="income-card-header">
              <div>
                <p className="section-label">Nova entrada</p>
                <h2>Cadastrar receita</h2>
              </div>
            </div>

            <form className="income-form" onSubmit={handleSubmit}>
              <label>
                Descrição
                <input
                  type="text"
                  name="description"
                  placeholder="Ex: Salário mensal"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Valor
                <input
                  type="number"
                  name="value"
                  placeholder="5200.00"
                  value={formData.value}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </label>

              <label>
                Data
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </label>

              {error && <p className="auth-error">{error}</p>}

              <div className="income-form-actions">
                <button
                  className="income-cancel-button"
                  type="button"
                  onClick={handleCloseForm}
                >
                  Cancelar
                </button>

                <button
                  className="primary-btn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar receita'}
                </button>
              </div>
            </form>
          </article>
        )}

        <section className="income-grid">
          <article className="income-card income-summary-card">
            <div className="income-card-header">
              <div>
                <p className="section-label">Resumo</p>
                <h2>Indicadores</h2>
              </div>
            </div>

            <div className="income-summary-list">
              <div>
                <span>Média por receita</span>
                <strong>{formatCurrency(averageReceita)}</strong>
              </div>

              <div>
                <span>Maior receita</span>
                <strong>
                  {biggestReceita
                    ? formatCurrency(biggestReceita.value)
                    : formatCurrency(0)}
                </strong>
              </div>

              <div>
                <span>Registros</span>
                <strong>{receitas.length}</strong>
              </div>
            </div>
          </article>

          <article className="income-card">
            <div className="income-card-header">
              <div>
                <p className="section-label">Visualização</p>
                <h2>Receitas por mês</h2>
              </div>
            </div>

            {monthlyRevenue.length === 0 ? (
              <p className="income-empty">Nenhum dado para visualizar.</p>
            ) : (
              <div className="income-month-list">
                {monthlyRevenue.map((item) => (
                  <div className="income-month-item" key={item.month}>
                    <div className="income-month-label">
                      <span>{item.month}</span>
                      <strong>{formatCurrency(item.value)}</strong>
                    </div>

                    <div className="income-month-track">
                      <div
                        style={{
                          width: `${Math.max(
                            (item.value / maxMonthlyValue) * 100,
                            8,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        <article className="income-card">
          <div className="income-card-header">
            <div>
              <p className="section-label">Histórico</p>
              <h2>Entradas recentes</h2>
            </div>
          </div>

          {isLoading ? (
            <p className="income-empty">Carregando receitas...</p>
          ) : sortedReceitas.length === 0 ? (
            <p className="income-empty">
              Nenhuma receita cadastrada até o momento.
            </p>
          ) : (
            <div className="income-history-list">
              {sortedReceitas.map((receita) => (
                <div className="income-history-item" key={receita.id}>
                  <div>
                    <strong>{receita.description}</strong>
                    <span>{formatDate(receita.date)}</span>
                  </div>

                  <div className="income-history-value">
                    <strong>{formatCurrency(receita.value)}</strong>

                    <button
                      type="button"
                      onClick={() => handleDelete(receita.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </PlatformLayout>
  )
}

export default ReceitasPage