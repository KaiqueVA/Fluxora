function Topbar({ title = 'Dashboard', label = 'Painel financeiro' }) {
  return (
    <header className="platform-topbar">
      <div>
        <p className="section-label">{label}</p>
        <h1>{title}</h1>
      </div>

      <div className="user-pill">
        <span>Usuário</span>
      </div>
    </header>
  )
}

export default Topbar