<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Padrón de Unidades y Estado de Patio</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Kit de control de flota: Supervisión de tractocamiones, cisternas y camionetas
        </p>
      </div>
    </div>

    <!-- Barra de Filtros -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div class="flex-1 max-w-md relative">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por placa, marca o modelo..."
          class="w-full px-3.5 py-2 pl-9 bg-slate-50 border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex items-center space-x-2">
        <span class="text-xs text-slate-500 font-medium">Estado:</span>
        <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            @click="filterStatus = ''"
            class="px-3 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === '' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Todas
          </button>
          <button
            @click="filterStatus = 'active'"
            class="px-3 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === 'active' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Operativas
          </button>
          <button
            @click="filterStatus = 'in_maintenance'"
            class="px-3 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === 'in_maintenance' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Mantenimiento
          </button>
        </div>
      </div>
    </div>

    <!-- Lista / Grilla de Vehículos -->
    <div v-if="fleetStore.loading" class="py-12 text-center bg-white rounded-xl border border-slate-200">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      <p class="text-xs text-slate-500 mt-2">Cargando flota de patio...</p>
    </div>

    <div v-else-if="filteredVehicles.length === 0" class="py-12 text-center bg-white rounded-xl border border-slate-200">
      <p class="text-sm font-semibold text-slate-700">No se encontraron unidades</p>
      <p class="text-xs text-slate-400 mt-1">Intenta con otro término de búsqueda o cambia el filtro de estado.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="vehicle in filteredVehicles"
        :key="vehicle.id"
        class="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
      >
        <div>
          <!-- Cabecera de la tarjeta del vehículo -->
          <div class="flex items-start justify-between mb-3">
            <div>
              <span class="inline-block px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono font-bold text-sm tracking-wider shadow-xs">
                {{ vehicle.plate_number }}
              </span>
              <p class="text-xs text-slate-500 mt-1 font-medium">{{ vehicle.vehicle_type?.name || 'Tracto / Unidad' }}</p>
            </div>
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
              :class="getStatusBadgeClass(vehicle.status)"
            >
              <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotClass(vehicle.status)"></span>
              {{ vehicle.status_label || vehicle.status }}
            </span>
          </div>

          <!-- Datos técnicos -->
          <div class="space-y-1.5 text-xs text-slate-600 my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div class="flex justify-between">
              <span class="text-slate-400">Marca / Modelo:</span>
              <span class="font-semibold text-slate-700">{{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.year }})</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Odómetro Actual:</span>
              <span class="font-semibold text-slate-700">{{ Number(vehicle.current_mileage || 0).toLocaleString() }} KM</span>
            </div>
            <div v-if="vehicle.specs?.bahia_asignada" class="flex justify-between">
              <span class="text-slate-400">Ubicación / Bahía:</span>
              <span class="font-semibold text-sky-700">{{ vehicle.specs.bahia_asignada }}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>VIN: <span class="font-mono text-[11px]">{{ vehicle.vin ? vehicle.vin.substring(0, 10) + '...' : 'N/A' }}</span></span>
          <span class="text-emerald-600 font-medium">Habilitado</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFleetStore } from '../../stores/fleet'

const fleetStore = useFleetStore()
const searchTerm = ref('')
const filterStatus = ref('')

const loadFleet = () => {
  fleetStore.fetchVehicles()
}

const filteredVehicles = computed(() => {
  return fleetStore.vehicles.filter(v => {
    if (filterStatus.value && v.status !== filterStatus.value) {
      return false
    }
    if (searchTerm.value) {
      const q = searchTerm.value.toLowerCase()
      const inPlate = v.plate_number?.toLowerCase().includes(q)
      const inBrand = v.brand?.toLowerCase().includes(q)
      const inModel = v.model?.toLowerCase().includes(q)
      return inPlate || inBrand || inModel
    }
    return true
  })
})

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    case 'in_maintenance':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'out_of_service':
      return 'bg-rose-50 text-rose-700 border border-rose-200'
    default:
      return 'bg-slate-100 text-slate-600 border border-slate-200'
  }
}

const getStatusDotClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-500'
    case 'in_maintenance':
      return 'bg-amber-500'
    case 'out_of_service':
      return 'bg-rose-500'
    default:
      return 'bg-slate-400'
  }
}

onMounted(() => {
  loadFleet()
})
</script>
