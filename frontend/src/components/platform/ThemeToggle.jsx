import { useEffect, useState } from 'react'

function getInitialTheme() {
  return localStorage.getItem('theme') || 'light'
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === 'light' ? 'dark' : 'light',
    )
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label="Alternar tema"
    >
      <span>{theme === 'light' ? '🌙' : '☀️'}</span>
      {theme === 'light' ? 'Escuro' : 'Claro'}
    </button>
  )
}

export default ThemeToggle