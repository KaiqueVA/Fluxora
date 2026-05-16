import PhonePreview from './PhonePreview'

function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Gestão financeira pessoal</p>

        <h1>Transforme comprovantes em clareza financeira</h1>

        <p className="lead">
          O Fluxora organiza pagamentos, fontes de renda e movimentações para
          revelar para onde o dinheiro vai, onde existe desperdício e como
          planejar próximos passos com mais segurança.
        </p>

        <div className="action-row" aria-label="Ações principais">
          <a className="primary-btn" href="#features">
            Conhecer funcionalidades
          </a>
        </div>
      </div>

      <PhonePreview />
    </section>
  )
}

export default HeroSection