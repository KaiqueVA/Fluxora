import { useEffect, useMemo, useState } from 'react'
import PlatformLayout from '../components/platform/PlatformLayout'
import Topbar from '../components/platform/Topbar'
import { despesasService } from '../components/services/api'

const expenseCategories = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Assinaturas',
  'Compras',
  'Contas fixas',
  'Outros',
]

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

function DespesasPage() {
  const [despesas, setDespesas] = useState([])

  const [formData, setFormData] = useState({
    description: '',
    category: '',
    value: '',
    date: '',
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  async function loadDespesas() {
    try {
      setIsLoading(true)
      setError('')

      const data = await despesasService.list()
      const despesasData = Array.isArray(data) ? data : data.results || []

      setDespesas(despesasData)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDespesas()
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
      category: '',
      value: '',
      date: '',
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setError('')

      await despesasService.create({
        description: formData.description,
        category: formData.category,
        value: formData.value,
        date: formData.date,
      })

      setFormData({
        description: '',
        category: '',
        value: '',
        date: '',
      })

      setIsFormOpen(false)
      await loadDespesas()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id) {
    try {
      setError('')

      await despesasService.remove(id)
      await loadDespesas()
    } catch (error) {
      setError(error.message)
    }
  }

  const sortedDespesas = useMemo(() => {
    return [...despesas].sort((a, b) => {
      return new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`)
    })
  }, [despesas])

  const totalDespesas = despesas.reduce((total, despesa) => {
    return total + Number(despesa.value || 0)
  }, 0)

  const averageDespesa =
    despesas.length > 0 ? totalDespesas / despesas.length : 0

  const biggestDespesa = useMemo(() => {
    if (despesas.length === 0) {
      return null
    }

    return despesas.reduce((biggest, despesa) => {
      return Number(despesa.value || 0) > Number(biggest.value || 0)
        ? despesa
        : biggest
    }, despesas[0])
  }, [despesas])

  const categoryExpenses = useMemo(() => {
    const groupedExpenses = despesas.reduce((accumulator, despesa) => {
      const category = despesa.category || 'Sem categoria'
      const value = Number(despesa.value || 0)

      accumulator[category] = (accumulator[category] || 0) + value

      return accumulator
    }, {})

    return Object.entries(groupedExpenses)
      .map(([category, value]) => ({
        category,
        value,
        percentage: totalDespesas > 0 ? (value / totalDespesas) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [despesas, totalDespesas])

  const topCategory = categoryExpenses[0]

  const maxCategoryValue = Math.max(
    ...categoryExpenses.map((item) => item.value),
    1,
  )

  const biggestPercentage =
    totalDespesas > 0 && biggestDespesa
      ? (Number(biggestDespesa.value || 0) / totalDespesas) * 100
      : 0

  function getExpenseInsight() {
    if (despesas.length === 0) {
      return 'Cadastre sua primeira despesa para visualizar para onde seu dinheiro está indo.'
    }

    if (topCategory) {
      return `Sua maior concentração de gastos está em ${
        topCategory.category
      }, representando ${topCategory.percentage.toFixed(0)}% do total gasto.`
    }

    if (biggestDespesa) {
      return `Sua maior despesa foi ${
        biggestDespesa.description
      }, representando ${biggestPercentage.toFixed(0)}% do total gasto.`
    }

    return 'Acompanhe suas despesas para entender melhor seus hábitos financeiros.'
  }

  return (
    <PlatformLayout>
      <Topbar title="Despesas" label="Saídas financeiras" />

      <section className="expense-page">
        {error && !isFormOpen && <p className="auth-error">{error}</p>}

        <article className="expense-hero">
          <div>
            <p className="section-label">Total gasto</p>
            <h2>{formatCurrency(totalDespesas)}</h2>
            <p>{getExpenseInsight()}</p>
          </div>

          <button
            className="expense-add-button"
            type="button"
            onClick={() => setIsFormOpen((currentValue) => !currentValue)}
          >
            {isFormOpen ? 'Fechar' : '+ Adicionar despesa'}
          </button>
        </article>

        {isFormOpen && (
          <article className="expense-form-card">
            <div className="expense-card-header">
              <div>
                <p className="section-label">Nova saída</p>
                <h2>Cadastrar despesa</h2>
              </div>
            </div>

            <form className="expense-form" onSubmit={handleSubmit}>
              <label>
                Descrição
                <input
                  type="text"
                  name="description"
                  placeholder="Ex: Mercado, aluguel..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Categoria
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>

                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Valor
                <input
                  type="number"
                  name="value"
                  placeholder="120.00"
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

              <div className="expense-form-actions">
                <button
                  className="expense-cancel-button"
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
                  {isSubmitting ? 'Salvando...' : 'Salvar despesa'}
                </button>
              </div>
            </form>
          </article>
        )}

        <section className="expense-grid">
          <article className="expense-card expense-summary-card">
            <div className="expense-card-header">
              <div>
                <p className="section-label">Resumo</p>
                <h2>Indicadores</h2>
              </div>
            </div>

            <div className="expense-summary-list">
              <div>
                <span>Média por despesa</span>
                <strong>{formatCurrency(averageDespesa)}</strong>
              </div>

              <div>
                <span>Maior despesa</span>
                <strong>
                  {biggestDespesa
                    ? formatCurrency(biggestDespesa.value)
                    : formatCurrency(0)}
                </strong>
              </div>

              <div>
                <span>Registros</span>
                <strong>{despesas.length}</strong>
              </div>
            </div>
          </article>

          <article className="expense-card">
            <div className="expense-card-header">
              <div>
                <p className="section-label">Visualização</p>
                <h2>Gastos por categoria</h2>
              </div>
            </div>

            {categoryExpenses.length === 0 ? (
              <p className="expense-empty">Nenhum dado para visualizar.</p>
            ) : (
              <div
                className={`expense-category-list ${
                  categoryExpenses.length > 4 ? 'is-split' : ''
                }`}
              >
                {categoryExpenses.map((item) => (
                  <div className="expense-category-item" key={item.category}>
                    <div className="expense-category-label">
                      <span>{item.category}</span>
                      <strong>{formatCurrency(item.value)}</strong>
                    </div>

                    <div className="expense-category-track">
                      <div
                        style={{
                          width: `${Math.max(
                            (item.value / maxCategoryValue) * 100,
                            8,
                          )}%`,
                        }}
                      />
                    </div>

                    <small>{item.percentage.toFixed(0)}% das despesas</small>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        <article className="expense-card">
          <div className="expense-card-header">
            <div>
              <p className="section-label">Histórico</p>
              <h2>Saídas recentes</h2>
            </div>
          </div>

          {isLoading ? (
            <p className="expense-empty">Carregando despesas...</p>
          ) : sortedDespesas.length === 0 ? (
            <p className="expense-empty">
              Nenhuma despesa cadastrada até o momento.
            </p>
          ) : (
            <div className="expense-history-list">
              {sortedDespesas.map((despesa) => (
                <div className="expense-history-item" key={despesa.id}>
                  <div>
                    <strong>{despesa.description}</strong>
                    <span>
                      {despesa.category} · {formatDate(despesa.date)}
                    </span>
                  </div>

                  <div className="expense-history-value">
                    <strong>{formatCurrency(despesa.value)}</strong>

                    <button
                      type="button"
                      onClick={() => handleDelete(despesa.id)}
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

export default DespesasPage