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

  const ticketMedioDespesa =
    despesas.length > 0 ? totalDespesas / despesas.length : 0

  const categoryExpenses = useMemo(() => {
    const grouped = despesas.reduce((accumulator, despesa) => {
      const category = despesa.category || 'Sem categoria'
      const value = Number(despesa.value || 0)

      accumulator[category] = (accumulator[category] || 0) + value

      return accumulator
    }, {})

    return Object.entries(grouped)
      .map(([category, value]) => ({
        category,
        value,
        percentage: totalDespesas > 0 ? (value / totalDespesas) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
  }, [despesas, totalDespesas])

  const topCategory = categoryExpenses[0]

  const maxCategoryValue = Math.max(
    ...categoryExpenses.map((item) => item.value),
    1,
  )

  const maxComparisonValue = Math.max(totalReceitas, totalDespesas, 1)

  const recentTransactions = useMemo(() => {
    const receitasFormatadas = receitas.map((receita) => ({
      id: `receita-${receita.id}`,
      type: 'receita',
      description: receita.description,
      category: 'Receita',
      value: Number(receita.value || 0),
      date: receita.date,
    }))

    const despesasFormatadas = despesas.map((despesa) => ({
      id: `despesa-${despesa.id}`,
      type: 'despesa',
      description: despesa.description,
      category: despesa.category,
      value: Number(despesa.value || 0),
      date: despesa.date,
    }))

    return [...receitasFormatadas, ...despesasFormatadas]
      .sort((a, b) => {
        return new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`)
      })
      .slice(0, 6)
  }, [receitas, despesas])

  function getInsightMessage() {
    if (receitas.length === 0 && despesas.length === 0) {
      return 'Cadastre receitas e despesas para receber uma análise financeira personalizada.'
    }

    if (totalReceitas === 0 && totalDespesas > 0) {
      return 'Você possui despesas cadastradas, mas nenhuma receita registrada. Cadastre suas entradas para acompanhar seu saldo real.'
    }

    if (saldoAtual < 0) {
      return `Suas despesas ultrapassaram suas receitas em ${formatCurrency(
        Math.abs(saldoAtual),
      )}. Vale revisar os gastos mais relevantes.`
    }

    if (comprometimento >= 80) {
      return `Suas despesas comprometem ${comprometimento.toFixed(
        0,
      )}% da renda. Esse nível exige atenção para evitar perda de controle financeiro.`
    }

    if (topCategory) {
      return `A maior concentração de gastos está em ${
        topCategory.category
      }, representando ${topCategory.percentage.toFixed(0)}% das despesas.`
    }

    return 'Seu saldo está positivo. Continue acompanhando as movimentações para manter previsibilidade financeira.'
  }

  return (
    <PlatformLayout>
      <Topbar title="Dashboard" label="Visão geral" />

      <section className="analytics-dashboard">
        {error && <p className="auth-error">{error}</p>}

        <section className="analytics-hero-card">
          <div>
            <p className="section-label">Análise financeira</p>
            <h2>{getInsightMessage()}</h2>
          </div>

          <div className="analytics-hero-value">
            <span>Saldo atual</span>
            <strong>{formatCurrency(saldoAtual)}</strong>
          </div>
        </section>

        <section className="analytics-kpi-grid">
          <article className="analytics-kpi">
            <span>Receitas</span>
            <strong>{formatCurrency(totalReceitas)}</strong>
            <p>Total de entradas registradas.</p>
          </article>

          <article className="analytics-kpi">
            <span>Despesas</span>
            <strong>{formatCurrency(totalDespesas)}</strong>
            <p>Total de saídas registradas.</p>
          </article>

          <article className="analytics-kpi">
            <span>Comprometimento</span>
            <strong>{comprometimento.toFixed(0)}%</strong>
            <p>Percentual da renda usado em despesas.</p>
          </article>

          <article className="analytics-kpi">
            <span>Ticket médio</span>
            <strong>{formatCurrency(ticketMedioDespesa)}</strong>
            <p>Valor médio por despesa cadastrada.</p>
          </article>
        </section>

        <section className="analytics-grid">
          <article className="analytics-card">
            <div className="analytics-card-header">
              <div>
                <p className="section-label">Comparativo</p>
                <h2>Receitas x despesas</h2>
              </div>
            </div>

            {isLoading ? (
              <p className="analytics-empty">Carregando dados...</p>
            ) : (
              <div className="analytics-bars">
                <div className="analytics-bar-item">
                  <div className="analytics-bar-label">
                    <span>Receitas</span>
                    <strong>{formatCurrency(totalReceitas)}</strong>
                  </div>

                  <div className="analytics-track">
                    <div
                      className="analytics-fill income"
                      style={{
                        width: `${Math.max(
                          (totalReceitas / maxComparisonValue) * 100,
                          6,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="analytics-bar-item">
                  <div className="analytics-bar-label">
                    <span>Despesas</span>
                    <strong>{formatCurrency(totalDespesas)}</strong>
                  </div>

                  <div className="analytics-track">
                    <div
                      className="analytics-fill expense"
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

          <article className="analytics-card">
            <div className="analytics-card-header">
              <div>
                <p className="section-label">Categorias</p>
                <h2>Para onde o dinheiro foi?</h2>
              </div>
            </div>

            {categoryExpenses.length === 0 ? (
              <p className="analytics-empty">Nenhuma despesa cadastrada.</p>
            ) : (
              <div className="analytics-bars">
                {categoryExpenses.map((item) => (
                  <div className="analytics-bar-item" key={item.category}>
                    <div className="analytics-bar-label">
                      <span>{item.category}</span>
                      <strong>{formatCurrency(item.value)}</strong>
                    </div>

                    <div className="analytics-track">
                      <div
                        className="analytics-fill category"
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

        <section className="analytics-grid bottom">
          <article className="analytics-card">
            <div className="analytics-card-header">
              <div>
                <p className="section-label">Destaque</p>
                <h2>Maior categoria de gasto</h2>
              </div>
            </div>

            {topCategory ? (
              <div className="analytics-highlight">
                <strong>{topCategory.category}</strong>
                <span>{formatCurrency(topCategory.value)}</span>
                <p>
                  Essa categoria representa {topCategory.percentage.toFixed(0)}%
                  das despesas cadastradas.
                </p>
              </div>
            ) : (
              <p className="analytics-empty">Nenhuma categoria encontrada.</p>
            )}
          </article>

          <article className="analytics-card">
            <div className="analytics-card-header">
              <div>
                <p className="section-label">Atividade recente</p>
                <h2>Últimas movimentações</h2>
              </div>
            </div>

            {isLoading ? (
              <p className="analytics-empty">Carregando movimentações...</p>
            ) : recentTransactions.length === 0 ? (
              <p className="analytics-empty">
                Nenhuma movimentação cadastrada.
              </p>
            ) : (
              <div className="analytics-transactions">
                {recentTransactions.map((transaction) => (
                  <div className="analytics-transaction" key={transaction.id}>
                    <div>
                      <strong>{transaction.description}</strong>
                      <span>
                        {transaction.category} · {formatDate(transaction.date)}
                      </span>
                    </div>

                    <strong
                      className={
                        transaction.type === 'receita' ? 'positive' : 'negative'
                      }
                    >
                      {transaction.type === 'receita' ? '+' : '-'}{' '}
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