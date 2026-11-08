<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-800">
              Certificación de Hardware Telemático
            </h3>
            <p class="text-xs text-slate-500">
              Unidad: <span class="font-mono font-bold text-slate-800">{{ vehicle?.plate_number }}</span> • {{ vehicle?.brand }} {{ vehicle?.model }}
            </p>
          </div>
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

      <!-- Error Alert -->
      <div v-if="generalError" class="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start space-x-2 shrink-0">
        <svg class="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ generalError }}</span>
      </div>

      <!-- Body / Formulario -->
      <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto space-y-5 flex-1">
        <!-- SECCIÓN 1: GPS PRINCIPAL -->
        <div class="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">1. Dispositivo GPS Tracker 4G</h4>
            </div>
            <span class="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Obligatorio en Flota
            </span>
          </div>

          <!-- Selector rápido de stock GPS -->
          <div v-if="availableGpsList.length > 0" class="p-2.5 bg-teal-50/60 border border-teal-200/70 rounded-lg">
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-teal-900 flex items-center space-x-1">
                <span>📦 Seleccionar GPS disponible en Bodega</span>
              </label>
              <span class="text-[10px] font-semibold text-teal-700 bg-white px-1.5 py-0.5 rounded border border-teal-200">
                {{ availableGpsList.length }} en stock
              </span>
            </div>
            <select
              v-model="selectedStockGpsId"
              @change="onSelectStockGps"
              class="w-full px-2.5 py-1.5 text-xs bg-white border border-teal-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
            >
              <option value="">-- Asignar desde stock de bodega (o escribe abajo) --</option>
              <option v-for="item in availableGpsList" :key="item.id" :value="item.id">
                {{ item.model }} • IMEI: {{ item.imei }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Modelo de GPS</label>
              <input
                v-model="form.gps_model"
                type="text"
                placeholder="Ej. Teltonika FMC130 4G"
                class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">N° IMEI (15 dígitos)</label>
              <input
                v-model="form.gps_imei"
                type="text"
                placeholder="Ej. 869201948201948"
                class="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <!-- Selector rápido de stock SIM -->
          <div v-if="availableSimList.length > 0" class="p-2.5 bg-sky-50/60 border border-sky-200/70 rounded-lg mt-2">
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-sky-900 flex items-center space-x-1">
                <span>📶 Seleccionar Chip IoT disponible en Bodega</span>
              </label>
              <span class="text-[10px] font-semibold text-sky-700 bg-white px-1.5 py-0.5 rounded border border-sky-200">
                {{ availableSimList.length }} en stock
              </span>
            </div>
            <select
              v-model="selectedStockSimId"
              @change="onSelectStockSim"
              class="w-full px-2.5 py-1.5 text-xs bg-white border border-sky-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
            >
              <option value="">-- Asignar chip desde bodega (o escribe abajo) --</option>
              <option v-for="item in availableSimList" :key="item.id" :value="item.id">
                {{ item.number }} • {{ item.operator }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">N° Celular SIM / Chip IoT</label>
              <input
                v-model="form.sim_number"
                type="text"
                placeholder="Ej. +51 984 102 931"
                class="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Operador Móvil</label>
              <select
                v-model="form.sim_operator"
                class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
              >
                <option value="Claro IoT">Claro IoT Perú</option>
                <option value="Entel Empresas">Entel Empresas IoT</option>
                <option value="Movistar IoT">Movistar / Telefónica IoT</option>
              </select>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 2: SENSOR DE COMBUSTIBLE -->
        <div class="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">2. Sensor de Combustible BLE</h4>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.fuel_sensor_installed" class="sr-only peer">
              <div class="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              <span class="ml-2 text-[11px] font-bold text-slate-700">{{ form.fuel_sensor_installed ? 'Instalado' : 'No instalado' }}</span>
            </label>
          </div>

          <!-- Selector rápido de stock Sensor -->
          <div v-if="form.fuel_sensor_installed && availableFuelList.length > 0" class="p-2.5 bg-amber-50/60 border border-amber-200/70 rounded-lg">
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1">
                <span>⛽ Seleccionar Sensor BLE de Bodega</span>
              </label>
              <span class="text-[10px] font-semibold text-amber-700 bg-white px-1.5 py-0.5 rounded border border-amber-200">
                {{ availableFuelList.length }} en stock
              </span>
            </div>
            <select
              v-model="selectedStockFuelId"
              @change="onSelectStockFuel"
              class="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="">-- Asignar desde stock de bodega (o escribe abajo) --</option>
              <option v-for="item in availableFuelList" :key="item.id" :value="item.id">
                {{ item.model }} • ID: {{ item.sensor_id }}
              </option>
            </select>
          </div>

          <div v-if="form.fuel_sensor_installed" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Modelo Sensor</label>
              <input
                v-model="form.fuel_sensor_model"
                type="text"
                placeholder="Ej. Escort TD-BLE"
                class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">ID Sensor / MAC</label>
              <input
                v-model="form.fuel_sensor_id"
                type="text"
                placeholder="Ej. BLE-74921"
                class="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Última Calibración</label>
              <input
                v-model="form.fuel_sensor_calibration"
                type="date"
                class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <!-- SECCIÓN 3: CÁMARA MDVR & SEGURIDAD -->
        <div class="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">3. Video-Telemetría MDVR & Corte</h4>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.mdvr_installed" class="sr-only peer">
              <div class="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
              <span class="ml-2 text-[11px] font-bold text-slate-700">{{ form.mdvr_installed ? 'Con MDVR' : 'Sin MDVR' }}</span>
            </label>
          </div>

          <!-- Selector rápido de stock MDVR -->
          <div v-if="form.mdvr_installed && availableMdvrList.length > 0" class="p-2.5 bg-indigo-50/60 border border-indigo-200/70 rounded-lg">
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-indigo-900 flex items-center space-x-1">
                <span>📹 Seleccionar Grabador MDVR de Bodega</span>
              </label>
              <span class="text-[10px] font-semibold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
                {{ availableMdvrList.length }} en stock
              </span>
            </div>
            <select
              v-model="selectedStockMdvrId"
              @change="onSelectStockMdvr"
              class="w-full px-2.5 py-1.5 text-xs bg-white border border-indigo-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              <option value="">-- Asignar desde stock de bodega (o escribe abajo) --</option>
              <option v-for="item in availableMdvrList" :key="item.id" :value="item.id">
                {{ item.model }} • S/N: {{ item.serial }} ({{ item.channels }} canales)
              </option>
            </select>
          </div>

          <div v-if="form.mdvr_installed" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Modelo MDVR</label>
              <input
                v-model="form.mdvr_model"
                type="text"
                placeholder="Ej. Howen Hero-ME40"
                class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">N° Serial MDVR</label>
              <input
                v-model="form.mdvr_serial"
                type="text"
                placeholder="Ej. HW-89410"
                class="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Canales</label>
              <select
                v-model.number="form.mdvr_channels"
                class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
              >
                <option :value="2">2 Canales (Frontal + Cabina)</option>
                <option :value="4">4 Canales (360° + Carga)</option>
                <option :value="8">8 Canales Full Flota</option>
              </select>
            </div>
          </div>

          <!-- Periféricos Adicionales -->
          <div class="grid grid-cols-2 gap-3 pt-2">
            <label class="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 cursor-pointer">
              <input type="checkbox" v-model="form.panic_button_installed" class="w-4 h-4 text-sky-600 rounded">
              <span>Botón de Pánico Oculto</span>
            </label>
            <label class="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 cursor-pointer">
              <input type="checkbox" v-model="form.relay_installed" class="w-4 h-4 text-sky-600 rounded">
              <span>Relé Corta-Corriente</span>
            </label>
          </div>
        </div>

        <!-- Observaciones -->
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Notas de Certificación y Ubicación de Antenas</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Ej. Antena GPS montada bajo el torpedo con línea de vista despejada. Sensor calibrado con vara graduada."
            class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
          ></textarea>
        </div>

        <!-- Footer -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3 shrink-0">
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
            class="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center space-x-2"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Guardar y Certificar Hardware</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useTelematicsStore } from '../../stores/telematics'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  vehicle: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'saved'])

const telematicsStore = useTelematicsStore()

const isSubmitting = ref(false)
const generalError = ref('')

const selectedStockGpsId = ref('')
const selectedStockSimId = ref('')
const selectedStockFuelId = ref('')
const selectedStockMdvrId = ref('')

const availableGpsList = computed(() => telematicsStore.availableForAssignment.gps || [])
const availableSimList = computed(() => telematicsStore.availableForAssignment.sims || [])
const availableFuelList = computed(() => telematicsStore.availableForAssignment.fuel_sensors || [])
const availableMdvrList = computed(() => telematicsStore.availableForAssignment.mdvrs || [])

const onSelectStockGps = () => {
  if (!selectedStockGpsId.value) return
  const item = availableGpsList.value.find((g) => g.id === selectedStockGpsId.value)
  if (item) {
    form.gps_model = item.model || form.gps_model
    form.gps_imei = item.imei || ''
  }
}

const onSelectStockSim = () => {
  if (!selectedStockSimId.value) return
  const item = availableSimList.value.find((s) => s.id === selectedStockSimId.value)
  if (item) {
    form.sim_number = item.number || ''
    form.sim_operator = item.operator || 'Claro IoT'
  }
}

const onSelectStockFuel = () => {
  if (!selectedStockFuelId.value) return
  const item = availableFuelList.value.find((f) => f.id === selectedStockFuelId.value)
  if (item) {
    form.fuel_sensor_installed = true
    form.fuel_sensor_model = item.model || 'Escort TD-BLE'
    form.fuel_sensor_id = item.sensor_id || ''
  }
}

const onSelectStockMdvr = () => {
  if (!selectedStockMdvrId.value) return
  const item = availableMdvrList.value.find((m) => m.id === selectedStockMdvrId.value)
  if (item) {
    form.mdvr_installed = true
    form.mdvr_model = item.model || 'Howen Hero-ME40'
    form.mdvr_serial = item.serial || ''
    form.mdvr_channels = item.channels || 4
  }
}

const form = reactive({
  gps_model: '',
  gps_imei: '',
  sim_number: '',
  sim_operator: 'Claro IoT',
  gps_status: 'online',
  fuel_sensor_installed: false,
  fuel_sensor_model: 'Escort TD-BLE',
  fuel_sensor_id: '',
  fuel_sensor_calibration: '',
  mdvr_installed: false,
  mdvr_model: 'Howen Hero-ME40',
  mdvr_serial: '',
  mdvr_channels: 4,
  panic_button_installed: true,
  relay_installed: true,
  notes: '',
})

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      telematicsStore.fetchStock()
      selectedStockGpsId.value = ''
      selectedStockSimId.value = ''
      selectedStockFuelId.value = ''
      selectedStockMdvrId.value = ''

      if (props.vehicle) {
        generalError.value = ''
        const t = props.vehicle.telematics || {}
        const hasHardware = !!t.has_telematics && !!t.gps?.installed

        if (hasHardware) {
          // Cargar hardware ya instalado y certificado
          form.gps_model = t.gps?.model || 'Teltonika FMC130 4G'
          form.gps_imei = t.gps?.imei || ''
          form.sim_number = t.gps?.sim_number || ''
          form.sim_operator = t.gps?.sim_operator || 'Claro IoT'
          form.gps_status = t.gps?.status || 'online'

          form.fuel_sensor_installed = !!t.fuel_sensor?.installed
          form.fuel_sensor_model = t.fuel_sensor?.model || 'Escort TD-BLE'
          form.fuel_sensor_id = t.fuel_sensor?.sensor_id || ''
          form.fuel_sensor_calibration = t.fuel_sensor?.last_calibration || ''

          form.mdvr_installed = !!t.mdvr?.installed
          form.mdvr_model = t.mdvr?.model || 'Howen Hero-ME40'
          form.mdvr_serial = t.mdvr?.serial || ''
          form.mdvr_channels = t.mdvr?.channels || 4

          form.panic_button_installed = t.panic_button?.installed !== false
          form.relay_installed = t.relay?.installed !== false
          form.notes = t.notes || ''
        } else {
          // Nueva instalación / Unidad pendiente: campos limpios para ingreso real
          form.gps_model = 'Teltonika FMC130 4G'
          form.gps_imei = ''
          form.sim_number = ''
          form.sim_operator = 'Claro IoT'
          form.gps_status = 'online'

          form.fuel_sensor_installed = false
          form.fuel_sensor_model = 'Escort TD-BLE'
          form.fuel_sensor_id = ''
          form.fuel_sensor_calibration = ''

          form.mdvr_installed = false
          form.mdvr_model = 'Howen Hero-ME40'
          form.mdvr_serial = ''
          form.mdvr_channels = 4

          form.panic_button_installed = true
          form.relay_installed = true
          form.notes = ''
        }
      }
    }
  }
)

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!form.gps_imei.trim()) {
    generalError.value = 'El N° IMEI del GPS es obligatorio para la certificación telemática.'
    return
  }

  isSubmitting.value = true
  generalError.value = ''

  emit('saved', {
    vehicleId: props.vehicle.vehicle_id,
    data: { ...form },
    setLoading: (val) => { isSubmitting.value = val },
    setError: (err) => { generalError.value = err },
  })
}
</script>
