import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'

export const useAdminDailyStore = defineStore('adminDaily', () => {
  const loading = ref(false)
  const error = ref(null)
  const selectedDate = ref(new Date().toISOString().split('T')[0])
  const data = ref({
    date: '',
    date_human: '',
    metrics: {
      inspections_today: 0,
      operators_active_today: 0,
      total_operators: 0,
      open_defects: 0,
      critical_defects_today: 0,
      fleet: {
        total: 0,
        active: 0,
        maintenance: 0,
        out_of_service: 0,
      },
    },
    timeline: [],
  })

  async function fetchDailyActivity(date = null) {
    loading.value = true
    error.value = null
    const queryDate = date || selectedDate.value
    selectedDate.value = queryDate

    try {
      const response = await api.get(`/admin/daily-activity?date=${queryDate}`)
      data.value = response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar la actividad del día'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    selectedDate,
    data,
    fetchDailyActivity,
  }
})
