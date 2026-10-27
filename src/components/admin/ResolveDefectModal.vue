<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
      <!-- Encabezado del Modal -->
      <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-white">Subsanar Defecto de Taller</h3>
            <p class="text-xs text-slate-400">Regularización de falla y liberación operativa</p>
          </div>
        </div>
        <button
          @click="handleClose"
          class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Ficha resumen del defecto -->
      <div class="p-6 space-y-4">
        <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-1 rounded bg-slate-900 text-white font-mono font-bold text-xs tracking-wider">
                {{ defect?.plate_number || 'UNIDAD' }}
              </span>
              <span class="text-xs font-semibold text-slate-700">
                {{ defect?.item_label || 'Componente inspeccionado' }}
              </span>
            </div>
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              :class="getSeverityBadgeClass(defect?.severity)"
            >
              {{ defect?.severity_label || defect?.severity }}
            </span>
          </div>

          <div class="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
            <span class="font-medium text-slate-400 block mb-1">Observación Reportada:</span>
            <p class="text-slate-800 font-medium leading-relaxed">{{ defect?.description || 'Sin descripción detallada.' }}</p>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Reportado por: <strong class="text-slate-700">{{ defect?.reported_by?.name || 'Técnico de patio' }}</strong></span>
            <span>ID Defecto: <strong class="font-mono text-slate-700">#{{ defect?.id }}</strong></span>
          </div>
        </div>

        <!-- Alerta de Bloqueo Crítico -->
        <div
          v-if="defect?.severity === 'critical'"
          class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5"
        >
          <svg class="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="text-xs text-rose-800 leading-snug">
            <p class="font-bold">Impacto Operativo Crítico</p>
            <p class="mt-0.5 text-rose-700">
              Esta falla mantiene la unidad bloqueada. Al subsanarla, si no existen otros defectos críticos abiertos, la unidad cambiará automáticamente a estado <strong class="underline">OPERATIVA</strong>.
            </p>
          </div>
        </div>

        <!-- Formulario de Resolución -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Acción Correctiva / Notas de Subsanación <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="resolutionNotes"
              rows="3"
              required
              minlength="5"
              maxlength="1000"
              placeholder="Detalla el trabajo realizado en taller, repuesto cambiado o reposición de herramienta..."
              class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
            ></textarea>
            <div class="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Mínimo 5 caracteres</span>
              <span>{{ resolutionNotes.length }}/1000</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              N° Orden de Trabajo / Referencia de Repuesto <span class="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <input
              v-model="evidenceRef"
              type="text"
              placeholder="Ej: OT-2026-4091 / Repuesto B-12"
              class="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
            />
          </div>

          <!-- Mensaje de error si falla -->
          <div v-if="localError" class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
            {{ localError }}
          </div>

          <!-- Acciones -->
          <div class="pt-2 flex items-center justify-end space-x-3 border-t border-slate-200">
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="submitting || resolutionNotes.trim().length < 5"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-2 shadow-xs"
            >
              <div v-if="submitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{{ submitting ? 'Guardando...' : 'Confirmar y Levantar Falla' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  defect: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'resolve'])

const resolutionNotes = ref('')
const evidenceRef = ref('')
const submitting = ref(false)
const localError = ref('')

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      resolutionNotes.value = ''
      evidenceRef.value = ''
      localError.value = ''
      submitting.value = false
    }
  }
)

const handleClose = () => {
  if (!submitting.value) {
    emit('close')
  }
}

const handleSubmit = async () => {
  if (resolutionNotes.value.trim().length < 5) {
    localError.value = 'Las notas de resolución deben contener al menos 5 caracteres.'
    return
  }

  submitting.value = true
  localError.value = ''

  emit('resolve', {
    defectId: props.defect?.id,
    resolution_notes: resolutionNotes.value.trim(),
    resolved_evidence_path: evidenceRef.value.trim() || null,
    onSuccess: () => {
      submitting.value = false
      handleClose()
    },
    onError: (msg) => {
      submitting.value = false
      localError.value = msg || 'Ocurrió un error al procesar la resolución.'
    },
  })
}

const getSeverityBadgeClass = (severity) => {
  switch (severity) {
    case 'critical':
      return 'bg-rose-100 text-rose-800 border border-rose-300'
    case 'major':
      return 'bg-amber-100 text-amber-800 border border-amber-300'
    case 'minor':
      return 'bg-sky-100 text-sky-800 border border-sky-300'
    default:
      return 'bg-slate-100 text-slate-800 border border-slate-300'
  }
}
</script>
