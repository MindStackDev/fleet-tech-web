<template>
  <div class="space-y-6">
    <!-- Encabezado y Botón de Acción -->
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Padrón de Unidades y Control de Patio</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Gestión integral de la flota: Tractocamiones, cisternas y unidades de patio
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center space-x-2 self-start sm:self-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>+ Nueva Unidad</span>
      </button>
    </div>

    <!-- Banner de Notificación de Éxito / Feedback -->
    <div
      v-if="feedbackMessage"
      class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between animate-fade-in shadow-xs"
    >
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="font-medium">{{ feedbackMessage }}</span>
      </div>
      <button @click="feedbackMessage = ''" class="text-emerald-600 hover:text-emerald-800">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Métricas Rápidas de Estado de Flota -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Unidades</p>
        <h4 class="text-2xl font-black text-slate-800 mt-1">{{ stats.total }}</h4>
        <p class="text-[11px] text-slate-400 mt-0.5">En el padrón de la empresa</p>
      </div>

      <div class="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Operativas en Patio</p>
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <h4 class="text-2xl font-black text-emerald-700 mt-1">{{ stats.active }}</h4>
        <p class="text-[11px] text-emerald-600/70 mt-0.5">Listas para relevo e inspección</p>
      </div>

      <div class="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
        <p class="text-[11px] font-bold text-amber-600 uppercase tracking-wider">En Mantenimiento</p>
        <h4 class="text-2xl font-black text-amber-700 mt-1">{{ stats.in_maintenance }}</h4>
        <p class="text-[11px] text-amber-600/70 mt-0.5">En taller o revisión mecánica</p>
      </div>

      <div class="bg-white p-4 rounded-xl border border-rose-100 shadow-xs">
        <p class="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Fuera de Servicio</p>
        <h4 class="text-2xl font-black text-rose-700 mt-1">{{ stats.out_of_service }}</h4>
        <p class="text-[11px] text-rose-600/70 mt-0.5">Bloqueadas temporalmente</p>
      </div>
    </div>

    <!-- Barra de Filtros y Búsqueda -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <!-- Input de Búsqueda -->
      <div class="flex-1 max-w-md relative">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por placa, marca, modelo o bahía..."
          class="w-full px-3.5 py-2 pl-9 bg-slate-50 border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Filtro por Tipo y Filtro por Estado -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Selector de Tipo -->
        <select
          v-model="filterType"
          class="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-sky-500"
        >
          <option value="">Todos los tipos</option>
          <option v-for="t in fleetStore.vehicleTypes" :key="t.id" :value="t.id">
            {{ t.name }}
          </option>
        </select>

        <!-- Selector de Estado -->
        <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            @click="filterStatus = ''"
            class="px-2.5 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === '' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
          >
            Todas
          </button>
          <button
            @click="filterStatus = 'active'"
            class="px-2.5 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === 'active' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
          >
            Operativas
          </button>
          <button
            @click="filterStatus = 'in_maintenance'"
            class="px-2.5 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === 'in_maintenance' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
          >
            Taller
          </button>
          <button
            @click="filterStatus = 'out_of_service'"
            class="px-2.5 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === 'out_of_service' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
          >
            Inactivas
          </button>
        </div>
      </div>
    </div>

    <!-- Lista / Grilla de Vehículos -->
    <div v-if="fleetStore.loading" class="py-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      <p class="text-xs text-slate-500 mt-2">Cargando flota de patio...</p>
    </div>

    <div v-else-if="filteredVehicles.length === 0" class="py-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
      <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-700">No se encontraron unidades</p>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
        No hay unidades que coincidan con los filtros aplicados. Puedes registrar una nueva haciendo clic en "+ Nueva Unidad".
      </p>
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
              {{ vehicle.status_label || getStatusLabelFallback(vehicle.status) }}
            </span>
          </div>

          <!-- Datos técnicos -->
          <div class="space-y-1.5 text-xs text-slate-600 my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div class="flex justify-between">
              <span class="text-slate-400">Marca / Modelo:</span>
              <span class="font-semibold text-slate-700">{{ vehicle.brand }} {{ vehicle.model }} <span v-if="vehicle.year">({{ vehicle.year }})</span></span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Odómetro Actual:</span>
              <span class="font-semibold text-slate-700 font-mono">{{ Number(vehicle.current_mileage || 0).toLocaleString() }} KM</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Ubicación / Bahía:</span>
              <span class="font-semibold" :class="vehicle.specs?.bahia_asignada ? 'text-sky-700' : 'text-slate-400'">
                {{ vehicle.specs?.bahia_asignada || 'No asignada' }}
              </span>
            </div>
            <div v-if="vehicle.specs?.capacidad" class="flex justify-between">
              <span class="text-slate-400">Capacidad:</span>
              <span class="font-semibold text-slate-700">{{ vehicle.specs.capacidad }}</span>
            </div>
            <div v-if="vehicle.vin" class="flex justify-between text-[11px]">
              <span class="text-slate-400">VIN / Chasis:</span>
              <span class="font-mono text-slate-500">{{ vehicle.vin }}</span>
            </div>
          </div>
        </div>

        <!-- Acciones Operativas de la Unidad -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <!-- Botón Editar -->
          <button
            @click="openEditModal(vehicle)"
            class="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-1"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editar</span>
          </button>

          <!-- Acciones Rápidas de Estado -->
          <div class="flex items-center space-x-1.5">
            <!-- Si está en mantenimiento o inactivo -> Habilitar a Operativo -->
            <button
              v-if="vehicle.status !== 'active'"
              @click="handleChangeStatus(vehicle, 'active')"
              title="Habilitar a Operativo en Patio"
              class="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md transition-colors border border-emerald-200"
            >
              Habilitar
            </button>

            <!-- Si está operativo -> Mandar a taller -->
            <button
              v-if="vehicle.status === 'active'"
              @click="handleChangeStatus(vehicle, 'in_maintenance')"
              title="Mandar a Taller / Mantenimiento"
              class="px-2.5 py-1 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md transition-colors border border-amber-200"
            >
              A Taller
            </button>

            <!-- Si no está fuera de servicio -> Opción a Fuera de servicio -->
            <button
              v-if="vehicle.status !== 'out_of_service'"
              @click="handleChangeStatus(vehicle, 'out_of_service')"
              title="Desactivar / Fuera de servicio"
              class="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </button>

            <!-- Botón Eliminar Unidad -->
            <button
              @click="handleDelete(vehicle)"
              title="Eliminar Unidad"
              class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Registro y Edición -->
    <VehicleModal
      :show="showModal"
      :vehicle="selectedVehicle"
      :vehicleTypes="fleetStore.vehicleTypes"
      @close="closeModal"
      @saved="handleSaveVehicle"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFleetStore } from '../../stores/fleet'
import VehicleModal from '../../components/admin/VehicleModal.vue'

const fleetStore = useFleetStore()
const searchTerm = ref('')
const filterStatus = ref('')
const filterType = ref('')
const feedbackMessage = ref('')

const showModal = ref(false)
const selectedVehicle = ref(null)

const stats = computed(() => {
  const total = fleetStore.vehicles.length
  const active = fleetStore.vehicles.filter(v => v.status === 'active').length
  const in_maintenance = fleetStore.vehicles.filter(v => v.status === 'in_maintenance').length
  const out_of_service = fleetStore.vehicles.filter(v => v.status === 'out_of_service').length
  return { total, active, in_maintenance, out_of_service }
})

const filteredVehicles = computed(() => {
  return fleetStore.vehicles.filter(v => {
    // Filtro por estado
    if (filterStatus.value && v.status !== filterStatus.value) {
      return false
    }
    // Filtro por tipo
    if (filterType.value) {
      const typeId = v.vehicle_type?.id || v.vehicle_type_id
      if (String(typeId) !== String(filterType.value)) {
        return false
      }
    }
    // Filtro por búsqueda
    if (searchTerm.value) {
      const q = searchTerm.value.toLowerCase()
      const inPlate = v.plate_number?.toLowerCase().includes(q)
      const inBrand = v.brand?.toLowerCase().includes(q)
      const inModel = v.model?.toLowerCase().includes(q)
      const inBahia = v.specs?.bahia_asignada?.toLowerCase().includes(q)
      return inPlate || inBrand || inModel || inBahia
    }
    return true
  })
})

const openCreateModal = () => {
  selectedVehicle.value = null
  showModal.value = true
}

const openEditModal = (vehicle) => {
  selectedVehicle.value = { ...vehicle }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedVehicle.value = null
}

const handleSaveVehicle = async ({ isEditing, id, data, setLoading, setError }) => {
  let result
  if (isEditing) {
    result = await fleetStore.updateVehicle(id, data)
  } else {
    result = await fleetStore.createVehicle(data)
  }

  setLoading(false)

  if (result.success) {
    closeModal()
    feedbackMessage.value = isEditing
      ? `Unidad ${data.plate_number} actualizada exitosamente.`
      : `Nueva unidad ${data.plate_number} registrada en el padrón de flota.`
    setTimeout(() => {
      feedbackMessage.value = ''
    }, 5000)
  } else {
    setError(result.errors || result.message)
  }
}

const handleChangeStatus = async (vehicle, newStatus) => {
  const result = await fleetStore.updateStatus(vehicle.id, newStatus)
  if (result.success) {
    feedbackMessage.value = `Estado de la unidad ${vehicle.plate_number} modificado con éxito.`
    setTimeout(() => {
      feedbackMessage.value = ''
    }, 4000)
  } else {
    alert(result.message || 'No se pudo actualizar el estado de la unidad')
  }
}

const handleDelete = async (vehicle) => {
  const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la unidad ${vehicle.plate_number} de la flota activa?`)
  if (!confirmDelete) return

  const result = await fleetStore.deleteVehicle(vehicle.id)
  if (result.success) {
    feedbackMessage.value = `Unidad ${vehicle.plate_number} dada de baja del padrón.`
    setTimeout(() => {
      feedbackMessage.value = ''
    }, 4000)
  } else {
    alert(result.message || 'Error al eliminar unidad')
  }
}

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

const getStatusLabelFallback = (status) => {
  switch (status) {
    case 'active':
      return 'Operativo en Patio'
    case 'in_maintenance':
      return 'En Mantenimiento'
    case 'out_of_service':
      return 'Fuera de Servicio'
    default:
      return status
  }
}

onMounted(async () => {
  await Promise.all([
    fleetStore.fetchVehicles(),
    fleetStore.fetchVehicleTypes(),
  ])
})
</script>
