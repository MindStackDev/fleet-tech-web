<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <h2 class="text-xl font-bold text-slate-800">Triage y Bandeja de Taller Mecánico</h2>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Supervisión de fallas operativas levantadas en relevos de turno y deslinde de custodia en patio
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="loadDefects"
          :disabled="defectsStore.loading"
          class="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center space-x-1.5"
        >
          <svg
            class="w-4 h-4 text-slate-500"
            :class="{ 'animate-spin': defectsStore.loading }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Actualizar</span>
        </button>
      </div>
    </div>

    <!-- Toast / Mensajes de Feedback -->
    <div
      v-if="defectsStore.successMessage"
      class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800"
    >
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">{{ defectsStore.successMessage }}</span>
      </div>
      <button @click="defectsStore.clearMessages" class="text-emerald-600 hover:text-emerald-800 font-bold ml-4">
        &times;
      </button>
    </div>

    <div
      v-if="defectsStore.error"
      class="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800"
    >
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">{{ defectsStore.error }}</span>
      </div>
      <button @click="defectsStore.clearMessages" class="text-rose-600 hover:text-rose-800 font-bold ml-4">
        &times;
      </button>
    </div>

    <!-- Tarjetas de Métricas Rápidas (KPIs) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl border border-rose-100 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-rose-600">Críticos Abiertos</span>
          <p class="text-2xl font-black text-rose-700 mt-1">{{ defectsStore.stats.criticalOpen }}</p>
          <span class="text-[11px] text-rose-500 font-medium">Bloquean unidad en patio</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600">Total Abiertos</span>
          <p class="text-2xl font-black text-slate-800 mt-1">{{ defectsStore.stats.open }}</p>
          <span class="text-[11px] text-slate-400">Pendientes de subsanación</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Subsanados</span>
          <p class="text-2xl font-black text-emerald-700 mt-1">{{ defectsStore.stats.resolved }}</p>
          <span class="text-[11px] text-emerald-600 font-medium">Regularizados por taller</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Total Auditados</span>
          <p class="text-2xl font-black text-slate-800 mt-1">{{ defectsStore.stats.total }}</p>
          <span class="text-[11px] text-slate-400">Histórico de novedades</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Barra de Filtros y Búsqueda -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <!-- Búsqueda rápida -->
      <div class="flex-1 max-w-md relative">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por placa, componente o descripción..."
          class="w-full px-3.5 py-2 pl-9 bg-slate-50 border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Filtros combinados -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Filtro por Estado -->
        <div class="flex items-center space-x-1.5">
          <span class="text-xs text-slate-500 font-medium">Estado:</span>
          <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              @click="filterStatus = ''"
              class="px-2.5 py-1 rounded-md font-medium transition-colors"
              :class="filterStatus === '' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Todos
            </button>
            <button
              @click="filterStatus = 'open'"
              class="px-2.5 py-1 rounded-md font-medium transition-colors"
              :class="filterStatus === 'open' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Abiertos
            </button>
            <button
              @click="filterStatus = 'resolved'"
              class="px-2.5 py-1 rounded-md font-medium transition-colors"
              :class="filterStatus === 'resolved' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Resueltos
            </button>
          </div>
        </div>

        <!-- Filtro por Severidad -->
        <div class="flex items-center space-x-1.5">
          <span class="text-xs text-slate-500 font-medium">Severidad:</span>
          <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              @click="filterSeverity = ''"
              class="px-2.5 py-1 rounded-md font-medium transition-colors"
              :class="filterSeverity === '' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Todas
            </button>
            <button
              @click="filterSeverity = 'critical'"
              class="px-2.5 py-1 rounded-md font-medium transition-colors flex items-center space-x-1"
              :class="filterSeverity === 'critical' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Crítico</span>
            </button>
            <button
              @click="filterSeverity = 'major'"
              class="px-2.5 py-1 rounded-md font-medium transition-colors"
              :class="filterSeverity === 'major' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Mayor
            </button>
            <button
              @click="filterSeverity = 'minor'"
              class="px-2.5 py-1 rounded-md font-medium transition-colors"
              :class="filterSeverity === 'minor' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Menor
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de Defectos -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <!-- Loading state -->
      <div v-if="defectsStore.loading" class="py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        <p class="text-xs text-slate-500 mt-2">Cargando bitácora de defectos de taller...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredDefects.length === 0" class="py-16 text-center px-4">
        <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-sm font-bold text-slate-700">No se encontraron defectos con los filtros actuales</p>
        <p class="text-xs text-slate-400 mt-1">El patio se encuentra operativo o no hay observaciones pendientes bajo este criterio.</p>
      </div>

      <!-- Lista / Tabla -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th class="py-3 px-4">Unidad</th>
              <th class="py-3 px-4">Componente / Falla</th>
              <th class="py-3 px-4">Severidad</th>
              <th class="py-3 px-4">Reportado Por / Fecha</th>
              <th class="py-3 px-4">Estado</th>
              <th class="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="defect in filteredDefects"
              :key="defect.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <!-- Unidad / Placa -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span class="inline-block px-2.5 py-1 rounded bg-slate-900 text-white font-mono font-bold text-xs tracking-wider shadow-xs">
                  {{ defect.plate_number || 'N/A' }}
                </span>
                <p class="text-[10px] text-slate-400 mt-0.5 font-mono">ID: #{{ defect.id }}</p>
              </td>

              <!-- Componente / Descripción -->
              <td class="py-3.5 px-4 min-w-[240px]">
                <p class="font-bold text-slate-800 text-xs">{{ defect.item_label || 'Falla no catalogada' }}</p>
                <p class="text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                  {{ defect.description || 'Sin notas descriptivas adicionales.' }}
                </p>
                <!-- Si ya fue resuelto, mostrar notas de taller -->
                <div v-if="defect.status === 'resolved'" class="mt-2 p-2 bg-emerald-50/80 rounded border border-emerald-100 text-[11px] text-emerald-900">
                  <span class="font-bold block text-emerald-800">Subsanado por {{ defect.resolved_by?.name || 'Taller' }}:</span>
                  <p class="mt-0.5 text-emerald-700 italic">"{{ defect.resolution_notes }}"</p>
                  <span v-if="defect.resolved_at" class="text-[10px] text-emerald-600 block mt-0.5">
                    Fecha: {{ formatDate(defect.resolved_at) }}
                  </span>
                </div>
              </td>

              <!-- Severidad -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="getSeverityBadgeClass(defect.severity)"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getSeverityDotClass(defect.severity)"></span>
                  {{ defect.severity_label || defect.severity }}
                </span>
              </td>

              <!-- Reportado Por -->
              <td class="py-3.5 px-4 whitespace-nowrap text-slate-600">
                <p class="font-medium text-slate-700">{{ defect.reported_by?.name || 'Operador de Patio' }}</p>
                <p class="text-[10px] text-slate-400 mt-0.5">{{ formatDate(defect.created_at) }}</p>
              </td>

              <!-- Estado -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold"
                  :class="defect.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'"
                >
                  {{ defect.status === 'resolved' ? 'Subsanado' : 'Abierto / Pendiente' }}
                </span>
              </td>

              <!-- Botón Acción -->
              <td class="py-3.5 px-4 whitespace-nowrap text-right">
                <button
                  v-if="defect.status !== 'resolved'"
                  @click="openResolveModal(defect)"
                  class="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Subsanar Falla</span>
                </button>

                <span v-else class="text-[11px] font-semibold text-emerald-600 flex items-center justify-end space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Regularizado</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Subsanación -->
    <ResolveDefectModal
      :is-open="isModalOpen"
      :defect="selectedDefect"
      @close="closeResolveModal"
      @resolve="handleResolveDefect"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDefectsStore } from '../../stores/defects'
import ResolveDefectModal from '../../components/admin/ResolveDefectModal.vue'

const route = useRoute()
const defectsStore = useDefectsStore()

const searchTerm = ref('')
const filterStatus = ref('')
const filterSeverity = ref('')

const isModalOpen = ref(false)
const selectedDefect = ref(null)

const loadDefects = () => {
  defectsStore.fetchDefects()
}

const openResolveModal = (defect) => {
  selectedDefect.value = defect
  isModalOpen.value = true
}

const closeResolveModal = () => {
  isModalOpen.value = false
  selectedDefect.value = null
}

const handleResolveDefect = async ({ defectId, resolution_notes, resolved_evidence_path, onSuccess, onError }) => {
  const result = await defectsStore.resolveDefect(defectId, {
    resolution_notes,
    resolved_evidence_path,
  })

  if (result.success) {
    if (onSuccess) onSuccess()
  } else {
    if (onError) onError(result.error)
  }
}

const filteredDefects = computed(() => {
  return defectsStore.defects.filter((d) => {
    // Filtro por Estado
    if (filterStatus.value) {
      if (filterStatus.value === 'open' && d.status === 'resolved') return false
      if (filterStatus.value === 'resolved' && d.status !== 'resolved') return false
    }

    // Filtro por Severidad
    if (filterSeverity.value && d.severity !== filterSeverity.value) {
      return false
    }

    // Búsqueda por texto
    if (searchTerm.value) {
      const q = searchTerm.value.toLowerCase()
      const inPlate = d.plate_number?.toLowerCase().includes(q)
      const inItem = d.item_label?.toLowerCase().includes(q)
      const inDesc = d.description?.toLowerCase().includes(q)
      const inReporter = d.reported_by?.name?.toLowerCase().includes(q)
      return inPlate || inItem || inDesc || inReporter
    }

    return true
  })
})

const getSeverityBadgeClass = (severity) => {
  switch (severity) {
    case 'critical':
      return 'bg-rose-100 text-rose-800 border border-rose-200'
    case 'major':
      return 'bg-amber-100 text-amber-800 border border-amber-200'
    case 'minor':
      return 'bg-sky-100 text-sky-800 border border-sky-200'
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200'
  }
}

const getSeverityDotClass = (severity) => {
  switch (severity) {
    case 'critical':
      return 'bg-rose-500'
    case 'major':
      return 'bg-amber-500'
    case 'minor':
      return 'bg-sky-500'
    default:
      return 'bg-slate-400'
  }
}

const formatDate = (isoString) => {
  if (!isoString) return '-'
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

watch(
  () => route.query.search,
  (newSearch) => {
    if (newSearch) {
      searchTerm.value = String(newSearch)
    }
  }
)

onMounted(() => {
  if (route.query.search) {
    searchTerm.value = String(route.query.search)
  }
  loadDefects()
})
</script>
