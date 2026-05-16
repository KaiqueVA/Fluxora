const featureCards = [
  {
    title: 'Comprovantes organizados',
    text: 'Envie fotos, PDFs ou scans para transformar registros soltos em informações financeiras estruturadas.',
  },
  {
    title: 'Renda e entradas',
    text: 'Cadastre salário, serviços, renda extra e ganhos recorrentes para alimentar o fluxo de caixa.',
  },
  {
    title: 'Dashboard financeiro',
    text: 'Veja saldo mensal, categorias de gasto, histórico, recorrências e pontos de desperdício.',
  },
  {
    title: 'Recomendações',
    text: 'Receba sugestões para reserva de emergência, redução de gastos e caminhos de investimento.',
  },
]

const steps = [
  'Importe comprovantes',
  'Registre fontes de renda',
  'Acompanhe entradas e saídas',
  'Receba insights para decidir melhor',
]

const metrics = [
  {
    value: '4',
    label: 'módulos principais',
  },
  {
    value: '30d',
    label: 'visão mensal',
  },
  {
    value: '24h',
    label: 'acesso ao histórico',
  },
]

function App() {
  return (
    <main className="landing-page">
      <header className="site-header" aria-label="Navegação principal">
        <a className="brand" href="#top" aria-label="Fluxora">
          <span className="brand-mark">F</span>
          Fluxora
        </a>
        <nav className="site-nav">
          <a href="#purpose">Propósito</a>
          <a href="#features">Funcionalidades</a>
          <a href="#access">Acesso</a>
        </nav>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Gestão financeira pessoal</p>
          <h1>Transforme comprovantes em clareza financeira</h1>
          <p className="lead">
            O Fluxora organiza pagamentos, fontes de renda e movimentações para
            revelar para onde o dinheiro vai, onde existe desperdício e como
            planejar próximos passos com mais segurança
          </p>

          <div className="action-row" aria-label="Ações principais">
            <a className="primary-btn" href="/Fluxora.apk" download>
              Baixar APK
            </a>
            <a className="secondary-btn" href="#access">
              Acessar homepage
            </a>
          </div>
        </div>

        <div className="product-visual" aria-label="Previa do painel Fluxora">
          <div className="phone-frame">
            <div className="phone-topbar">
              <span>Fluxora</span>
              <span>Maio</span>
            </div>
            <div className="balance-panel">
              <span>Saldo projetado</span>
              <strong>R$ 24.580</strong>
              <div className="balance-line" />
            </div>
            <div className="cashflow-grid">
              <div>
                <span>Entradas</span>
                <strong>R$ 8.420</strong>
              </div>
              <div>
              <span>Saídas</span>
                <strong>R$ 5.730</strong>
              </div>
            </div>
            <div className="receipt-card">
              <span>Comprovante lido</span>
              <strong>Mercado Central</strong>
              <p>Categoria sugerida: alimentação</p>
            </div>
            <div className="chart-bars" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className="purpose-section" id="purpose">
        <div>
          <p className="section-label">Propósito da solução</p>
          <h2>Menos planilhas manuais. Mais entendimento sobre o dinheiro.</h2>
        </div>
        <p>
          A proposta do Fluxora é centralizar dados financeiros dispersos,
          automatizar a leitura de comprovantes e entregar uma visão simples
          sobre fluxo de caixa, gastos recorrentes, oportunidades de economia e
          possibilidades de investimento.
        </p>
      </section>

      <section className="workflow-section" aria-label="Como funciona">
        {steps.map((step, index) => (
          <article className="step-card" key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{step}</h3>
          </article>
        ))}
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <p className="section-label">Funcionalidades</p>
          <h2>Recursos pensados para organizar, analisar e orientar.</h2>
        </div>

        <div className="feature-grid">
          {featureCards.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="insight-section">
        <div className="insight-copy">
          <p className="section-label">Estudo de investimentos</p>
          <h2>Do controle financeiro ao planejamento do futuro.</h2>
          <p>
            Com base no perfil e nos dados organizados, o sistema pode apoiar
            estudos sobre reserva de emergência, CDB, poupança, ações e
            previdência privada, sempre considerando risco, rentabilidade e
            realidade financeira do usuário.
          </p>
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

      <section className="access-section" id="access">
        <div>
          <p className="section-label">Acesse a solucao</p>
          <h2>Escolha como quer conhecer o Fluxora.</h2>
          <p>
            Baixe o aplicativo Android quando o APK estiver publicado ou use a
            homepage do sistema para acessar os recursos web apresentados pela
            equipe.
          </p>
        </div>
        <div className="access-actions">
          <a className="primary-btn" href="/Fluxora.apk" download>
            Baixar APK
          </a>
          <a className="secondary-btn" href="/home">
            Entrar na homepage
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
