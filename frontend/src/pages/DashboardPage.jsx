import { useEffect, useMemo, useState } from 'react'
import PlatformLayout from '../components/platform/PlatformLayout'
import Topbar from '../components/platform/Topbar'
import { receitasService, despesasService } from '../components/services/api'

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

function DashboardPage() {
  const [receitas, setReceitas] = useState([])
  const [despesas, setDespesas] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function loadDashboardData() {
    try {
      setIsLoading(true)
      setError('')

      const [receitasData, despesasData] = await Promise.all([
        receitasService.list(),
        despesasService.list(),
      ])

      setReceitas(
        Array.isArray(receitasData) ? receitasData : receitasData.results || [],
      )

      setDespesas(
        Array.isArray(despesasData) ? despesasData : despesasData.results || [],
      )
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const totalReceitas = receitas.reduce((total, receita) => {
    return total + Number(receita.value || 0)
  }, 0)

  const totalDespesas = despesas.reduce((total, despesa) => {
    return total + Number(despesa.value || 0)
  }, 0)

  const saldoAtual = totalReceitas - totalDespesas

  const comprometimento =
    totalReceitas > 0 ? (totalDespesas / totalReceitas) * 100 : 0

  const ticketMedio =
    despesas.length > 0 ? totalDespesas / despesas.length : 0

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
      .slice(0, 5)
  }, [despesas, totalDespesas])

  const topCategory = categoryExpenses[0]

  const maxCategoryValue = Math.max(
    ...categoryExpenses.map((item) => item.value),
    1,
  )

  const maxComparisonValue = Math.max(totalReceitas, totalDespesas, 1)

  const recentTransactions = useMemo(() => {
    const incomeTransactions = receitas.map((receita) => ({
      id: `receita-${receita.id}`,
      type: 'income',
      description: receita.description,
      category: 'Receita',
      value: Number(receita.value || 0),
      date: receita.date,
    }))

    const expenseTransactions = despesas.map((despesa) => ({
      id: `despesa-${despesa.id}`,
      type: 'expense',
      description: despesa.description,
      category: despesa.category,
      value: Number(despesa.value || 0),
      date: despesa.date,
    }))

    return [...incomeTransactions, ...expenseTransactions]
      .sort((a, b) => {
        return new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`)
      })
      .slice(0, 5)
  }, [receitas, despesas])

  function getInsightMessage() {
    if (receitas.length === 0 && despesas.length === 0) {
      return 'Cadastre receitas e despesas para visualizar sua saúde financeira.'
    }

    if (totalReceitas === 0 && totalDespesas > 0) {
      return 'Você já possui despesas cadastradas, mas ainda não registrou receitas.'
    }

    if (saldoAtual < 0) {
      return `Suas despesas ultrapassaram suas receitas em ${formatCurrency(
        Math.abs(saldoAtual),
      )}.`
    }

    if (comprometimento >= 80) {
      return `Suas despesas comprometem ${comprometimento.toFixed(
        0,
      )}% da renda. Vale revisar os principais gastos.`
    }

    if (topCategory) {
      return `A maior concentração de gastos está em ${
        topCategory.category
      }, representando ${topCategory.percentage.toFixed(0)}% das despesas.`
    }

    return 'Seu saldo está positivo. Continue acompanhando as movimentações.'
  }

  return (
    <PlatformLayout>
      <Topbar title="Dashboard" label="Visão geral" />

      <section className="modern-dashboard">
        {error && <p className="auth-error">{error}</p>}

        <article className="modern-dashboard-hero">
          <div>
            <p className="section-label">Insight financeiro</p>
            <h2>{getInsightMessage()}</h2>
          </div>

          <div className="modern-balance-card">
            <span>Saldo atual</span>
            <strong>{formatCurrency(saldoAtual)}</strong>
          </div>
        </article>

        <section className="modern-kpi-grid">
          <article className="modern-kpi-card">
            <span>Receitas</span>
            <strong>{formatCurrency(totalReceitas)}</strong>
            <p>Entradas registradas</p>
          </article>

          <article className="modern-kpi-card">
            <span>Despesas</span>
            <strong>{formatCurrency(totalDespesas)}</strong>
            <p>Saídas registradas</p>
          </article>

          <article className="modern-kpi-card">
            <span>Comprometimento</span>
            <strong>{comprometimento.toFixed(0)}%</strong>
            <p>Da renda utilizada</p>
          </article>

          <article className="modern-kpi-card">
            <span>Ticket médio</span>
            <strong>{formatCurrency(ticketMedio)}</strong>
            <p>Por despesa</p>
          </article>
        </section>

        <section className="modern-dashboard-grid">
          <article className="modern-panel">
            <div className="modern-panel-header">
              <div>
                <p className="section-label">Comparativo</p>
                <h2>Receitas x despesas</h2>
              </div>
            </div>

            {isLoading ? (
              <p className="modern-empty">Carregando dados...</p>
            ) : (
              <div className="modern-bars">
                <div className="modern-bar-item">
                  <div className="modern-bar-label">
                    <span>Receitas</span>
                    <strong>{formatCurrency(totalReceitas)}</strong>
                  </div>

                  <div className="modern-bar-track">
                    <div
                      className="modern-bar-fill income"
                      style={{
                        width: `${Math.max(
                          (totalReceitas / maxComparisonValue) * 100,
                          6,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="modern-bar-item">
                  <div className="modern-bar-label">
                    <span>Despesas</span>
                    <strong>{formatCurrency(totalDespesas)}</strong>
                  </div>

                  <div className="modern-bar-track">
                    <div
                      className="modern-bar-fill expense"
                      style={{
                        width: `${Math.max(
                          (totalDespesas / maxComparisonValue) * 100,
                          6,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </article>

          <article className="modern-panel">
            <div className="modern-panel-header">
              <div>
                <p className="section-label">Categorias</p>
                <h2>Para onde o dinheiro foi?</h2>
              </div>
            </div>

            {categoryExpenses.length === 0 ? (
              <p className="modern-empty">Nenhuma despesa cadastrada.</p>
            ) : (
              <div className="modern-bars">
                {categoryExpenses.map((item) => (
                  <div className="modern-bar-item" key={item.category}>
                    <div className="modern-bar-label">
                      <span>{item.category}</span>
                      <strong>{formatCurrency(item.value)}</strong>
                    </div>

                    <div className="modern-bar-track">
                      <div
                        className="modern-bar-fill category"
                        style={{
                          width: `${Math.max(
                            (item.value / maxCategoryValue) * 100,
                            6,
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

        <section className="modern-dashboard-grid bottom">
          <article className="modern-panel compact">
            <div className="modern-panel-header">
              <div>
                <p className="section-label">Maior gasto</p>
                <h2>Categoria destaque</h2>
              </div>
            </div>

            {topCategory ? (
              <div className="modern-highlight">
                <strong>{topCategory.category}</strong>
                <span>{formatCurrency(topCategory.value)}</span>
                <p>{topCategory.percentage.toFixed(0)}% das despesas totais</p>
              </div>
            ) : (
              <p className="modern-empty">Nenhuma categoria encontrada.</p>
            )}
          </article>

          <article className="modern-panel">
            <div className="modern-panel-header">
              <div>
                <p className="section-label">Histórico</p>
                <h2>Últimas movimentações</h2>
              </div>
            </div>

            {isLoading ? (
              <p className="modern-empty">Carregando movimentações...</p>
            ) : recentTransactions.length === 0 ? (
              <p className="modern-empty">
                Nenhuma movimentação cadastrada.
              </p>
            ) : (
              <div className="modern-transaction-list">
                {recentTransactions.map((transaction) => (
                  <div className="modern-transaction" key={transaction.id}>
                    <div>
                      <strong>{transaction.description}</strong>
                      <span>
                        {transaction.category} · {formatDate(transaction.date)}
                      </span>
                    </div>

                    <strong
                      className={
                        transaction.type === 'income' ? 'positive' : 'negative'
                      }
                    >
                      {transaction.type === 'income' ? '+' : '-'}{' '}
                      {formatCurrency(transaction.value)}
                    </strong>
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

export default DashboardPage