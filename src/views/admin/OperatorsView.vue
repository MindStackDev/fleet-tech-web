<template>
  <div class="space-y-6">
    <!-- Encabezado de la Sección -->
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Equipo y Personal de Patio</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Gestión de inspectores de flota, técnicos instaladores de GPS/sensores y supervisores de patio
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center space-x-2 self-start sm:self-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>+ Nuevo Colaborador</span>
      </button>
    </div>

    <!-- Banner de Feedback -->
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

    <!-- Métricas del Personal Operativo -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Equipo</p>
        <h4 class="text-2xl font-black text-slate-800 mt-1">{{ stats.total }}</h4>
        <p class="text-[11px] text-slate-400 mt-0.5">Colaboradores registrados</p>
      </div>

      <div class="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Inspectores de Patio</p>
          <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
        </div>
        <h4 class="text-2xl font-black text-sky-700 mt-1">{{ stats.inspectors }}</h4>
        <p class="text-[11px] text-sky-600/70 mt-0.5">Auditoría física y checklists</p>
      </div>

      <div class="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
        <p class="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Técnicos GPS / Taller</p>
        <h4 class="text-2xl font-black text-amber-700 mt-1">{{ stats.technicians }}</h4>
        <p class="text-[11px] text-amber-600/70 mt-0.5">Instalación y soporte técnico</p>
      </div>

      <div class="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs">
        <p class="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Turno Mañana</p>
        <h4 class="text-2xl font-black text-indigo-700 mt-1">{{ stats.morningShift }}</h4>
        <p class="text-[11px] text-indigo-600/70 mt-0.5">Jornada 06:00 - 14:00</p>
      </div>
    </div>

    <!-- Barra de Búsqueda y Filtros -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <!-- Input de Búsqueda -->
      <div class="flex-1 max-w-md relative">
        <input
          v-model="searchTerm"
          @input="handleSearch"
          type="text"
          placeholder="Buscar por nombre, DNI, correo, celular o especialidad..."
          class="w-full px-3.5 py-2 pl-9 bg-slate-50 border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Filtros por Rol, Turno y Estado -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Selector de Rol -->
        <select
          v-model="filterRole"
          @change="handleFilter"
          class="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-sky-500"
        >
          <option value="">Todos los roles</option>
          <option value="operator">Inspectores de Patio</option>
          <option value="technician">Técnicos Mecánicos</option>
          <option value="supervisor">Supervisores de Operaciones</option>
        </select>

        <!-- Selector de Turno -->
        <select
          v-model="filterShift"
          @change="handleFilter"
          class="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-sky-500"
        >
          <option value="">Todos los turnos</option>
          <option value="morning">Turno Mañana</option>
          <option value="afternoon">Turno Tarde</option>
          <option value="night">Turno Noche</option>
          <option value="any">Rotativo</option>
        </select>

        <!-- Selector de Estado -->
        <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            @click="filterStatus = ''; handleFilter()"
            class="px-2.5 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === '' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
          >
            Todos
          </button>
          <button
            @click="filterStatus = 'active'; handleFilter()"
            class="px-2.5 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === 'active' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
          >
            Activos
          </button>
          <button
            @click="filterStatus = 'inactive'; handleFilter()"
            class="px-2.5 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === 'inactive' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
          >
            Suspendidos
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla del Personal de Patio -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <!-- Loading State -->
      <div v-if="operatorStore.loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        <p class="text-xs text-slate-500 mt-2">Cargando personal de patio...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="operatorStore.operators.length === 0" class="py-12 text-center">
        <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h4 class="text-sm font-semibold text-slate-700">No se encontraron colaboradores registrados</h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          No hay personal con los filtros aplicados. Puedes agregar un nuevo inspector o técnico haciendo clic en "+ Nuevo Colaborador".
        </p>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th class="py-3 px-4">Colaborador / Personal</th>
              <th class="py-3 px-4">DNI / Documento</th>
              <th class="py-3 px-4">Rol Operativo & Especialidad</th>
              <th class="py-3 px-4">Turno Asignado</th>
              <th class="py-3 px-4">Contacto / Celular</th>
              <th class="py-3 px-4 text-center">Auditorías / Relevos</th>
              <th class="py-3 px-4 text-center">Estado</th>
              <th class="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr
              v-for="op in operatorStore.operators"
              :key="op.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <!-- Nombre, Avatar y Correo -->
              <td class="py-3.5 px-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs shrink-0 shadow-xs"
                    :class="getAvatarClass(op.role)"
                  >
                    {{ getInitials(op.name) }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-800">{{ op.name }}</p>
                    <p class="text-[11px] text-slate-400 font-mono">{{ op.email }}</p>
                  </div>
                </div>
              </td>

              <!-- DNI -->
              <td class="py-3.5 px-4">
                <span v-if="op.dni" class="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {{ op.dni }}
                </span>
                <span v-else class="text-slate-400 italic">No registrado</span>
              </td>

              <!-- Rol Operativo & Especialidad -->
              <td class="py-3.5 px-4">
                <div class="space-y-0.5">
                  <span
                    class="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full"
                    :class="getRoleBadgeClass(op.role)"
                  >
                    {{ op.role_label || getRoleLabel(op.role) }}
                  </span>
                  <p v-if="op.notes" class="text-[11px] text-slate-500 truncate max-w-[200px]" :title="op.notes">
                    {{ op.notes }}
                  </p>
                </div>
              </td>

              <!-- Turno Asignado -->
              <td class="py-3.5 px-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium" :class="getShiftBadgeClass(op.shift)">
                  {{ getShiftLabel(op.shift) }}
                </span>
              </td>

              <!-- Teléfono y Contacto -->
              <td class="py-3.5 px-4">
                <p class="text-slate-700 font-medium">{{ op.phone || 'Sin celular' }}</p>
                <p v-if="op.emergency_contact" class="text-[10px] text-slate-400 truncate max-w-[150px]" :title="op.emergency_contact">
                  Emerg: {{ op.emergency_contact }}
                </p>
              </td>

              <!-- Conteo de Inspecciones -->
              <td class="py-3.5 px-4 text-center">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                  {{ (op.performed_inspections_count ?? 0) + (op.received_inspections_count ?? 0) }} relevos
                </span>
              </td>

              <!-- Estado -->
              <td class="py-3.5 px-4 text-center">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  :class="op.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="op.is_active ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                  {{ op.is_active ? 'Activo' : 'Suspendido' }}
                </span>
              </td>

              <!-- Acciones -->
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end space-x-1.5">
                  <button
                    @click="openEditModal(op)"
                    class="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded transition-colors"
                    title="Editar ficha"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  <button
                    @click="handleToggleStatus(op)"
                    class="p-1.5 rounded transition-colors"
                    :class="op.is_active ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'"
                    :title="op.is_active ? 'Suspender personal' : 'Habilitar personal'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>

                  <button
                    @click="handleDelete(op)"
                    class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Eliminar colaborador"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Creación / Edición -->
    <OperatorModal
      :show="showModal"
      :operator="selectedOperator"
      @close="closeModal"
      @saved="handleSaveOperator"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOperatorStore } from '../../stores/operators'
import OperatorModal from '../../components/admin/OperatorModal.vue'

const operatorStore = useOperatorStore()

const searchTerm = ref('')
const filterStatus = ref('')
const filterShift = ref('')
const filterRole = ref('')
const feedbackMessage = ref('')

const showModal = ref(false)
const selectedOperator = ref(null)

const stats = computed(() => {
  const list = operatorStore.operators || []
  const total = list.length
  const inspectors = list.filter(o => o.role === 'operator').length
  const technicians = list.filter(o => o.role === 'technician').length
  const morningShift = list.filter(o => o.shift === 'morning').length

  return { total, inspectors, technicians, morningShift }
})

let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    operatorStore.fetchOperators(searchTerm.value, filterStatus.value, filterShift.value, filterRole.value)
  }, 300)
}

const handleFilter = () => {
  operatorStore.fetchOperators(searchTerm.value, filterStatus.value, filterShift.value, filterRole.value)
}

const openCreateModal = () => {
  selectedOperator.value = null
  showModal.value = true
}

const openEditModal = (op) => {
  selectedOperator.value = { ...op }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedOperator.value = null
}

const handleSaveOperator = async ({ isEditing, id, data, setLoading, setError }) => {
  let result
  if (isEditing) {
    result = await operatorStore.updateOperator(id, data)
  } else {
    result = await operatorStore.createOperator(data)
  }

  setLoading(false)

  if (result.success) {
    closeModal()
    feedbackMessage.value = isEditing
      ? `Ficha de ${data.name} actualizada correctamente.`
      : `Colaborador ${data.name} registrado con éxito.`
    setTimeout(() => {
      feedbackMessage.value = ''
    }, 5000)
  } else {
    setError(result.errors || result.message)
  }
}

const handleToggleStatus = async (op) => {
  const result = await operatorStore.toggleStatus(op.id)
  if (result.success) {
    feedbackMessage.value = `Estado de ${op.name} actualizado.`
    setTimeout(() => { feedbackMessage.value = '' }, 3000)
  }
}

const handleDelete = async (op) => {
  const confirmDel = window.confirm(`¿Estás seguro de que deseas eliminar o dar de baja a ${op.name}?`)
  if (!confirmDel) return

  const result = await operatorStore.deleteOperator(op.id)
  if (result.success) {
    feedbackMessage.value = result.message || `Registro de ${op.name} procesado correctamente.`
    setTimeout(() => { feedbackMessage.value = '' }, 4000)
  } else {
    alert(result.message || 'Error al eliminar registro')
  }
}

const getInitials = (name) => {
  if (!name) return 'OP'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return parts[0].substring(0, 2).toUpperCase()
}

const getAvatarClass = (role) => {
  switch (role) {
    case 'supervisor':
      return 'bg-purple-100 text-purple-800 border border-purple-200'
    case 'technician':
      return 'bg-amber-100 text-amber-800 border border-amber-200'
    default:
      return 'bg-sky-100 text-sky-800 border border-sky-200'
  }
}

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'supervisor':
      return 'bg-purple-50 text-purple-700 border border-purple-200'
    case 'technician':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    default:
      return 'bg-sky-50 text-sky-700 border border-sky-200'
  }
}

const getRoleLabel = (role) => {
  switch (role) {
    case 'supervisor':
      return 'Supervisor de Operaciones'
    case 'technician':
      return 'Técnico Instalador / Mecánico'
    case 'operator':
      return 'Inspector de Patio'
    default:
      return role
  }
}

const getShiftLabel = (shift) => {
  switch (shift) {
    case 'morning':
      return 'Mañana (06-14h)'
    case 'afternoon':
      return 'Tarde (14-22h)'
    case 'night':
      return 'Noche (22-06h)'
    case 'any':
      return 'Rotativo'
    default:
      return 'Mañana'
  }
}

const getShiftBadgeClass = (shift) => {
  switch (shift) {
    case 'morning':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'afternoon':
      return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'night':
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

onMounted(() => {
  operatorStore.fetchOperators()
})
</script>
