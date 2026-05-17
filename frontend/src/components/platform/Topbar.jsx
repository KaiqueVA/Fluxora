import ThemeToggle from './ThemeToggle'

function Topbar({ title = 'Dashboard', label = 'Painel financeiro' }) {
  return (
    <header className="platform-topbar">
      <div>
        <p className="section-label">{label}</p>
        <h1>{title}</h1>
      </div>

      <div className="topbar-actions">
        <ThemeToggle />

        <div className="user-pill">
          <span>Usuário</span>
        </div>
      </div>
    </header>
  )
}

export default Topbar