import { featureCards } from '../data/landingContent'

function FeaturesSection() {
  return (
    <section className="features-section" id="features">
      <div className="section-heading">
        <p className="section-label">Funcionalidades</p>
        <h2>O que você acompanha dentro da plataforma.</h2>
      </div>

      <div className="feature-grid">
        {featureCards.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection