import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Transactions
export const getTransactions = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate) params.append('endDate', filters.endDate)

  const response = await api.get(`/transactions${params.toString() ? '?' + params.toString() : ''}`)
  return response.data
}

export const getFilteredTransactions = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.category) params.append('category', filters.category)
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate) params.append('endDate', filters.endDate)

  const response = await api.get(`/transactions/filter?${params.toString()}`)
  return response.data
}

export const exportTransactionsCSV = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate) params.append('endDate', filters.endDate)

  const response = await api.get(`/transactions/export/csv?${params.toString()}`, {
    responseType: 'blob'
  })

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'transactions.csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData)
  return response.data
}

export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/transactions/${id}`, transactionData)
  return response.data
}

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`)
  return response.data
}

// Categories
export const getCategories = async () => {
  const response = await api.get('/categories')
  return response.data
}

// Budgets
export const getBudgets = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate) params.append('endDate', filters.endDate)

  const response = await api.get(`/budgets${params.toString() ? '?' + params.toString() : ''}`)
  return response.data
}

export const updateBudget = async (budgetData) => {
  const response = await api.post('/budgets', budgetData)
  return response.data
}

// Summary
export const getSummary = async () => {
  const response = await api.get('/summary')
  return response.data
}

export default api