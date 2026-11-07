import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'

export const useTelematicsStore = defineStore('telematics', () => {
  const vehicles = ref([])
  const metrics = ref({
    total_vehicles: 0,
    total_tracked: 0,
    pending_install: 0,
    online_gps: 0,
    calibrated_fuel: 0,
    active_mdvr: 0,
    active_panic: 0,
  })

  // Estado del Almacén de Bodega
  const stock = ref({
    gps: [],
    sims: [],
    fuel_sensors: [],
    mdvrs: [],
  })
  const stockMetrics = ref({
    gps_total: 0,
    gps_available: 0,
    gps_installed: 0,
    sims_total: 0,
    sims_available: 0,
    sensors_total: 0,
    sensors_available: 0,
    mdvrs_total: 0,
    mdvrs_available: 0,
  })
  const availableForAssignment = ref({
    gps: [],
    sims: [],
    fuel_sensors: [],
    mdvrs: [],
  })

  const loading = ref(false)
  const stockLoading = ref(false)
  const actionLoading = ref(false)
  const error = ref(null)

  async function fetchInventory(search = '') {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)

      const response = await api.get(`/telematics?${params.toString()}`)
      if (response.data.success && response.data.data) {
        vehicles.value = response.data.data.vehicles || []
        metrics.value = response.data.data.metrics || metrics.value
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener el inventario telemático.'
    } finally {
      loading.value = false
    }
  }

  async function fetchStock() {
    stockLoading.value = true
    error.value = null
    try {
      const response = await api.get('/telematics/stock')
      if (response.data.success && response.data.data) {
        stock.value = response.data.data.stock || stock.value
        stockMetrics.value = response.data.data.metrics || stockMetrics.value
        availableForAssignment.value = response.data.data.available_for_assignment || availableForAssignment.value
      }
    } catch (err) {
      console.error('Error al obtener stock de almacén:', err)
    } finally {
      stockLoading.value = false
    }
  }

  async function addStockItem(payload) {
    actionLoading.value = true
    error.value = null
    try {
      const response = await api.post('/telematics/stock', payload)
      await fetchStock()
      return { success: true, data: response.data.data }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrar el equipo en bodega.'
      return { success: false, message: msg }
    } finally {
      actionLoading.value = false
    }
  }

  async function assignHardware(vehicleId, payload) {
    actionLoading.value = true
    error.value = null
    try {
      const response = await api.post(`/telematics/${vehicleId}/assign`, payload)
      await fetchInventory()
      await fetchStock()
      return { success: true, data: response.data.data }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar el hardware telemático.'
      return { success: false, message: msg, errors: err.response?.data?.errors }
    } finally {
      actionLoading.value = false
    }
  }

  async function runPing(vehicleId) {
    try {
      const response = await api.post(`/telematics/${vehicleId}/ping`)
      return { success: true, data: response.data.data }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'No se pudo conectar con el dispositivo.' }
    }
  }

  return {
    vehicles,
    metrics,
    stock,
    stockMetrics,
    availableForAssignment,
    loading,
    stockLoading,
    actionLoading,
    error,
    fetchInventory,
    fetchStock,
    addStockItem,
    assignHardware,
    runPing,
  }
})
