import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'

export const useOperatorStore = defineStore('operators', () => {
  const operators = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  })

  async function fetchOperators(search = '', status = '', page = 1) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (status) params.append('status', status)
      params.append('page', page)

      const response = await api.get(`/admin/operators?${params.toString()}`)
      operators.value = response.data.data
      pagination.value = {
        currentPage: response.data.meta.current_page,
        lastPage: response.data.meta.last_page,
        total: response.data.meta.total,
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener la lista de operadores'
    } finally {
      loading.value = false
    }
  }

  async function createOperator(formData) {
    loading.value = true
    try {
      const response = await api.post('/admin/operators', formData)
      await fetchOperators()
      return { success: true, data: response.data.data }
    } catch (err) {
      const errors = err.response?.data?.errors
      const msg = err.response?.data?.message || 'Error al registrar el operador'
      return { success: false, message: msg, errors }
    } finally {
      loading.value = false
    }
  }

  async function updateOperator(id, formData) {
    loading.value = true
    try {
      const response = await api.put(`/admin/operators/${id}`, formData)
      await fetchOperators()
      return { success: true, data: response.data.data }
    } catch (err) {
      const errors = err.response?.data?.errors
      const msg = err.response?.data?.message || 'Error al actualizar el operador'
      return { success: false, message: msg, errors }
    } finally {
      loading.value = false
    }
  }

  async function toggleStatus(id) {
    try {
      const response = await api.patch(`/admin/operators/${id}/toggle-status`)
      const updated = response.data.data
      const idx = operators.value.findIndex(o => o.id === id)
      if (idx !== -1) {
        operators.value[idx].is_active = updated.is_active
      }
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al alternar estado' }
    }
  }

  return {
    operators,
    loading,
    error,
    pagination,
    fetchOperators,
    createOperator,
    updateOperator,
    toggleStatus,
  }
})
