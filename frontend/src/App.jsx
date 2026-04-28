const highlights = [
  {
    value: 'R$ 24.580',
    label: 'Saldo consolidado',
  },
  {
    value: '84%',
    label: 'Receitas organizadas',
  },
  {
    value: '12',
    label: 'Comprovantes processados',
  },
]

const insights = [
  'Identificação automática de entradas e saídas',
  'Visão mensal do fluxo de caixa',
  'Alertas sobre desperdícios e padrões de gasto',
]

function App() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Fluxora</p>
          <h1>Organize seu fluxo financeiro com clareza operacional.</h1>
          <p className="lead">
            Acompanhe comprovantes, renda e movimentações em um painel projetado
            para revelar o que entra, o que sai e onde existe espaço para melhorar.
          </p>

          <div className="action-row">
            <button type="button" className="primary-btn">Explorar painel</button>
            <button type="button" className="secondary-btn">Ver visão geral</button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <span>Resumo financeiro</span>
            <span>Últimos 30 dias</span>
          </div>

          <div className="stats-grid">
            {highlights.map((item) => (
              <article className="stat-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>

          <div className="insight-box">
            <h2>Insights ativos</h2>
            <ul>
              {insights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
