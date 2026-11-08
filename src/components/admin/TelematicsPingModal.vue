<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden transform transition-all">
      <!-- Header -->
      <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-950 text-white">
        <div class="flex items-center space-x-3">
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </div>
          <div>
            <h3 class="text-sm font-bold tracking-wide flex items-center space-x-2">
              <span>Ping Telemático & Diagnóstico en Vivo</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                EN LÍNEA
              </span>
            </h3>
            <p class="text-xs text-slate-400 font-mono mt-0.5">
              Unidad: <span class="font-bold text-white">{{ vehicle?.plate_number }}</span> • IMEI: {{ diagnostic?.imei || 'Consultando...' }}
            </p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4">
        <!-- Spinner mientras consulta -->
        <div v-if="loading" class="py-10 text-center space-y-3">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          <p class="text-xs font-semibold text-slate-600">Enviando paquete ping UDP/TCP a terminal telemática...</p>
          <p class="text-[11px] text-slate-400">Verificando satélites GNSS, señal 4G y lectura de sensores</p>
        </div>

        <div v-else-if="diagnostic" class="space-y-4">
          <!-- Banner de Estado General -->
          <div class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="font-bold text-emerald-900">Telemetría Saludable y Conectada</span>
            </div>
            <span class="font-mono text-emerald-700 font-semibold text-[11px]">Latencia: {{ diagnostic.latency_ms }}</span>
          </div>

          <!-- Grilla de Parámetros -->
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Fix Satelital (GNSS)</span>
              <span class="font-bold text-slate-800 mt-1 block flex items-center">
                <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                {{ diagnostic.satellite_fix }}
              </span>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Cobertura Móvil</span>
              <span class="font-bold text-slate-800 mt-1 block">
                📶 {{ diagnostic.gsm_signal }}
              </span>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Alimentación Principal</span>
              <span class="font-bold text-slate-800 mt-1 block font-mono">
                ⚡ {{ diagnostic.main_power_voltage }}
              </span>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Batería Interna GPS</span>
              <span class="font-bold text-slate-800 mt-1 block font-mono">
                🔋 {{ diagnostic.backup_battery }}
              </span>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Estado de Ignición</span>
              <span class="font-bold text-slate-800 mt-1 block">
                🔑 {{ diagnostic.ignition_state }}
              </span>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Sensor de Combustible</span>
              <span class="font-bold text-slate-800 mt-1 block">
                ⛽ {{ diagnostic.fuel_sensor_reading }}
              </span>
            </div>
          </div>

          <!-- Diagnóstico de Seguridad -->
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs">
            <div class="flex justify-between items-center">
              <span class="text-slate-500">Botón de Pánico:</span>
              <span class="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                {{ diagnostic.panic_button_status }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500">Relé Corta-Corriente:</span>
              <span class="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 text-[10px]">
                {{ diagnostic.relay_state }}
              </span>
            </div>
            <div class="flex justify-between items-center pt-1 border-t border-slate-200/60 text-[10px] text-slate-400 font-mono">
              <span>Timestamp Diagnóstico:</span>
              <span>{{ diagnostic.ping_timestamp }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            @click="repeatPing"
            :disabled="loading"
            class="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Repetir Ping</span>
          </button>
          <button
            type="button"
            @click="closeModal"
            class="px-5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs"
          >
            Cerrar Diagnóstico
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
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

const emit = defineEmits(['close'])

const telematicsStore = useTelematicsStore()
const loading = ref(false)
const diagnostic = ref(null)

const runDiagnostic = async () => {
  if (!props.vehicle?.vehicle_id) return
  loading.value = true
  diagnostic.value = null
  const res = await telematicsStore.runPing(props.vehicle.vehicle_id)
  if (res.success) {
    diagnostic.value = res.data
  }
  loading.value = false
}

const repeatPing = () => {
  runDiagnostic()
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      runDiagnostic()
    } else {
      diagnostic.value = null
    }
  }
)

const closeModal = () => {
  emit('close')
}
</script>
