import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/client'

export const useDefectsStore = defineStore('defects', () => {
  const defects = ref([])
  const meta = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
  })
  const loading = ref(false)
  const actionLoading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)

  // Filtros activos
  const filters = ref({
    status: '',
    severity: '',
    search: '',
    page: 1,
  })

  // Estadísticas calculadas en base a la lista actual
  const stats = computed(() => {
    const total = defects.value.length
    const open = defects.value.filter((d) => d.status === 'open' || d.status === 'in_progress').length
    const criticalOpen = defects.value.filter(
      (d) => (d.status === 'open' || d.status === 'in_progress') && d.severity === 'critical'
    ).length
    const resolved = defects.value.filter((d) => d.status === 'resolved').length

    return { total, open, criticalOpen, resolved }
  })

  async function fetchDefects(customParams = {}) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()

      const currentStatus = customParams.status ?? filters.value.status
      const currentSeverity = customParams.severity ?? filters.value.severity
      const currentPage = customParams.page ?? filters.value.page

      if (currentStatus) params.append('status', currentStatus)
      if (currentSeverity) params.append('severity', currentSeverity)
      if (currentPage) params.append('page', String(currentPage))
      params.append('per_page', '50')

      const response = await api.get(`/defects?${params.toString()}`)
      defects.value = response.data.data || []
      if (response.data.meta) {
        meta.value = {
          current_page: response.data.meta.current_page || 1,
          last_page: response.data.meta.last_page || 1,
          total: response.data.meta.total || defects.value.length,
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener la lista de defectos de taller'
    } finally {
      loading.value = false
    }
  }

  async function resolveDefect(defectId, { resolution_notes, resolved_evidence_path = null }) {
    actionLoading.value = true
    error.value = null
    successMessage.value = null

    try {
      const payload = {
        resolution_notes,
        ...(resolved_evidence_path ? { resolved_evidence_path } : {}),
      }

      const response = await api.patch(`/defects/${defectId}/resolve`, payload)
      const updatedDefect = response.data.data

      // Actualizar en el estado local
      const idx = defects.value.findIndex((d) => d.id === defectId)
      if (idx !== -1) {
        defects.value[idx] = updatedDefect
      }

      successMessage.value = response.data.message || 'Defecto subsanado exitosamente.'
      return { success: true, data: updatedDefect }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al intentar subsanar el defecto'
      error.value = msg
      return { success: false, error: msg }
    } finally {
      actionLoading.value = false
    }
  }

  function clearMessages() {
    error.value = null
    successMessage.value = null
  }

  return {
    defects,
    meta,
    loading,
    actionLoading,
    error,
    successMessage,
    filters,
    stats,
    fetchDefects,
    resolveDefect,
    clearMessages,
  }
})
