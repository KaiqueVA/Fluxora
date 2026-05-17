import Sidebar from './Sidebar'

function PlatformLayout({ children }) {
  return (
    <main className="platform-layout">
      <Sidebar />

      <section className="platform-content">
        {children}
      </section>
    </main>
  )
}

export default PlatformLayout