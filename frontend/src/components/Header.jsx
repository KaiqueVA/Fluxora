function Header() {
  return (
    <header className="site-header" aria-label="Navegação principal">
      <a className="brand" href="#top" aria-label="Fluxora">
        <span className="brand-mark">F</span>
        Fluxora
      </a>

      <nav className="site-nav">
        <a href="#purpose">Propósito</a>
        <a href="#features">Funcionalidades</a>
      </nav>
    </header>
  )
}

export default Header