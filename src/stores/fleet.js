import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'

export const useFleetStore = defineStore('fleet', () => {
  const vehicles = ref([])
  const vehicleTypes = ref([])
  const loading = ref(false)
  const actionLoading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)

  async function fetchVehicleTypes() {
    try {
      const response = await api.get('/vehicle-types')
      vehicleTypes.value = response.data.data
      return { success: true, data: response.data.data }
    } catch (err) {
      console.error('Error al obtener tipos de vehículos:', err)
      return { success: false, message: err.response?.data?.message || 'Error al obtener tipos de vehículos' }
    }
  }

  async function fetchVehicles(search = '', status = '') {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (status) params.append('status', status)
      params.append('per_page', '100')

      const response = await api.get(`/vehicles?${params.toString()}`)
      vehicles.value = response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener la flota de unidades'
    } finally {
      loading.value = false
    }
  }

  async function createVehicle(formData) {
    actionLoading.value = true
    error.value = null
    try {
      const response = await api.post('/vehicles', formData)
      await fetchVehicles()
      return { success: true, data: response.data.data }
    } catch (err) {
      const errors = err.response?.data?.errors
      const msg = err.response?.data?.message || 'Error al registrar la unidad vehicular'
      return { success: false, message: msg, errors }
    } finally {
      actionLoading.value = false
    }
  }

  async function updateVehicle(id, formData) {
    actionLoading.value = true
    error.value = null
    try {
      const response = await api.put(`/vehicles/${id}`, formData)
      await fetchVehicles()
      return { success: true, data: response.data.data }
    } catch (err) {
      const errors = err.response?.data?.errors
      const msg = err.response?.data?.message || 'Error al actualizar la unidad vehicular'
      return { success: false, message: msg, errors }
    } finally {
      actionLoading.value = false
    }
  }

  async function updateStatus(id, newStatus) {
    actionLoading.value = true
    try {
      const response = await api.patch(`/vehicles/${id}/status`, { status: newStatus })
      const updated = response.data.data
      const idx = vehicles.value.findIndex(v => v.id === id)
      if (idx !== -1) {
        vehicles.value[idx].status = updated.status
        vehicles.value[idx].status_label = updated.status_label
      }
      return { success: true, data: updated }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al cambiar estado de la unidad' }
    } finally {
      actionLoading.value = false
    }
  }

  async function deleteVehicle(id) {
    actionLoading.value = true
    try {
      await api.delete(`/vehicles/${id}`)
      vehicles.value = vehicles.value.filter(v => v.id !== id)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al eliminar unidad' }
    } finally {
      actionLoading.value = false
    }
  }

  return {
    vehicles,
    vehicleTypes,
    loading,
    actionLoading,
    error,
    successMessage,
    fetchVehicleTypes,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    updateStatus,
    deleteVehicle,
  }
})
