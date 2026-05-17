function PurposeSection() {
  return (
    <section className="purpose-section" id="purpose">
      <div className="purpose-copy">
        <p className="section-label">Propósito da solução</p>

        <h2>Menos dados soltos. Mais visão sobre o dinheiro.</h2>

        <p>
          O Fluxora foi pensado para transformar registros financeiros
          dispersos em uma visão simples, visual e mais fácil de acompanhar no
          dia a dia.
        </p>
      </div>

      <div className="comparison-grid" aria-label="Antes e depois do Fluxora">
        <article className="comparison-card is-before">
          <span>Antes</span>
          <h3>Controle fragmentado</h3>

          <ul>
            <li>Receitas e despesas espalhadas</li>
            <li>Difícil perceber padrões de gasto</li>
            <li>Pouca clareza sobre o saldo real</li>
          </ul>
        </article>

        <article className="comparison-card is-after">
          <span>Depois</span>
          <h3>Visão centralizada</h3>

          <ul>
            <li>Dashboard financeiro em tempo real</li>
            <li>Categorias e histórico organizados</li>
            <li>Insights para decisões mais claras</li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default PurposeSection