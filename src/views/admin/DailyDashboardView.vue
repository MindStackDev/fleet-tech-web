<template>
  <div class="space-y-6">
    <!-- Barra Superior de Control Diario -->
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            En Vivo
          </span>
          <h2 class="text-xl font-bold text-slate-800">Resumen y Bitácora de la Jornada</h2>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Visualizando actividades de: <span class="font-semibold text-slate-700 capitalize">{{ store.data.date_human || store.selectedDate }}</span>
        </p>
      </div>

      <!-- Selector de Fecha y Acciones -->
      <div class="flex flex-wrap items-center gap-2.5">
        <div class="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            @click="setQuickDate('today')"
            class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
            :class="isToday ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Hoy
          </button>
          <button
            @click="setQuickDate('yesterday')"
            class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
            :class="isYesterday ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Ayer
          </button>
        </div>

        <div class="relative">
          <input
            type="date"
            v-model="store.selectedDate"
            @change="handleDateChange"
            class="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-xs"
          />
        </div>

        <button
          @click="printReport"
          class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Imprimir Reporte</span>
        </button>
      </div>
    </div>

    <!-- Tarjetas de Métricas del Día -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Inspecciones Hoy -->
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
        <div class="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inspecciones Hoy</p>
          <h3 class="text-2xl font-bold text-slate-800">{{ store.data.metrics.inspections_today }}</h3>
          <p class="text-[11px] text-slate-400">Relevos y checklists de patio</p>
        </div>
      </div>

      <!-- Operadores en Turno -->
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
        <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operadores Activos</p>
          <h3 class="text-2xl font-bold text-slate-800">{{ store.data.metrics.operators_active_today }} <span class="text-xs text-slate-400 font-normal">/ {{ store.data.metrics.total_operators }} reg.</span></h3>
          <p class="text-[11px] text-slate-400">Personal en patio en la jornada</p>
        </div>
      </div>

      <!-- Averías / Fallas Pendientes -->
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fallas Abiertas</p>
          <h3 class="text-2xl font-bold" :class="store.data.metrics.open_defects > 0 ? 'text-amber-600' : 'text-slate-800'">
            {{ store.data.metrics.open_defects }}
          </h3>
          <p class="text-[11px] text-slate-400">{{ store.data.metrics.critical_defects_today }} críticas reportadas hoy</p>
        </div>
      </div>

      <!-- Estado de Flota -->
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Flota Operativa</p>
          <h3 class="text-2xl font-bold text-slate-800">{{ store.data.metrics.fleet.active }} <span class="text-xs text-slate-400 font-normal">/ {{ store.data.metrics.fleet.total }} unidades</span></h3>
          <p class="text-[11px] text-slate-400">{{ store.data.metrics.fleet.maintenance }} en mantenimiento</p>
        </div>
      </div>
    </div>

    <!-- Feed / Bitácora Cronológica de Eventos -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs">
      <!-- Encabezado de la Bitácora y Filtros -->
      <div class="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-slate-800">Línea de Tiempo Operativa (Todo lo que se hizo)</h3>
          <p class="text-xs text-slate-500 mt-0.5">Historial cronológico detallado de intervenciones, checklists y reportes</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Filtro de tipo de evento -->
          <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              @click="filterType = 'all'"
              class="px-2.5 py-1 rounded-md font-medium transition-colors"
              :class="filterType === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Todos ({{ store.data.timeline.length }})
            </button>
            <button
              @click="filterType = 'inspection'"
              class="px-2.5 py-1 rounded-md font-medium transition-colors"
              :class="filterType === 'inspection' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Inspecciones
            </button>
            <button
              @click="filterType = 'defect_reported'"
              class="px-2.5 py-1 rounded-md font-medium transition-colors"
              :class="filterType === 'defect_reported' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Fallas
            </button>
            <button
              @click="filterType = 'defect_resolved'"
              class="px-2.5 py-1 rounded-md font-medium transition-colors"
              :class="filterType === 'defect_resolved' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Resueltas
            </button>
          </div>

          <!-- Búsqueda en el feed -->
          <div class="relative">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Filtrar por placa u operador..."
              class="px-3 py-1.5 pl-8 bg-white border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-xs"
            />
            <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Contenido del Feed -->
      <div class="p-6">
        <!-- Estado de carga -->
        <div v-if="store.loading" class="py-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <p class="text-xs text-slate-500 mt-2">Cargando registro de operaciones del día...</p>
        </div>

        <!-- Sin eventos -->
        <div v-else-if="filteredTimeline.length === 0" class="py-12 text-center">
          <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 class="text-sm font-semibold text-slate-700">No se encontraron actividades</h4>
          <p class="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            No se han registrado inspecciones o novedades para la fecha seleccionada. Puedes consultar otra fecha o verificar los relevos móviles.
          </p>
        </div>

        <!-- Lista cronológica con diseño Timeline -->
        <div v-else class="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          <div
            v-for="item in filteredTimeline"
            :key="item.id"
            class="relative flex items-start space-x-4 group"
          >
            <!-- Punto indicador -->
            <div
              class="absolute -left-6 mt-1 w-5 h-5 rounded-full border-2 border-white shadow-xs flex items-center justify-center"
              :class="getBadgeDotClass(item.type, item.severity)"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>

            <!-- Tarjeta de Actividad -->
            <div class="flex-1 bg-slate-50 hover:bg-slate-100/70 p-4 rounded-xl border border-slate-200 transition-colors">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                <div class="flex items-center space-x-2">
                  <span
                    class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider"
                    :class="getBadgeTagClass(item.type)"
                  >
                    {{ getTypeName(item.type) }}
                  </span>
                  <h4 class="text-sm font-bold text-slate-800">{{ item.title }}</h4>
                </div>
                <div class="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ item.time_formatted }}</span>
                </div>
              </div>

              <p class="text-xs text-slate-600 mt-1">{{ item.description }}</p>

              <!-- Metadatos de la acción -->
              <div class="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs gap-2">
                <div class="flex items-center space-x-4">
                  <span class="flex items-center space-x-1 text-slate-600">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="font-semibold text-slate-700">{{ item.operator_name }}</span>
                    <span v-if="item.receiving_operator_name" class="text-slate-400">
                      ➜ {{ item.receiving_operator_name }}
                    </span>
                  </span>

                  <span v-if="item.vehicle_plate" class="inline-flex items-center px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono font-bold text-[11px]">
                    {{ item.vehicle_plate }}
                  </span>
                </div>

                <span
                  v-if="item.status"
                  class="text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full"
                  :class="getStatusPillClass(item.status)"
                >
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminDailyStore } from '../../stores/adminDaily'

const store = useAdminDailyStore()
const filterType = ref('all')
const searchTerm = ref('')

const isToday = computed(() => {
  const todayStr = new Date().toISOString().split('T')[0]
  return store.selectedDate === todayStr
})

const isYesterday = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const yStr = d.toISOString().split('T')[0]
  return store.selectedDate === yStr
})

const setQuickDate = (preset) => {
  const d = new Date()
  if (preset === 'yesterday') {
    d.setDate(d.getDate() - 1)
  }
  store.selectedDate = d.toISOString().split('T')[0]
  loadData()
}

const handleDateChange = () => {
  loadData()
}

const loadData = () => {
  store.fetchDailyActivity(store.selectedDate)
}

const filteredTimeline = computed(() => {
  return store.data.timeline.filter(item => {
    // Filtro por tipo
    if (filterType.value !== 'all' && item.type !== filterType.value) {
      return false
    }
    // Filtro por búsqueda
    if (searchTerm.value) {
      const q = searchTerm.value.toLowerCase()
      const inPlate = item.vehicle_plate?.toLowerCase().includes(q)
      const inOp = item.operator_name?.toLowerCase().includes(q)
      const inDesc = item.description?.toLowerCase().includes(q)
      return inPlate || inOp || inDesc
    }
    return true
  })
})

const getTypeName = (type) => {
  switch (type) {
    case 'inspection':
      return 'Inspección'
    case 'defect_reported':
      return 'Falla'
    case 'defect_resolved':
      return 'Resuelto'
    default:
      return 'Evento'
  }
}

const getBadgeTagClass = (type) => {
  switch (type) {
    case 'inspection':
      return 'bg-sky-100 text-sky-800'
    case 'defect_reported':
      return 'bg-amber-100 text-amber-800'
    case 'defect_resolved':
      return 'bg-emerald-100 text-emerald-800'
    default:
      return 'bg-slate-100 text-slate-800'
  }
}

const getBadgeDotClass = (type, severity) => {
  if (severity === 'critical') return 'bg-rose-500'
  switch (type) {
    case 'inspection':
      return 'bg-sky-500'
    case 'defect_reported':
      return 'bg-amber-500'
    case 'defect_resolved':
      return 'bg-emerald-500'
    default:
      return 'bg-slate-400'
  }
}

const getStatusPillClass = (status) => {
  switch (status) {
    case 'approved':
    case 'resolved':
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    case 'open':
    case 'in_workshop':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'critical':
      return 'bg-rose-50 text-rose-700 border border-rose-200'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

const printReport = () => {
  window.print()
}

onMounted(() => {
  loadData()
})
</script>
