import { metrics } from '../data/landingContent'

function InsightSection() {
  return (
    <section className="insight-section">
      <div className="insight-copy">
        <p className="section-label">Análise financeira</p>

        <h2>O que a plataforma revela sobre seus hábitos.</h2>

        <p>
          Além de registrar movimentações, o Fluxora ajuda a enxergar padrões,
          acompanhar comprometimento da renda e transformar dados em decisões
          mais conscientes.
        </p>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <div className="metric-card-header">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>

            <div className="metric-bar">
              <div style={{ width: `${metric.progress}%` }} />
            </div>

            <p>{metric.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default InsightSection