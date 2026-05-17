import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

function applyInitialTheme() {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', savedTheme)
    return
  }

  document.documentElement.setAttribute('data-theme', 'dark')
  localStorage.setItem('theme', 'dark')
}

applyInitialTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)