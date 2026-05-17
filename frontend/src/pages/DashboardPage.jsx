import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PlatformLayout from '../components/platform/PlatformLayout'
import Topbar from '../components/platform/Topbar'
import {
  despesasService,
  metasService,
  receitasService,
  saldoService,
} from '../components/services/api'

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

function normalizeApiList(data) {
  if (Array.isArray(data)) {
    return data
  }

  return data?.results || []
}

function normalizeNumber(value) {
  const numberValue = Number(value)

  if (Number.isNaN(numberValue)) {
    return 0
  }

  return numberValue
}

function mapGoalFromApi(goal) {
  return {
    id: goal.id,
    title: goal.name,
    description: goal.description || '',
    targetValue: normalizeNumber(goal.target_value),
    deadline: goal.deadline,
  }
}

function calculateGoalProgress(targetValue, currentBalance) {
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

function DashboardPage() {
  const [receitas, setReceitas] = useState([])
  const [despesas, setDespesas] = useState([])
  const [goals, setGoals] = useState([])
  const [saldoData, setSaldoData] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function loadDashboardData() {
    try {
      setIsLoading(true)
      setError('')

      const [receitasData, despesasData, metasData, saldoResponse] =
        await Promise.all([
          receitasService.list(),
          despesasService.list(),
          metasService.list(),
          saldoService.get(),
        ])

      setReceitas(normalizeApiList(receitasData))
      setDespesas(normalizeApiList(despesasData))
      setGoals(normalizeApiList(metasData).map(mapGoalFromApi))
      setSaldoData(saldoResponse)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const totalReceitas = saldoData
    ? normalizeNumber(saldoData.total_receitas)
    : receitas.reduce((total, receita) => {
        return total + normalizeNumber(receita.value)
      }, 0)

  const totalDespesas = saldoData
    ? normalizeNumber(saldoData.total_despesas)
    : despesas.reduce((total, despesa) => {
        return total + normalizeNumber(despesa.value)
      }, 0)

  const saldoAtual = saldoData
    ? normalizeNumber(saldoData.saldo)
    : totalReceitas - totalDespesas

  const comprometimento =
    totalReceitas > 0 ? (totalDespesas / totalReceitas) * 100 : 0

  const ticketMedio = despesas.length > 0 ? totalDespesas / despesas.length : 0

  const goalsWithProgress = useMemo(() => {
    return goals.map((goal) => {
      const progress = calculateGoalProgress(goal.targetValue, saldoAtual)
      const remainingValue = getRemainingValue(goal.targetValue, saldoAtual)

      return {
        ...goal,
        progress,
        remainingValue,
      }
    })
  }, [goals, saldoAtual])

  const activeGoals = goalsWithProgress.filter((goal) => {
    return goal.progress < 100
  })

  const featuredGoal = useMemo(() => {
    if (activeGoals.length === 0) {
      return goalsWithProgress[0] || null
    }

    return [...activeGoals]
      .filter((goal) => goal.deadline)
      .sort((a, b) => {
        return (
          new Date(`${a.deadline}T00:00:00`) -
          new Date(`${b.deadline}T00:00:00`)
        )
      })[0]
  }, [activeGoals, goalsWithProgress])

  const visibleGoals = goalsWithProgress.slice(0, 2)

  const categoryExpenses = useMemo(() => {
    const groupedExpenses = despesas.reduce((accumulator, despesa) => {
      const category = despesa.category || 'Sem categoria'
      const value = normalizeNumber(despesa.value)

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

  const recentTransactions = useMemo(() => {
    const incomeTransactions = receitas.map((receita) => ({
      id: `receita-${receita.id}`,
      type: 'income',
      description: receita.description,
      category: 'Receita',
      value: normalizeNumber(receita.value),
      date: receita.date,
    }))

    const expenseTransactions = despesas.map((despesa) => ({
      id: `despesa-${despesa.id}`,
      type: 'expense',
      description: despesa.description,
      category: despesa.category,
      value: normalizeNumber(despesa.value),
      date: despesa.date,
    }))

    return [...incomeTransactions, ...expenseTransactions]
      .sort((a, b) => {
        return new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`)
      })
      .slice(0, 5)
  }, [receitas, despesas])

  function getInsightMessage() {
    if (featuredGoal) {
      return `Seu saldo atual cobre ${featuredGoal.progress.toFixed(
        0,
      )}% da sua meta principal: ${featuredGoal.title}.`
    }

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

    return 'Seu saldo está positivo. Continue acompanhando suas movimentações.'
  }

  return (
    <PlatformLayout>
      <Topbar title="Dashboard" label="Visão geral" />

      <section className="clean-dashboard">
        {error && <p className="auth-error">{error}</p>}

        <article className="clean-hero">
          <div>
            <p className="section-label">Insight financeiro</p>
            <h2>{getInsightMessage()}</h2>
          </div>

          <div className="clean-hero-stats">
            <div className="clean-hero-stat">
              <span>Saldo atual</span>
              <strong>{formatCurrency(saldoAtual)}</strong>
            </div>

            <div className="clean-hero-stat">
              <span>Despesas</span>
              <strong className="negative">{formatCurrency(totalDespesas)}</strong>
            </div>

            <div className="clean-hero-stat">
              <span>Meta principal</span>
              <strong>
                {featuredGoal
                  ? `${featuredGoal.progress.toFixed(0)}% concluída`
                  : 'Sem meta'}
              </strong>
            </div>
          </div>
        </article>

        <section className="clean-main-grid">
          <article className="clean-panel clean-goals-panel">
            <div className="clean-panel-header clean-panel-header-row">
              <div>
                <p className="section-label">Metas financeiras</p>
                <h2>Objetivos em andamento</h2>
              </div>

              <Link className="dashboard-goals-link" to="/metas">
                Ver metas
              </Link>
            </div>

            {isLoading ? (
              <p className="clean-empty">Carregando metas...</p>
            ) : goalsWithProgress.length === 0 ? (
              <div className="clean-goals-empty">
                <p>Nenhuma meta cadastrada.</p>
                <span>
                  Crie uma meta para acompanhar seu progresso financeiro.
                </span>

                <Link to="/metas">Criar meta</Link>
              </div>
            ) : (
              <div className="clean-goals-list">
                {visibleGoals.map((goal) => (
                  <article className="clean-goal-item" key={goal.id}>
                    <div className="clean-goal-header">
                      <div>
                        <strong>{goal.title}</strong>

                        <span>
                          {formatCurrency(saldoAtual)} de{' '}
                          {formatCurrency(goal.targetValue)}
                        </span>
                      </div>

                      <strong>{goal.progress.toFixed(0)}%</strong>
                    </div>

                    <div className="clean-goal-bar">
                      <div style={{ width: `${goal.progress}%` }} />
                    </div>

                    <div className="clean-goal-footer">
                      <span>Falta {formatCurrency(goal.remainingValue)}</span>
                      <span>Prazo: {formatDate(goal.deadline)}</span>
                    </div>
                  </article>
                ))}

                <Link className="clean-goals-cta" to="/metas">
                  Ver todas as metas
                </Link>
              </div>
            )}
          </article>

          <article className="clean-panel clean-health-panel">
            <div className="clean-panel-header">
              <div>
                <p className="section-label">Saúde financeira</p>
                <h2>Resumo do período</h2>
              </div>
            </div>

            <div className="clean-metrics">
              <div>
                <span>Receitas</span>
                <strong className="positive">
                  {formatCurrency(totalReceitas)}
                </strong>
              </div>

              <div>
                <span>Despesas</span>
                <strong className="negative">
                  {formatCurrency(totalDespesas)}
                </strong>
              </div>
            </div>

            <div className="clean-commitment">
              <div>
                <span>Comprometimento da renda</span>
                <strong>{comprometimento.toFixed(0)}%</strong>
              </div>

              <div className="clean-meter">
                <div
                  style={{
                    width: `${Math.min(comprometimento, 100)}%`,
                  }}
                />
              </div>

              <p>
                {comprometimento >= 80
                  ? 'Atenção: suas despesas estão consumindo grande parte da renda.'
                  : 'Seu nível de comprometimento está dentro de uma faixa mais controlável.'}
              </p>
            </div>

            <div className="clean-mini-row">
              <div>
                <span>Ticket médio</span>
                <strong>{formatCurrency(ticketMedio)}</strong>
              </div>

              <div>
                <span>Movimentações</span>
                <strong>{receitas.length + despesas.length}</strong>
              </div>
            </div>
          </article>

          <article className="clean-panel clean-categories-panel">
            <div className="clean-panel-header">
              <div>
                <p className="section-label">Categorias</p>
                <h2>Para onde o dinheiro foi?</h2>
              </div>
            </div>

            {categoryExpenses.length === 0 ? (
              <p className="clean-empty">Nenhuma despesa cadastrada.</p>
            ) : (
              <div
                className={`clean-category-list ${
                  categoryExpenses.length > 4 ? 'is-split' : ''
                }`}
              >
                {categoryExpenses.map((item) => (
                  <div className="clean-category-item" key={item.category}>
                    <div className="clean-category-label">
                      <span>{item.category}</span>
                      <strong>{formatCurrency(item.value)}</strong>
                    </div>

                    <div className="clean-bar">
                      <div
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

          <article className="clean-panel clean-history-panel">
            <div className="clean-panel-header">
              <div>
                <p className="section-label">Histórico</p>
                <h2>Últimas movimentações</h2>
              </div>
            </div>

            {isLoading ? (
              <p className="clean-empty">Carregando movimentações...</p>
            ) : recentTransactions.length === 0 ? (
              <p className="clean-empty">Nenhuma movimentação cadastrada.</p>
            ) : (
              <div className="clean-transactions">
                {recentTransactions.map((transaction) => (
                  <div className="clean-transaction" key={transaction.id}>
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