import { metrics } from '../data/landingContent'

function InsightSection() {
  return (
    <section className="insight-section">
      <div className="insight-copy">
        <p className="section-label">Estudo de investimentos</p>
        <h2>Do controle financeiro ao planejamento do futuro.</h2>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default InsightSection