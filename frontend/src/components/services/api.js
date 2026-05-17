const API_BASE_URL = 'http://localhost:8000/api'

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken')

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

function clearAuthStorage() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userId')
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const errorMessage =
      data?.detail ||
      data?.email?.[0] ||
      data?.password?.[0] ||
      data?.confirm_password?.[0] ||
      data?.description?.[0] ||
      data?.category?.[0] ||
      data?.value?.[0] ||
      data?.date?.[0] ||
      data?.non_field_errors?.[0] ||
      'Erro ao processar a requisição.'

    throw new Error(errorMessage)
  }

  return data
}

export const authService = {
  login(credentials) {
    return request('/users/login/', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })
  },

  register(userData) {
    return request('/users/register/', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirm_password,
      }),
    })
  },

  logout() {
    clearAuthStorage()
  },
}

export const receitasService = {
  list() {
    return request('/receitas/receitas/')
  },

  create(receita) {
    return request('/receitas/receitas/', {
      method: 'POST',
      body: JSON.stringify({
        description: receita.description,
        value: receita.value,
        date: receita.date,
      }),
    })
  },

  remove(id) {
    return request(`/receitas/receitas/${id}/`, {
      method: 'DELETE',
    })
  },
}

export const despesasService = {
  list() {
    return request('/despesas/despesas/')
  },

  create(despesa) {
    return request('/despesas/despesas/', {
      method: 'POST',
      body: JSON.stringify({
        description: despesa.description,
        category: despesa.category,
        value: despesa.value,
        date: despesa.date,
      }),
    })
  },

  remove(id) {
    return request(`/despesas/despesas/${id}/`, {
      method: 'DELETE',
    })
  },
}