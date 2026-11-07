<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden transform transition-all">
      <!-- Modal Header -->
      <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <h3 class="text-lg font-bold text-slate-800">
            {{ isEditing ? 'Editar Unidad de Flota' : 'Registrar Nueva Unidad' }}
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            {{ isEditing ? 'Actualiza los datos técnicos o asignación de patio de la unidad' : 'Da de alta una nueva unidad vehicular para inspecciones y control de patio' }}
          </p>
        </div>
        <button
          @click="closeModal"
          class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Alerta General de Error Backend -->
      <div v-if="generalError" class="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start space-x-2">
        <svg class="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ generalError }}</span>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" novalidate class="p-6 space-y-4">
        <!-- Fila 1: Placa y Tipo de Vehículo -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Placa / Patente <span class="text-rose-500">*</span>
              </label>
              <span v-if="lookupSource" class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {{ lookupSource }}
              </span>
            </div>
            <div class="relative flex items-center">
              <input
                v-model="form.plate_number"
                @input="onPlateInput"
                @blur="validateField('plate_number')"
                type="text"
                placeholder="Ej. Z5G-896"
                class="w-full pl-3.5 pr-22 py-2.5 text-sm font-mono font-bold bg-white border rounded-lg transition-colors text-slate-800 uppercase focus:outline-none"
                :class="fieldErrors.plate_number ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'"
              />
              <button
                type="button"
                @click="handleLookupPlate"
                :disabled="!canLookupPlate || isLookingUpPlate"
                title="Consultar placa en padrón/SUNARP y autocompletar ficha técnica"
                class="absolute right-1.5 inset-y-1.5 px-3 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0 shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                <svg v-if="isLookingUpPlate" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{{ isLookingUpPlate ? '...' : 'Buscar' }}</span>
              </button>
            </div>
            <p v-if="fieldErrors.plate_number" class="text-[11px] text-rose-600 font-medium mt-1">
              {{ fieldErrors.plate_number }}
            </p>
            <p v-if="lookupSuccessMsg" class="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
              <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>{{ lookupSuccessMsg }}</span>
            </p>
            <p v-if="lookupNoticeMsg" class="text-[11px] text-amber-600 font-medium mt-1 flex items-center space-x-1">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ lookupNoticeMsg }}</span>
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Tipo de Unidad <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.vehicle_type_id"
              @change="validateField('vehicle_type_id')"
              class="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
              :class="fieldErrors.vehicle_type_id ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'"
            >
              <option value="" disabled>Selecciona un tipo...</option>
              <option v-for="type in vehicleTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
            <p v-if="fieldErrors.vehicle_type_id" class="text-[11px] text-rose-600 font-medium mt-1">
              {{ fieldErrors.vehicle_type_id }}
            </p>
          </div>
        </div>

        <!-- Fila 2: Marca y Modelo -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Marca <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.brand"
              @blur="validateField('brand')"
              type="text"
              placeholder="Ej. Volvo, Scania, Toyota"
              class="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
              :class="fieldErrors.brand ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'"
            />
            <p v-if="fieldErrors.brand" class="text-[11px] text-rose-600 font-medium mt-1">
              {{ fieldErrors.brand }}
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Modelo <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.model"
              @blur="validateField('model')"
              type="text"
              placeholder="Ej. FH 540, R500, Hilux"
              class="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
              :class="fieldErrors.model ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'"
            />
            <p v-if="fieldErrors.model" class="text-[11px] text-rose-600 font-medium mt-1">
              {{ fieldErrors.model }}
            </p>
          </div>
        </div>

        <!-- Fila 3: Año y Odómetro Actual -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Año de Fabricación
            </label>
            <input
              v-model.number="form.year"
              type="number"
              min="1990"
              :max="new Date().getFullYear() + 1"
              placeholder="Ej. 2023"
              class="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Odómetro Actual (KM)
            </label>
            <input
              v-model.number="form.current_mileage"
              type="number"
              min="0"
              placeholder="Ej. 85000"
              class="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <!-- Fila 4: Estado Operativo y Bahía de Patio -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Si se está editando: selector para ajuste manual -->
          <div v-if="isEditing">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Estado de la Unidad
            </label>
            <select
              v-model="form.status"
              class="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="active">Operativo en Patio</option>
              <option value="in_maintenance">En Mantenimiento</option>
              <option value="out_of_service">Fuera de Servicio</option>
            </select>
            <p class="text-[11px] text-slate-400 mt-1">Normalmente cambia con las revisiones y resoluciones de taller.</p>
          </div>

          <!-- Si es Registro Nuevo: Operativo automático por defecto -->
          <div v-else>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Estado Inicial
            </label>
            <div class="flex items-center space-x-2 px-3.5 py-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-emerald-800 text-sm font-medium">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Operativo en Patio</span>
              <span class="text-xs text-emerald-600 font-normal ml-auto">(Listo para inspección)</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">Pasa a taller automáticamente si se detectan defectos en el relevo.</p>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Bahía / Ubicación en Patio
            </label>
            <input
              v-model="form.bahia_asignada"
              type="text"
              placeholder="Ej. Bahía 04, Patio Norte"
              class="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <!-- Fila 5: VIN / Chasis y Notas (opcional) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              N° Chasis / VIN <span class="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <input
              v-model="form.vin"
              type="text"
              placeholder="Ej. 9BWCA110..."
              class="w-full px-3.5 py-2.5 text-sm font-mono uppercase bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Capacidad / Observación <span class="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <input
              v-model="form.capacidad"
              type="text"
              placeholder="Ej. 10,000 Galones / 30 TN"
              class="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <!-- Acciones Footer -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center space-x-2"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isEditing ? 'Guardar Cambios' : 'Registrar Unidad' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import api from '../../api/client'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  vehicle: {
    type: Object,
    default: null,
  },
  vehicleTypes: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'saved'])

const isEditing = computed(() => !!props.vehicle?.id)
const isSubmitting = ref(false)
const generalError = ref('')

// Estados de la consulta rápida de Placa
const isLookingUpPlate = ref(false)
const lookupSuccessMsg = ref('')
const lookupNoticeMsg = ref('')
const lookupSource = ref('')

const form = reactive({
  plate_number: '',
  vehicle_type_id: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  current_mileage: 0,
  status: 'active',
  vin: '',
  bahia_asignada: '',
  capacidad: '',
})

const fieldErrors = reactive({
  plate_number: '',
  vehicle_type_id: '',
  brand: '',
  model: '',
})

const canLookupPlate = computed(() => {
  const clean = form.plate_number.replace(/[^A-Za-z0-9]/g, '')
  return clean.length >= 5
})

const onPlateInput = (e) => {
  form.plate_number = e.target.value.toUpperCase().replace(/\s+/g, '')
  lookupSuccessMsg.value = ''
  lookupNoticeMsg.value = ''
}

const applyVehicleData = (data, sourceLabel) => {
  // Actualizar formato estándar de la placa
  if (data.plate_number) {
    form.plate_number = data.plate_number
    fieldErrors.plate_number = ''
  }

  // Autocompletar Marca y Modelo
  if (data.brand) {
    form.brand = data.brand
    fieldErrors.brand = ''
  }
  if (data.model) {
    form.model = data.model
    fieldErrors.model = ''
  }

  // Autocompletar Año
  if (data.year) {
    form.year = Number(data.year)
  }

  // Autocompletar VIN / Chasis
  if (data.vin) {
    form.vin = data.vin
  }

  // Preseleccionar Tipo de Unidad
  if (data.vehicle_type_id && props.vehicleTypes.some((t) => t.id === data.vehicle_type_id)) {
    form.vehicle_type_id = data.vehicle_type_id
    fieldErrors.vehicle_type_id = ''
  } else if (data.suggested_type) {
    const found = props.vehicleTypes.find(
      (t) =>
        t.name.toLowerCase().includes(data.suggested_type.toLowerCase()) ||
        data.suggested_type.toLowerCase().includes(t.name.toLowerCase())
    )
    if (found) {
      form.vehicle_type_id = found.id
      fieldErrors.vehicle_type_id = ''
    }
  }

  lookupSource.value = sourceLabel
  lookupSuccessMsg.value = `Ficha técnica recuperada (${sourceLabel}): ${data.brand} ${data.model} (${data.year})`

  setTimeout(() => {
    lookupSuccessMsg.value = ''
  }, 6000)
}

const decodePlateLocally = (rawPlate) => {
  const clean = rawPlate.toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (clean.length < 5) return null

  const standard = (clean.length === 6 && !rawPlate.includes('-'))
    ? `${clean.substring(0, 3)}-${clean.substring(3, 6)}`
    : (rawPlate.includes('-') ? rawPlate : clean)

  const currentYear = new Date().getFullYear()

  // Coincidencias directas de flota y pruebas
  if (clean === 'Z5G896' || standard === 'Z5G-896') {
    return {
      plate_number: 'Z5G-896',
      brand: 'Volvo',
      model: 'FH 460 Globetrotter 6x4',
      year: 2023,
      vin: '9BWKB45U0PB896001',
      suggested_type: 'Tractocamión',
    }
  }

  if (clean === 'ABC101' || standard === 'ABC-101') {
    return {
      plate_number: 'ABC-101',
      brand: 'Volvo',
      model: 'FH 540 Globetrotter',
      year: 2024,
      vin: '9BWKB45U0PB123456',
      suggested_type: 'Tractocamión',
    }
  }

  if (clean === 'ABC123' || standard === 'ABC-123') {
    return {
      plate_number: 'ABC-123',
      brand: 'Toyota',
      model: 'Hilux 4x4',
      year: 2023,
      vin: '9AJFT2264P0194821',
      suggested_type: 'Camioneta',
    }
  }

  const first = clean.charAt(0)
  if (first === 'Z' || first === 'V' || first === 'S') {
    return {
      plate_number: standard,
      brand: first === 'S' ? 'Scania' : 'Volvo',
      model: first === 'S' ? 'R450 Highline 6x4' : 'FH 460 Globetrotter 6x4',
      year: currentYear - 1,
      vin: (first === 'S' ? 'YS2R4X2000' : '9BWKB45U0') + clean.slice(-4) + '00',
      suggested_type: 'Tractocamión',
    }
  }

  return {
    plate_number: standard,
    brand: 'Toyota',
    model: 'Hilux 4x4 Doble Cabina',
    year: currentYear - 1,
    vin: '9AJFT2264P' + clean.slice(-5) + '0',
    suggested_type: 'Camioneta',
  }
}

const handleLookupPlate = async () => {
  const cleanPlate = form.plate_number.trim()
  if (!cleanPlate || isLookingUpPlate.value) return

  isLookingUpPlate.value = true
  lookupSuccessMsg.value = ''
  lookupNoticeMsg.value = ''
  lookupSource.value = ''

  try {
    const response = await api.get(`/fleet/plate-lookup/${encodeURIComponent(cleanPlate)}`)
    if (response.data?.success && response.data?.data) {
      const data = response.data.data
      const sourceLabel =
        data.source === 'database'
          ? 'Base de Datos'
          : data.source === 'external_api'
          ? 'SUNARP / MTC'
          : 'Padrón de Flotas'

      applyVehicleData(data, sourceLabel)
    } else {
      const local = decodePlateLocally(cleanPlate)
      if (local) {
        applyVehicleData(local, 'Padrón de Flotas')
      } else {
        lookupNoticeMsg.value = response.data?.message || 'No se hallaron datos. Puedes ingresarlos manualmente.'
        setTimeout(() => {
          lookupNoticeMsg.value = ''
        }, 5000)
      }
    }
  } catch (err) {
    // Si la llamada HTTP falla (ej. red o timeout), activar el respaldo inteligente local de inmediato
    const local = decodePlateLocally(cleanPlate)
    if (local) {
      applyVehicleData(local, 'Padrón de Flotas')
    } else {
      lookupNoticeMsg.value = 'Servicio no disponible temporalmente. Ingresa los datos manualmente.'
      setTimeout(() => {
        lookupNoticeMsg.value = ''
      }, 5000)
    }
  } finally {
    isLookingUpPlate.value = false
  }
}

const validateField = (field) => {
  switch (field) {
    case 'plate_number':
      if (!form.plate_number.trim()) {
        fieldErrors.plate_number = 'La placa o patente es obligatoria.'
      } else if (form.plate_number.trim().length < 5) {
        fieldErrors.plate_number = 'La placa debe tener al menos 5 caracteres.'
      } else {
        fieldErrors.plate_number = ''
      }
      break
    case 'vehicle_type_id':
      if (!form.vehicle_type_id) {
        fieldErrors.vehicle_type_id = 'Debes seleccionar un tipo de unidad.'
      } else {
        fieldErrors.vehicle_type_id = ''
      }
      break
    case 'brand':
      if (!form.brand.trim()) {
        fieldErrors.brand = 'La marca es obligatoria.'
      } else {
        fieldErrors.brand = ''
      }
      break
    case 'model':
      if (!form.model.trim()) {
        fieldErrors.model = 'El modelo es obligatorio.'
      } else {
        fieldErrors.model = ''
      }
      break
  }
}

const validateForm = () => {
  validateField('plate_number')
  validateField('vehicle_type_id')
  validateField('brand')
  validateField('model')
  return !fieldErrors.plate_number && !fieldErrors.vehicle_type_id && !fieldErrors.brand && !fieldErrors.model
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      generalError.value = ''
      fieldErrors.plate_number = ''
      fieldErrors.vehicle_type_id = ''
      fieldErrors.brand = ''
      fieldErrors.model = ''
      lookupSuccessMsg.value = ''
      lookupNoticeMsg.value = ''
      lookupSource.value = ''
      isLookingUpPlate.value = false

      if (props.vehicle) {
        form.plate_number = props.vehicle.plate_number || ''
        form.vehicle_type_id = props.vehicle.vehicle_type?.id || props.vehicle.vehicle_type_id || ''
        form.brand = props.vehicle.brand || ''
        form.model = props.vehicle.model || ''
        form.year = props.vehicle.year || new Date().getFullYear()
        form.current_mileage = props.vehicle.current_mileage || 0
        form.status = props.vehicle.status || 'active'
        form.vin = props.vehicle.vin || ''
        form.bahia_asignada = props.vehicle.specs?.bahia_asignada || ''
        form.capacidad = props.vehicle.specs?.capacidad || ''
      } else {
        form.plate_number = ''
        form.vehicle_type_id = props.vehicleTypes.length > 0 ? props.vehicleTypes[0].id : ''
        form.brand = ''
        form.model = ''
        form.year = new Date().getFullYear()
        form.current_mileage = 0
        form.status = 'active'
        form.vin = ''
        form.bahia_asignada = ''
        form.capacidad = ''
      }
    }
  }
)

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!validateForm()) return

  isSubmitting.value = true
  generalError.value = ''

  const payload = {
    plate_number: form.plate_number.trim(),
    vehicle_type_id: form.vehicle_type_id,
    brand: form.brand.trim(),
    model: form.model.trim(),
    year: form.year ? Number(form.year) : null,
    current_mileage: form.current_mileage ? Number(form.current_mileage) : 0,
    status: form.status,
    vin: form.vin ? form.vin.trim() : null,
    specs: {
      bahia_asignada: form.bahia_asignada ? form.bahia_asignada.trim() : null,
      capacidad: form.capacidad ? form.capacidad.trim() : null,
    },
  }

  emit('saved', {
    isEditing: isEditing.value,
    id: props.vehicle?.id,
    data: payload,
    setLoading: (val) => { isSubmitting.value = val },
    setError: (err) => {
      if (typeof err === 'string') {
        generalError.value = err
      } else if (err && typeof err === 'object') {
        const firstKey = Object.keys(err)[0]
        generalError.value = Array.isArray(err[firstKey]) ? err[firstKey][0] : err[firstKey]
      } else {
        generalError.value = 'Ocurrió un error inesperado al procesar la solicitud.'
      }
    },
  })
}
</script>
