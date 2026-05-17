import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: '▦',
  },
  {
    path: '/receitas',
    label: 'Receitas',
    icon: '+',
  },
  {
    path: '/despesas',
    label: 'Despesas',
    icon: '−',
  },
  {
    path: '/comprovantes',
    label: 'Comprovantes',
    icon: '◈',
  },
]

function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')

    navigate('/login')
  }

  return (
    <aside className="platform-sidebar">
      <NavLink className="platform-brand" to="/dashboard">
        <span className="brand-mark">F</span>

        <div>
          <strong>Fluxora</strong>
          <small>Finance Platform</small>
        </div>
      </NavLink>

      <nav className="platform-nav" aria-label="Navegação principal">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span></span>
          <p>Sessão ativa</p>
        </div>

        <button className="logout-button" type="button" onClick={handleLogout}>
          Sair da plataforma
        </button>
      </div>
    </aside>
  )
}

export default Sidebar