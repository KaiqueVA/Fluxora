import { useEffect, useMemo, useState } from 'react'
import PlatformLayout from '../components/platform/PlatformLayout'
import Topbar from '../components/platform/Topbar'
import { despesasService } from '../components/services/api'

function formatCurrency(value) {
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

const expenseCategories = [
    'Alimentação',
    'Moradia',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Assinaturas',
    'Compras',
    'Contas fixas',
    'Outros',
]

function DespesasPage() {
    const [despesas, setDespesas] = useState([])

    const [formData, setFormData] = useState({
        description: '',
        category: '',
        value: '',
        date: '',
    })

    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)

    async function loadDespesas() {
        try {
            setIsLoading(true)
            setError('')

            const data = await despesasService.list()
            const despesasData = Array.isArray(data) ? data : data.results || []

            setDespesas(despesasData)
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadDespesas()
    }, [])

    function handleChange(event) {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setIsSubmitting(true)
            setError('')

            await despesasService.create({
                description: formData.description,
                category: formData.category,
                value: formData.value,
                date: formData.date,
            })

            setFormData({
                description: '',
                category: '',
                value: '',
                date: '',
            })

            setIsFormOpen(false)
            await loadDespesas()
        } catch (error) {
            setError(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDelete(id) {
        try {
            setError('')
            await despesasService.remove(id)
            await loadDespesas()
        } catch (error) {
            setError(error.message)
        }
    }

    const totalDespesas = despesas.reduce((total, despesa) => {
        return total + Number(despesa.value || 0)
    }, 0)

    const averageDespesa =
        despesas.length > 0 ? totalDespesas / despesas.length : 0

    const categoryExpenses = useMemo(() => {
        const groupedExpenses = despesas.reduce((accumulator, despesa) => {
            const category = despesa.category || 'Sem categoria'
            const value = Number(despesa.value || 0)

            accumulator[category] = (accumulator[category] || 0) + value

            return accumulator
        }, {})

        return Object.entries(groupedExpenses).map(([category, value]) => ({
            category,
            value,
        }))
    }, [despesas])

    const maxCategoryValue = Math.max(
        ...categoryExpenses.map((item) => item.value),
        1,
    )

    return (
        <PlatformLayout>
            <Topbar title="Despesas" label="Saídas financeiras" />

            <section className="revenue-page">
                <section className="revenue-overview">
                    <article className="revenue-kpi expense-primary">
                        <span>Total gasto</span>
                        <strong>{formatCurrency(totalDespesas)}</strong>
                        <p>Soma das saídas cadastradas.</p>
                    </article>

                    <article className="revenue-kpi">
                        <span>Despesas</span>
                        <strong>{despesas.length}</strong>
                        <p>Registros encontrados.</p>
                    </article>

                    <article className="revenue-kpi">
                        <span>Média por despesa</span>
                        <strong>{formatCurrency(averageDespesa)}</strong>
                        <p>Valor médio das saídas.</p>
                    </article>
                </section>

                <section className="revenue-actions-card">
                    <div className="revenue-actions-header">
                        <div>
                            <p className="section-label">Cadastro</p>
                            <h2>Nova despesa</h2>
                        </div>

                        <button
                            className="secondary-action-button"
                            type="button"
                            onClick={() => setIsFormOpen((currentValue) => !currentValue)}
                        >
                            {isFormOpen ? 'Fechar' : 'Adicionar despesa'}
                        </button>
                    </div>

                    {isFormOpen && (
                        <form className="revenue-form expense-form compact" onSubmit={handleSubmit}>
                            <label>
                                Descrição
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Ex: Mercado, energia..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Categoria
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione uma categoria</option>

                                    {expenseCategories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Valor
                                <input
                                    type="number"
                                    name="value"
                                    placeholder="120.00"
                                    value={formData.value}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </label>

                            <label>
                                Data
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            {error && <p className="auth-error">{error}</p>}

                            <button
                                className="primary-btn"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Salvando...' : 'Salvar'}
                            </button>
                        </form>
                    )}

                    {!isFormOpen && error && <p className="auth-error">{error}</p>}
                </section>

                <section className="revenue-content-grid">
                    <article className="revenue-card revenue-chart-card">
                        <div className="revenue-card-header">
                            <div>
                                <p className="section-label">Visualização</p>
                                <h2>Despesas por categoria</h2>
                            </div>
                        </div>

                        {categoryExpenses.length === 0 ? (
                            <p className="revenue-empty">Nenhum dado para visualizar.</p>
                        ) : (
                            <div className="revenue-chart">
                                {categoryExpenses.map((item) => (
                                    <div className="revenue-chart-item" key={item.category}>
                                        <div className="revenue-chart-label">
                                            <span>{item.category}</span>
                                            <strong>{formatCurrency(item.value)}</strong>
                                        </div>

                                        <div className="revenue-chart-track">
                                            <div
                                                className="revenue-chart-fill expense-fill"
                                                style={{
                                                    width: `${Math.max(
                                                        (item.value / maxCategoryValue) * 100,
                                                        8,
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </article>

                    <article className="revenue-card revenue-list-card">
                        <div className="revenue-card-header">
                            <div>
                                <p className="section-label">Histórico</p>
                                <h2>Despesas cadastradas</h2>
                            </div>
                        </div>

                        {isLoading ? (
                            <p className="revenue-empty">Carregando despesas...</p>
                        ) : despesas.length === 0 ? (
                            <p className="revenue-empty">
                                Nenhuma despesa cadastrada até o momento.
                            </p>
                        ) : (
                            <div className="revenue-list">
                                {despesas.map((despesa) => (
                                    <div className="revenue-list-item" key={despesa.id}>
                                        <div>
                                            <strong>{despesa.description}</strong>
                                            <span>
                                                {despesa.category} · {formatDate(despesa.date)}
                                            </span>
                                        </div>

                                        <div className="revenue-list-value">
                                            <strong className="negative">
                                                {formatCurrency(despesa.value)}
                                            </strong>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(despesa.id)}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </article>
                </section>
            </section>
        </PlatformLayout>
    )
}

export default DespesasPage