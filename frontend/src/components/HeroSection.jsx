import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Gestão financeira pessoal</p>

        <h1>Transforme dados financeiros em decisões mais claras</h1>

        <p className="lead">
          O Fluxora centraliza receitas, despesas e movimentações em uma
          plataforma visual para acompanhar seu fluxo financeiro, identificar
          padrões de gastos e tomar decisões com mais segurança.
        </p>

        <div className="action-row" aria-label="Ações principais">
          <Link className="primary-btn" to="/login">
            Acessar a plataforma
          </Link>
        </div>
      </div>

      <div className="product-visual" aria-label="Prévia visual da plataforma Fluxora">
        <div className="platform-preview">
          <div className="preview-topbar">
            <div className="preview-brand">
              <span>F</span>

              <div>
                <strong>Fluxora</strong>
                <small>Dashboard financeiro</small>
              </div>
            </div>

            <span className="preview-status">Online</span>
          </div>

          <div className="preview-insight-card">
            <div>
              <span>Insight financeiro</span>
              <strong>Alimentação concentra 38% das despesas.</strong>
            </div>

            <div>
              <span>Saldo atual</span>
              <strong>R$ 2.450</strong>
            </div>
          </div>

          <div className="preview-kpi-row">
            <div>
              <span>Receitas</span>
              <strong>R$ 5.200</strong>
            </div>

            <div>
              <span>Despesas</span>
              <strong>R$ 2.750</strong>
            </div>
          </div>

          <div className="preview-content-grid">
            <div className="preview-panel">
              <div className="preview-panel-header">
                <span>Saúde financeira</span>
                <strong>53%</strong>
              </div>

              <div className="preview-meter">
                <div style={{ width: '53%' }} />
              </div>

              <p>Comprometimento da renda</p>
            </div>

            <div className="preview-panel">
              <div className="preview-category-item">
                <div>
                  <span>Alimentação</span>
                  <strong>R$ 820</strong>
                </div>

                <div className="preview-bar">
                  <div style={{ width: '82%' }} />
                </div>
              </div>

              <div className="preview-category-item">
                <div>
                  <span>Moradia</span>
                  <strong>R$ 530</strong>
                </div>

                <div className="preview-bar">
                  <div style={{ width: '58%' }} />
                </div>
              </div>

              <div className="preview-category-item">
                <div>
                  <span>Transporte</span>
                  <strong>R$ 260</strong>
                </div>

                <div className="preview-bar">
                  <div style={{ width: '34%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="preview-transactions">
            <div>
              <span>Salário mensal</span>
              <strong className="preview-positive">+ R$ 5.200</strong>
            </div>

            <div>
              <span>Mercado</span>
              <strong className="preview-negative">- R$ 420</strong>
            </div>

            <div>
              <span>Energia</span>
              <strong className="preview-negative">- R$ 180</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection