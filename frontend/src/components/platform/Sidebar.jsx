import { NavLink, useNavigate } from 'react-router-dom'

function Sidebar() {
    const navigate = useNavigate()

    function handleLogout() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        navigate('/login')
    }

    return (
        <aside className="platform-sidebar">
            <NavLink className="platform-brand" to="/dashboard">
                <span className="brand-mark">F</span>
                Fluxora
            </NavLink>

            <nav className="platform-nav">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/receitas">Receitas</NavLink>
                <NavLink to="/despesas">Despesas</NavLink>
                <NavLink to="/comprovantes">Comprovantes</NavLink>
            </nav>

            <button className="logout-button" type="button" onClick={handleLogout}>
                Sair
            </button>
        </aside>
    )
}

export default Sidebar