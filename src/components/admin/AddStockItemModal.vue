<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden transform transition-all flex flex-col">
      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">
              Registrar Hardware en Bodega
            </h3>
            <p class="text-[11px] text-slate-500">
              Ingreso de nuevos equipos o SIM cards al stock disponible
            </p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMsg" class="mx-5 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start space-x-2">
        <svg class="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
        <!-- Selector de Tipo de Equipo -->
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Tipo de Componente</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="hardwareType = 'gps'"
              class="p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
              :class="hardwareType === 'gps' ? 'bg-teal-50 border-teal-500 text-teal-800 ring-1 ring-teal-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
            >
              <span>🛰️ GPS Tracker 4G</span>
            </button>
            <button
              type="button"
              @click="hardwareType = 'sim'"
              class="p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
              :class="hardwareType === 'sim' ? 'bg-sky-50 border-sky-500 text-sky-800 ring-1 ring-sky-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
            >
              <span>📶 Chip IoT / SIM</span>
            </button>
            <button
              type="button"
              @click="hardwareType = 'fuel_sensor'"
              class="p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
              :class="hardwareType === 'fuel_sensor' ? 'bg-amber-50 border-amber-500 text-amber-800 ring-1 ring-amber-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
            >
              <span>⛽ Sensor Combustible</span>
            </button>
            <button
              type="button"
              @click="hardwareType = 'mdvr'"
              class="p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
              :class="hardwareType === 'mdvr' ? 'bg-indigo-50 border-indigo-500 text-indigo-800 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
            >
              <span>📹 Grabador MDVR</span>
            </button>
          </div>
        </div>

        <!-- Campos según Tipo -->

        <!-- 1. GPS -->
        <template v-if="hardwareType === 'gps'">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Modelo de GPS *</label>
            <input
              v-model="formGps.model"
              type="text"
              required
              placeholder="Ej. Teltonika FMC130 4G"
              class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">N° IMEI (15 dígitos) *</label>
            <input
              v-model="formGps.imei"
              type="text"
              required
              maxlength="20"
              placeholder="Ej. 869201948201955"
              class="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>
        </template>

        <!-- 2. SIM -->
        <template v-if="hardwareType === 'sim'">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">N° de Celular SIM *</label>
            <input
              v-model="formSim.number"
              type="text"
              required
              placeholder="Ej. +51 984 102 999"
              class="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Operador Móvil</label>
            <select
              v-model="formSim.operator"
              class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="Claro IoT">Claro IoT Perú</option>
              <option value="Entel Empresas">Entel Empresas IoT</option>
              <option value="Movistar IoT">Movistar / Telefónica IoT</option>
            </select>
          </div>
        </template>

        <!-- 3. Sensor de Combustible -->
        <template v-if="hardwareType === 'fuel_sensor'">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Modelo de Sensor *</label>
            <input
              v-model="formFuel.model"
              type="text"
              required
              placeholder="Ej. Escort TD-BLE 700mm"
              class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">ID Sensor / MAC BLE *</label>
            <input
              v-model="formFuel.sensor_id"
              type="text"
              required
              placeholder="Ej. BLE-94012"
              class="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>
        </template>

        <!-- 4. MDVR -->
        <template v-if="hardwareType === 'mdvr'">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Modelo de MDVR *</label>
            <input
              v-model="formMdvr.model"
              type="text"
              required
              placeholder="Ej. Howen Hero-ME40 4G"
              class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">N° Serial *</label>
              <input
                v-model="formMdvr.serial"
                type="text"
                required
                placeholder="Ej. HW-89499"
                class="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Canales</label>
              <select
                v-model.number="formMdvr.channels"
                class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option :value="2">2 Canales</option>
                <option :value="4">4 Canales</option>
                <option :value="8">8 Canales</option>
              </select>
            </div>
          </div>
        </template>

        <!-- Footer -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            @click="closeModal"
            class="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Guardar en Bodega</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'saved'])

const hardwareType = ref('gps')
const isSubmitting = ref(false)
const errorMsg = ref('')

const formGps = reactive({
  model: 'Teltonika FMC130 4G',
  imei: '',
})

const formSim = reactive({
  number: '',
  operator: 'Claro IoT',
})

const formFuel = reactive({
  model: 'Escort TD-BLE',
  sensor_id: '',
})

const formMdvr = reactive({
  model: 'Howen Hero-ME40',
  serial: '',
  channels: 4,
})

const closeModal = () => {
  errorMsg.value = ''
  emit('close')
}

const handleSubmit = () => {
  errorMsg.value = ''

  let payload = {
    type: hardwareType.value,
  }

  if (hardwareType.value === 'gps') {
    if (!formGps.imei.trim()) {
      errorMsg.value = 'El N° IMEI es obligatorio.'
      return
    }
    payload.model = formGps.model
    payload.imei = formGps.imei.trim()
  } else if (hardwareType.value === 'sim') {
    if (!formSim.number.trim()) {
      errorMsg.value = 'El número de SIM es obligatorio.'
      return
    }
    payload.number = formSim.number.trim()
    payload.operator = formSim.operator
  } else if (hardwareType.value === 'fuel_sensor') {
    if (!formFuel.sensor_id.trim()) {
      errorMsg.value = 'El ID del sensor es obligatorio.'
      return
    }
    payload.model = formFuel.model
    payload.sensor_id = formFuel.sensor_id.trim()
  } else if (hardwareType.value === 'mdvr') {
    if (!formMdvr.serial.trim()) {
      errorMsg.value = 'El N° Serial del MDVR es obligatorio.'
      return
    }
    payload.model = formMdvr.model
    payload.serial = formMdvr.serial.trim()
    payload.channels = formMdvr.channels
  }

  isSubmitting.value = true

  emit('saved', {
    data: payload,
    setLoading: (val) => { isSubmitting.value = val },
    setError: (msg) => { errorMsg.value = msg },
    resetForm: () => {
      formGps.imei = ''
      formSim.number = ''
      formFuel.sensor_id = ''
      formMdvr.serial = ''
    },
  })
}
</script>