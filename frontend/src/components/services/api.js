const API_BASE_URL = 'http://localhost:8000/api'
const REFRESH_ENDPOINT = '/users/token/refresh/'

let refreshTokenPromise = null

function getAccessToken() {
  return localStorage.getItem('accessToken')
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken')
}

function saveAccessToken(accessToken) {
  localStorage.setItem('accessToken', accessToken)
}

function saveAuthData(data) {
  if (data.access) {
    localStorage.setItem('accessToken', data.access)
  }

  if (data.refresh) {
    localStorage.setItem('refreshToken', data.refresh)
  }

  if (data.user_id) {
    localStorage.setItem('userId', data.user_id)
  }

  if (data.name) {
    localStorage.setItem('userName', data.name)
  }

  if (data.email) {
    localStorage.setItem('userEmail', data.email)
  }
}

function clearAuthStorage() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userId')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
}

function getAuthHeaders() {
  const token = getAccessToken()

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

function getErrorMessage(data) {
  return (
    data?.detail ||
    data?.name?.[0] ||
    data?.email?.[0] ||
    data?.password?.[0] ||
    data?.confirm_password?.[0] ||
    data?.description?.[0] ||
    data?.category?.[0] ||
    data?.value?.[0] ||
    data?.target_value?.[0] ||
    data?.deadline?.[0] ||
    data?.date?.[0] ||
    data?.non_field_errors?.[0] ||
    'Erro ao processar a requisição.'
  )
}

function canTryRefresh(endpoint, status, shouldRetry) {
  const isAuthEndpoint =
    endpoint === '/users/login/' ||
    endpoint === '/users/register/' ||
    endpoint === REFRESH_ENDPOINT

  return status === 401 && shouldRetry && !isAuthEndpoint
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    clearAuthStorage()
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  const response = await fetch(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.access) {
    clearAuthStorage()
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  saveAccessToken(data.access)

  if (data.refresh) {
    localStorage.setItem('refreshToken', data.refresh)
  }

  return data.access
}

async function getFreshAccessToken() {
  if (!refreshTokenPromise) {
    refreshTokenPromise = refreshAccessToken().finally(() => {
      refreshTokenPromise = null
    })
  }

  return refreshTokenPromise
}

async function request(endpoint, options = {}, shouldRetry = true) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  if (canTryRefresh(endpoint, response.status, shouldRetry)) {
    await getFreshAccessToken()

    return request(endpoint, options, false)
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(getErrorMessage(data))
  }

  return data
}

export const authService = {
  async login(credentials) {
    const data = await request('/users/login/', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })

    saveAuthData({
      ...data,
      email: data.email || credentials.email,
    })

    return data
  },

  register(userData) {
    return request('/users/register/', {
      method: 'POST',
      body: JSON.stringify({
        name: userData.name,
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

export const saldoService = {
  get() {
    return request('/saldo/')
  },
}

export const metasService = {
  list() {
    return request('/metas/metas/')
  },

  create(meta) {
    return request('/metas/metas/', {
      method: 'POST',
      body: JSON.stringify({
        name: meta.name,
        description: meta.description || null,
        target_value: meta.target_value,
        deadline: meta.deadline,
      }),
    })
  },

  update(id, meta) {
    return request(`/metas/metas/${id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        name: meta.name,
        description: meta.description || null,
        target_value: meta.target_value,
        deadline: meta.deadline,
      }),
    })
  },

  remove(id) {
    return request(`/metas/metas/${id}/`, {
      method: 'DELETE',
    })
  },
}