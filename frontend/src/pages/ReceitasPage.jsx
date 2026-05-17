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

  const totalReceitas = receitas.reduce((total, receita) => {
    return total + Number(receita.value || 0)
  }, 0)

  const averageReceita =
    receitas.length > 0 ? totalReceitas / receitas.length : 0

  const monthlyRevenue = useMemo(() => {
    const groupedRevenue = receitas.reduce((accumulator, receita) => {
      const month = getMonthLabel(receita.date)
      const value = Number(receita.value || 0)

      accumulator[month] = (accumulator[month] || 0) + value

      return accumulator
    }, {})

    return Object.entries(groupedRevenue).map(([month, value]) => ({
      month,
      value,
    }))
  }, [receitas])

  const maxMonthlyValue = Math.max(
    ...monthlyRevenue.map((item) => item.value),
    1,
  )

  return (
    <PlatformLayout>
      <Topbar title="Receitas" label="Entradas financeiras" />

      <section className="revenue-page">
        <section className="revenue-overview">
          <article className="revenue-kpi primary">
            <span>Total recebido</span>
            <strong>{formatCurrency(totalReceitas)}</strong>
            <p>Soma das entradas cadastradas.</p>
          </article>

          <article className="revenue-kpi">
            <span>Receitas</span>
            <strong>{receitas.length}</strong>
            <p>Registros encontrados.</p>
          </article>

          <article className="revenue-kpi">
            <span>Média por receita</span>
            <strong>{formatCurrency(averageReceita)}</strong>
            <p>Valor médio das entradas.</p>
          </article>
        </section>

        <section className="revenue-actions-card">
          <div className="revenue-actions-header">
            <div>
              <p className="section-label">Cadastro</p>
              <h2>Nova receita</h2>
            </div>

            <button
              className="secondary-action-button"
              type="button"
              onClick={() => setIsFormOpen((currentValue) => !currentValue)}
            >
              {isFormOpen ? 'Fechar' : 'Adicionar receita'}
            </button>
          </div>

          {isFormOpen && (
            <form className="revenue-form compact" onSubmit={handleSubmit}>
              <label>
                Descrição
                <input
                  type="text"
                  name="description"
                  placeholder="Ex: Salário, freelance..."
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
                  placeholder="2500.00"
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

              <button
                className="primary-btn"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </form>
          )}

          {!isFormOpen && error && <p className="auth-error">{error}</p>}
        </section>

        <section className="revenue-content-grid">
          <article className="revenue-card revenue-chart-card">
            <div className="revenue-card-header">
              <div>
                <p className="section-label">Visualização</p>
                <h2>Receitas por mês</h2>
              </div>
            </div>

            {monthlyRevenue.length === 0 ? (
              <p className="revenue-empty">Nenhum dado para visualizar.</p>
            ) : (
              <div className="revenue-chart">
                {monthlyRevenue.map((item) => (
                  <div className="revenue-chart-item" key={item.month}>
                    <div className="revenue-chart-label">
                      <span>{item.month}</span>
                      <strong>{formatCurrency(item.value)}</strong>
                    </div>

                    <div className="revenue-chart-track">
                      <div
                        className="revenue-chart-fill"
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

          <article className="revenue-card revenue-list-card">
            <div className="revenue-card-header">
              <div>
                <p className="section-label">Histórico</p>
                <h2>Receitas cadastradas</h2>
              </div>
            </div>

            {isLoading ? (
              <p className="revenue-empty">Carregando receitas...</p>
            ) : receitas.length === 0 ? (
              <p className="revenue-empty">
                Nenhuma receita cadastrada até o momento.
              </p>
            ) : (
              <div className="revenue-list">
                {receitas.map((receita) => (
                  <div className="revenue-list-item" key={receita.id}>
                    <div>
                      <strong>{receita.description}</strong>
                      <span>{formatDate(receita.date)}</span>
                    </div>

                    <div className="revenue-list-value">
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
      </section>
    </PlatformLayout>
  )
}

export default ReceitasPage