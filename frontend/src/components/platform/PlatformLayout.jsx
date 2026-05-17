import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'

function PlatformLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    function handleOpenSidebar() {
      setIsSidebarOpen(true)
    }

    window.addEventListener('open-platform-menu', handleOpenSidebar)

    return () => {
      window.removeEventListener('open-platform-menu', handleOpenSidebar)
    }
  }, [])

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    function handleResize() {
      if (window.innerWidth > 980) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', handleResize)

    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', handleResize)
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  return (
    <main className={`platform-layout ${isSidebarOpen ? 'is-sidebar-open' : ''}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <button
        className="platform-overlay"
        type="button"
        aria-label="Fechar menu"
        onClick={() => setIsSidebarOpen(false)}
      />

      <section className="platform-content">{children}</section>
    </main>
  )
}

export default PlatformLayout