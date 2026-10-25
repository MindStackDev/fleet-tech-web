<template>
  <div class="space-y-6">
    <!-- Encabezado de la Sección -->
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Directorio de Operadores de Patio</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Gestiona los accesos, estados y datos del personal conductor y de relevo
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center space-x-2 self-start sm:self-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>+ Nuevo Operador</span>
      </button>
    </div>

    <!-- Barra de Búsqueda y Filtros -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div class="flex-1 max-w-md relative">
        <input
          v-model="searchTerm"
          @input="handleSearch"
          type="text"
          placeholder="Buscar por nombre, correo o teléfono..."
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
            @click="filterStatus = ''; handleFilter()"
            class="px-3 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === '' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Todos
          </button>
          <button
            @click="filterStatus = 'active'; handleFilter()"
            class="px-3 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === 'active' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Activos
          </button>
          <button
            @click="filterStatus = 'inactive'; handleFilter()"
            class="px-3 py-1 rounded-md font-medium transition-colors"
            :class="filterStatus === 'inactive' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Inactivos
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de Operadores -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <!-- Loading State -->
      <div v-if="operatorStore.loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        <p class="text-xs text-slate-500 mt-2">Cargando operadores...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="operatorStore.operators.length === 0" class="py-12 text-center">
        <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h4 class="text-sm font-semibold text-slate-700">No se encontraron operadores</h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          No hay operadores registrados con los filtros aplicados. Puedes agregar uno nuevo haciendo clic en "+ Nuevo Operador".
        </p>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th class="py-3 px-4">Operador</th>
              <th class="py-3 px-4">Correo (Usuario)</th>
              <th class="py-3 px-4">Teléfono</th>
              <th class="py-3 px-4 text-center">Inspecciones Realizadas</th>
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
              <!-- Nombre y Avatar -->
              <td class="py-3.5 px-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                    {{ getInitials(op.name) }}
                  </div>
                  <div>
                    <p class="font-semibold text-slate-800">{{ op.name }}</p>
                    <p class="text-[11px] text-slate-400">ID #{{ op.id }}</p>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="py-3.5 px-4 font-mono text-slate-600">
                {{ op.email }}
              </td>

              <!-- Teléfono -->
              <td class="py-3.5 px-4 text-slate-600">
                {{ op.phone || 'No registrado' }}
              </td>

              <!-- Conteo de Inspecciones -->
              <td class="py-3.5 px-4 text-center">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                  {{ op.performed_inspections_count ?? 0 }} relevos
                </span>
              </td>

              <!-- Estado -->
              <td class="py-3.5 px-4 text-center">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  :class="op.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="op.is_active ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                  {{ op.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <!-- Acciones -->
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="openEditModal(op)"
                    class="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded transition-colors"
                    title="Editar datos"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  <button
                    @click="handleToggleStatus(op)"
                    class="p-1.5 rounded transition-colors"
                    :class="op.is_active ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'"
                    :title="op.is_active ? 'Suspender operador' : 'Habilitar operador'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
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
import { ref, onMounted } from 'vue'
import { useOperatorStore } from '../../stores/operators'
import OperatorModal from '../../components/admin/OperatorModal.vue'

const operatorStore = useOperatorStore()

const searchTerm = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const selectedOperator = ref(null)

let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    operatorStore.fetchOperators(searchTerm.value, filterStatus.value)
  }, 350)
}

const handleFilter = () => {
  operatorStore.fetchOperators(searchTerm.value, filterStatus.value)
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
  } else {
    setError(result.errors || result.message)
  }
}

const handleToggleStatus = async (op) => {
  await operatorStore.toggleStatus(op.id)
}

const getInitials = (name) => {
  if (!name) return 'OP'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return parts[0].substring(0, 2).toUpperCase()
}

onMounted(() => {
  operatorStore.fetchOperators()
})
</script>
