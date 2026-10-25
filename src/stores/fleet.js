import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'

export const useFleetStore = defineStore('fleet', () => {
  const vehicles = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchVehicles(search = '', status = '') {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (status) params.append('status', status)
      params.append('per_page', '50')

      const response = await api.get(`/vehicles?${params.toString()}`)
      vehicles.value = response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener la flota de unidades'
    } finally {
      loading.value = false
    }
  }

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
  }
})
