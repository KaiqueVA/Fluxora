import { useMemo, useState } from 'react'
import PlatformLayout from '../components/platform/PlatformLayout'
import Topbar from '../components/platform/Topbar'

const initialReceipts = [
  {
    id: 1,
    name: 'Mercado Central',
    fileName: 'mercado-central.pdf',
    status: 'Processado',
    type: 'Despesa',
    category: 'Alimentação',
    value: 420,
    date: '2026-05-17',
  },
  {
    id: 2,
    name: 'Salário Maio',
    fileName: 'salario-maio.pdf',
    status: 'Processado',
    type: 'Receita',
    category: 'Receita',
    value: 5200,
    date: '2026-05-15',
  },
  {
    id: 3,
    name: 'Energia elétrica',
    fileName: 'energia-maio.jpg',
    status: 'Pendente',
    type: 'Despesa',
    category: 'Contas fixas',
    value: null,
    date: '2026-05-12',
  },
]

const allowedFileTypes = ['application/pdf', 'image/png', 'image/jpeg']

function formatCurrency(value) {
  if (value === null || value === undefined) {
    return 'Pendente'
  }

  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(date) {
  if (!date) {
    return '-'
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}

function formatFileSize(size) {
  if (!size) {
    return ''
  }

  const sizeInMb = size / 1024 / 1024

  if (sizeInMb >= 1) {
    return `${sizeInMb.toFixed(1)} MB`
  }

  return `${(size / 1024).toFixed(0)} KB`
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

function isAllowedFile(file) {
  return allowedFileTypes.includes(file.type)
}

function ComprovantesPage() {
  const [receipts, setReceipts] = useState(initialReceipts)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadMessage, setUploadMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const sortedReceipts = useMemo(() => {
    return [...receipts].sort((a, b) => {
      return new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`)
    })
  }, [receipts])

  const totalReceipts = receipts.length

  const processedReceipts = receipts.filter((receipt) => {
    return receipt.status === 'Processado'
  }).length

  const pendingReceipts = receipts.filter((receipt) => {
    return receipt.status !== 'Processado'
  }).length

  const processedPercentage =
    totalReceipts > 0 ? (processedReceipts / totalReceipts) * 100 : 0

  const lastReceipt = sortedReceipts[0]

  function handleSelectedFile(file) {
    if (!file) {
      return
    }

    if (!isAllowedFile(file)) {
      setSelectedFile(null)
      setUploadMessage('Formato inválido. Envie um arquivo PDF, PNG ou JPG.')
      return
    }

    setSelectedFile(file)
    setUploadMessage('')
  }

  function handleFileChange(event) {
    const file = event.target.files[0]
    handleSelectedFile(file)
  }

  function handleDragOver(event) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(event) {
    event.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files[0]
    handleSelectedFile(file)
  }

  function handleClearFile() {
    setSelectedFile(null)
    setUploadMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!selectedFile) {
      setUploadMessage('Selecione um arquivo antes de enviar.')
      return
    }

    const newReceipt = {
      id: Date.now(),
      name: selectedFile.name.replace(/\.[^/.]+$/, ''),
      fileName: selectedFile.name,
      status: 'Pendente',
      type: 'Não classificado',
      category: 'Aguardando leitura',
      value: null,
      date: getTodayDate(),
    }

    setReceipts((currentReceipts) => [newReceipt, ...currentReceipts])
    setSelectedFile(null)
    setUploadMessage('Comprovante adicionado ao histórico como pendente.')
  }

  return (
    <PlatformLayout>
      <Topbar
        title="Comprovantes"
        label="Leitura e organização financeira"
      />

      <section className="receipts-page">
        <article className="receipts-hero">
          <div>
            <p className="section-label">Central de comprovantes</p>

            <h2>Organize seus documentos financeiros em um só lugar.</h2>

            <p>
              Envie comprovantes de receitas e despesas para manter um histórico
              mais confiável das suas movimentações. A estrutura já está pronta
              para receber automações futuras de leitura e classificação.
            </p>
          </div>

          <a className="receipts-hero-action" href="#receipt-upload">
            + Novo comprovante
          </a>
        </article>

        <section className="receipts-grid">
          <article className="receipts-card receipts-summary-card">
            <div className="receipts-card-header">
              <div>
                <p className="section-label">Resumo</p>
                <h2>Status dos envios</h2>
              </div>
            </div>

            <div className="receipts-status-main">
              <div className="receipts-status-overview">
                <div>
                  <span>Total enviados</span>
                  <strong>{totalReceipts}</strong>
                </div>

                <span className="receipts-status-pill">
                  {processedPercentage.toFixed(0)}%
                </span>
              </div>

              <div className="receipts-status-progress">
                <div
                  style={{
                    width: `${processedPercentage}%`,
                  }}
                />
              </div>

              <p className="receipts-status-caption">
                {totalReceipts === 0
                  ? 'Nenhum comprovante enviado até o momento.'
                  : `${processedPercentage.toFixed(
                      0,
                    )}% dos comprovantes já foram processados.`}
              </p>
            </div>

            <div className="receipts-status-details">
              <div className="receipts-status-grid">
                <div>
                  <span>Processados</span>
                  <strong>{processedReceipts}</strong>
                </div>

                <div>
                  <span>Pendentes</span>
                  <strong>{pendingReceipts}</strong>
                </div>
              </div>

              <div className="receipts-status-footer">
                <span>Último envio</span>

                <strong>
                  {lastReceipt ? formatDate(lastReceipt.date) : 'Nenhum envio'}
                </strong>
              </div>
            </div>
          </article>

          <article
            className="receipts-card receipts-upload-card"
            id="receipt-upload"
          >
            <div className="receipts-card-header">
              <div>
                <p className="section-label">Upload</p>
                <h2>Enviar arquivo</h2>
              </div>
            </div>

            <form className="receipts-upload-form" onSubmit={handleSubmit}>
              <label
                className={`receipts-upload-zone ${
                  isDragging ? 'is-dragging' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,.pdf"
                  onChange={handleFileChange}
                />

                <span className="receipts-upload-icon">
                  {selectedFile ? '✓' : '↑'}
                </span>

                <strong>
                  {selectedFile
                    ? selectedFile.name
                    : isDragging
                      ? 'Solte o arquivo aqui'
                      : 'Adicionar comprovante'}
                </strong>

                <small>
                  {selectedFile
                    ? `${formatFileSize(selectedFile.size)} · clique para trocar`
                    : 'Arraste um arquivo ou clique para selecionar · PDF, PNG ou JPG'}
                </small>
              </label>

              <div className="receipts-selected-row">
                <div>
                  <span>Arquivo selecionado</span>

                  <strong>
                    {selectedFile
                      ? `${selectedFile.name} · ${formatFileSize(
                          selectedFile.size,
                        )}`
                      : 'Nenhum arquivo selecionado'}
                  </strong>
                </div>
              </div>

              {uploadMessage && (
                <p className="receipts-upload-message">{uploadMessage}</p>
              )}

              <div className="receipts-upload-actions">
                {selectedFile && (
                  <button
                    className="receipts-secondary-button"
                    type="button"
                    onClick={handleClearFile}
                  >
                    Remover arquivo
                  </button>
                )}

                <button className="primary-btn" type="submit">
                  Enviar comprovante
                </button>
              </div>
            </form>
          </article>
        </section>

        <article className="receipts-card">
          <div className="receipts-card-header">
            <div>
              <p className="section-label">Histórico</p>
              <h2>Comprovantes recentes</h2>
            </div>
          </div>

          {sortedReceipts.length === 0 ? (
            <p className="receipts-empty">
              Nenhum comprovante enviado até o momento.
            </p>
          ) : (
            <div className="receipts-history-list">
              {sortedReceipts.map((receipt) => (
                <div className="receipts-history-item" key={receipt.id}>
                  <div className="receipts-file-info">
                    <span className="receipts-file-icon">□</span>

                    <div>
                      <strong>{receipt.name}</strong>
                      <span>
                        {receipt.fileName} · {formatDate(receipt.date)}
                      </span>
                    </div>
                  </div>

                  <div className="receipts-history-meta">
                    <span>{receipt.type}</span>
                    <span>{receipt.category}</span>
                    <strong>{formatCurrency(receipt.value)}</strong>
                  </div>

                  <span
                    className={`receipts-status ${
                      receipt.status === 'Processado'
                        ? 'is-processed'
                        : 'is-pending'
                    }`}
                  >
                    {receipt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </PlatformLayout>
  )
}

export default ComprovantesPage