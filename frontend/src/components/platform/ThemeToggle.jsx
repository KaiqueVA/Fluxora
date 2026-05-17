import { useLayoutEffect, useState } from 'react'

function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return 'dark'
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function handleToggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={handleToggleTheme}
      aria-label={
        theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'
      }
      title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
    >
      <span className="theme-toggle-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <span className="theme-toggle-label">
        {theme === 'light' ? 'Escuro' : 'Claro'}
      </span>
    </button>
  )
}

export default ThemeToggle