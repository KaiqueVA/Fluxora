function PhonePreview() {
  return (
    <div className="product-visual" aria-label="Prévia do painel Fluxora">
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
  )
}

export default PhonePreview