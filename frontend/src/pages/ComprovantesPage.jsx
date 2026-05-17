import { useState } from 'react'
import PlatformLayout from '../components/platform/PlatformLayout'
import Topbar from '../components/platform/Topbar'

const initialReceipts = [
  {
    id: 1,
    name: 'Mercado Central',
    status: 'Processado',
    category: 'Alimentação',
    value: 'R$ 420,00',
  },
  {
    id: 2,
    name: 'Farmácia Vida',
    status: 'Pendente',
    category: 'Saúde',
    value: 'R$ 86,50',
  },
]

function ComprovantesPage() {
  const [receipts, setReceipts] = useState(initialReceipts)
  const [selectedFileName, setSelectedFileName] = useState('')

  function handleFileChange(event) {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    setSelectedFileName(file.name)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!selectedFileName) {
      return
    }

    const newReceipt = {
      id: Date.now(),
      name: selectedFileName,
      status: 'Aguardando leitura',
      category: 'Não classificado',
      value: 'Pendente',
    }

    setReceipts((currentReceipts) => [newReceipt, ...currentReceipts])
    setSelectedFileName('')
  }

  return (
    <PlatformLayout>
      <Topbar title="Comprovantes" label="Leitura e organização" />

      <section className="platform-page-grid">
        <article className="dashboard-panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Novo comprovante</p>
              <h2>Enviar arquivo</h2>
            </div>
          </div>

          <form className="platform-form" onSubmit={handleSubmit}>
            <label>
              Arquivo
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
            </label>

            {selectedFileName && (
              <p className="panel-description">
                Arquivo selecionado: <strong>{selectedFileName}</strong>
              </p>
            )}

            <button className="primary-btn" type="submit">
              Enviar comprovante
            </button>
          </form>
        </article>

        <article className="dashboard-panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Automação</p>
              <h2>Processamento futuro</h2>
            </div>
          </div>

          <p className="panel-description">
            Esta área será usada para enviar comprovantes e processar dados como
            estabelecimento, valor, categoria e data da compra.
          </p>
        </article>
      </section>

      <section className="dashboard-panel platform-table-panel">
        <div className="panel-header">
          <div>
            <p className="section-label">Histórico</p>
            <h2>Comprovantes enviados</h2>
          </div>
        </div>

        <div className="platform-table">
          <div className="platform-table-header">
            <span>Nome</span>
            <span>Status</span>
            <span>Categoria</span>
            <span>Valor</span>
          </div>

          {receipts.map((receipt) => (
            <div className="platform-table-row" key={receipt.id}>
              <span>{receipt.name}</span>
              <span>{receipt.status}</span>
              <span>{receipt.category}</span>
              <strong>{receipt.value}</strong>
            </div>
          ))}
        </div>
      </section>
    </PlatformLayout>
  )
}

export default ComprovantesPage