import { useEffect, useState } from 'react'

function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme) {
    return savedTheme
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  return prefersDark ? 'dark' : 'light'
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
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
      aria-label="Alternar tema"
    >
      <span className="theme-toggle-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>

      <span>{theme === 'light' ? 'Escuro' : 'Claro'}</span>
    </button>
  )
}

export default ThemeToggle