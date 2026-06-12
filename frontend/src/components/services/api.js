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

function getAuthHeaders(skipAuth = false) {
  if (skipAuth) {
    return {}
  }

  const token = getAccessToken()

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

function getFieldError(data, fieldName) {
  const fieldError = data?.[fieldName]

  if (Array.isArray(fieldError)) {
    return fieldError[0]
  }

  if (typeof fieldError === 'string') {
    return fieldError
  }

  return null
}

function getErrorMessage(data) {
  return (
    data?.detail ||
    getFieldError(data, 'name') ||
    getFieldError(data, 'email') ||
    getFieldError(data, 'password') ||
    getFieldError(data, 'confirm_password') ||
    getFieldError(data, 'birth_date') ||
    getFieldError(data, 'phone') ||
    getFieldError(data, 'profession') ||
    getFieldError(data, 'monthly_income') ||
    getFieldError(data, 'description') ||
    getFieldError(data, 'category') ||
    getFieldError(data, 'value') ||
    getFieldError(data, 'target_value') ||
    getFieldError(data, 'deadline') ||
    getFieldError(data, 'date') ||
    data?.non_field_errors?.[0] ||
    'Erro ao processar a requisição.'
  )
}

function canTryRefresh(endpoint, status, shouldRetry, skipAuth) {
  const isAuthEndpoint =
    endpoint === '/users/login/' ||
    endpoint === '/users/register/' ||
    endpoint === REFRESH_ENDPOINT

  return status === 401 && shouldRetry && !isAuthEndpoint && !skipAuth
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
  const { skipAuth = false, headers = {}, ...fetchOptions } = options

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(skipAuth),
      ...headers,
    },
  })

  if (canTryRefresh(endpoint, response.status, shouldRetry, skipAuth)) {
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
    clearAuthStorage()

    const data = await request('/users/login/', {
      method: 'POST',
      skipAuth: true,
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
      skipAuth: true,
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirm_password,
        birth_date: userData.birth_date || null,
        phone: userData.phone || '',
        profession: userData.profession || null,
        monthly_income:
          userData.monthly_income === '' || userData.monthly_income === undefined
            ? null
            : userData.monthly_income,
      }),
    })
  },

  logout() {
    clearAuthStorage()
  },

  isAuthenticated() {
    return Boolean(getAccessToken())
  },
}

export const userProfileService = {
  getPhone() {
    return request('/users/phone/')
  },

  updatePhone(phone) {
    return request('/users/phone/', {
      method: 'PATCH',
      body: JSON.stringify({ phone }),
    })
  },

  getProfession() {
    return request('/users/profession/')
  },

  updateProfession(profession) {
    return request('/users/profession/', {
      method: 'PATCH',
      body: JSON.stringify({ profession: profession || null }),
    })
  },

  getMonthlyIncome() {
    return request('/users/monthly-income/')
  },

  updateMonthlyIncome(monthlyIncome) {
    return request('/users/monthly-income/', {
      method: 'PATCH',
      body: JSON.stringify({
        monthly_income:
          monthlyIncome === '' || monthlyIncome === undefined
            ? null
            : monthlyIncome,
      }),
    })
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