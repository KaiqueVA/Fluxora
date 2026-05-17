import ThemeToggle from './ThemeToggle'

function Topbar({ title = 'Dashboard', label = 'Visão geral' }) {
  function handleOpenMenu() {
    window.dispatchEvent(new Event('open-platform-menu'))
  }

  return (
    <header className="platform-topbar">
      <div className="topbar-heading-group">
        <button
          className="mobile-menu-button"
          type="button"
          aria-label="Abrir menu"
          onClick={handleOpenMenu}
        >
          ☰
        </button>

        <div className="topbar-heading">
          <p className="section-label">{label}</p>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="topbar-actions">
        <ThemeToggle />

        <div className="user-pill">
          <span className="user-avatar">U</span>
          <span>Usuário</span>
        </div>
      </div>
    </header>
  )
}

export default Topbar