<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[92vh]">
      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-800">
              {{ isEditing ? 'Editar Ficha del Personal de Patio' : 'Registrar Personal de Patio' }}
            </h3>
            <p class="text-xs text-slate-500">
              {{ isEditing ? 'Actualiza rol operativo, turno asignado o datos de contacto' : 'Da de alta a inspectores de flota, técnicos instaladores o supervisores' }}
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

      <!-- Alerta General de Error Backend -->
      <div v-if="generalError" class="mx-5 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start space-x-2 shrink-0">
        <svg class="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ generalError }}</span>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" novalidate autocomplete="off" class="p-6 overflow-y-auto flex-1 space-y-5">
        <!-- Trampas anti-autofill para evitar que Chrome/Edge inyecten las credenciales del admin -->
        <input type="text" name="prevent_autofill_user" style="display:none" tabindex="-1" />
        <input type="password" name="prevent_autofill_pwd" style="display:none" tabindex="-1" />

        <!-- ========================================== -->
        <!-- SECCIÓN 1: DATOS PERSONALES Y ASIGNACIÓN -->
        <!-- ========================================== -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <span class="w-2 h-2 rounded-full bg-sky-500"></span>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">1. Identificación y Rol Operativo</h4>
          </div>

          <!-- Fila 1: DNI con botón de consulta RENIEC + Correo Electrónico -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Documento de Identidad (DNI) <span class="text-rose-500">*</span>
              </label>
              <div class="flex items-center space-x-1.5">
                <input
                  v-model="form.dni"
                  @input="onDniInput"
                  @blur="validateField('dni')"
                  type="text"
                  maxlength="8"
                  name="ft_worker_dni"
                  autocomplete="off"
                  placeholder="8 dígitos (ej. 71234567)"
                  class="flex-1 px-3.5 py-2.5 text-sm font-mono bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
                  :class="fieldErrors.dni ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' : 'border-slate-300 focus:border-sky-500'"
                />
                <button
                  type="button"
                  @click="handleLookupDni"
                  :disabled="form.dni.length !== 8 || isLookingUpDni"
                  title="Consultar en RENIEC y autocompletar nombres"
                  class="px-3 py-2.5 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0 shadow-xs"
                >
                  <svg v-if="isLookingUpDni" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>{{ isLookingUpDni ? '...' : 'Buscar' }}</span>
                </button>
              </div>

              <!-- Feedback del DNI -->
              <p v-if="dniSuccessMsg" class="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1 animate-fade-in">
                <span>✓ {{ dniSuccessMsg }}</span>
              </p>
              <p v-else-if="dniNoticeMsg" class="text-[11px] text-slate-500 mt-1">
                ℹ️ {{ dniNoticeMsg }}
              </p>
              <p v-else-if="fieldErrors.dni" class="text-[11px] text-rose-600 font-medium mt-1">{{ fieldErrors.dni }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Correo Electrónico (Usuario) <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.email"
                @blur="validateField('email')"
                type="email"
                name="ft_worker_email_access"
                autocomplete="off"
                placeholder="colaborador@fleettech.pe"
                class="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
                :class="fieldErrors.email ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' : 'border-slate-300 focus:border-sky-500'"
              />
              <p v-if="fieldErrors.email" class="text-[11px] text-rose-600 font-medium mt-1">{{ fieldErrors.email }}</p>
            </div>
          </div>

          <!-- Fila 2: Nombre Completo (Autocompletado con DNI o manual) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-700">
                Nombre y Apellidos Completos <span class="text-rose-500">*</span>
              </label>
              <span v-if="dniSuccessMsg" class="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                Autocompletado
              </span>
            </div>
            <input
              v-model="form.name"
              @blur="validateField('name')"
              type="text"
              name="ft_worker_fullname"
              autocomplete="off"
              placeholder="Ej. Carlos Mendoza Quispe"
              class="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
              :class="fieldErrors.name ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' : 'border-slate-300 focus:border-sky-500'"
            />
            <p v-if="fieldErrors.name" class="text-[11px] text-rose-600 font-medium mt-1">{{ fieldErrors.name }}</p>
          </div>

          <!-- Fila 3: Rol Operativo y Turno de Trabajo -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Rol Operativo en Patio <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="form.role"
                class="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-sky-500"
              >
                <option value="operator">Inspector de Patio (Checklists & Auditoría)</option>
                <option value="technician">Técnico Instalador / Mecánico (GPS, Sensores & Taller)</option>
                <option value="supervisor">Supervisor de Operaciones (Jefe de Patio)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Turno de Trabajo Asignado
              </label>
              <select
                v-model="form.shift"
                class="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="morning">Turno Mañana (06:00 - 14:00)</option>
                <option value="afternoon">Turno Tarde (14:00 - 22:00)</option>
                <option value="night">Turno Noche (22:00 - 06:00)</option>
                <option value="any">Turno Rotativo</option>
              </select>
            </div>
          </div>

          <!-- Fila 4: Celular y Contacto de Emergencia -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Teléfono Celular
              </label>
              <input
                v-model="form.phone"
                @input="onPhoneInput"
                type="tel"
                name="ft_worker_phone"
                autocomplete="off"
                placeholder="9 dígitos (ej. 987654321)"
                class="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Contacto de Emergencia / Familiar
              </label>
              <input
                v-model="form.emergency_contact"
                type="text"
                autocomplete="off"
                placeholder="Ej. Esposa - 999888777"
                class="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <!-- Fila 5: Especialidad / Notas Operativas -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Especialidad / Cargo en Patio <span class="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <input
              v-model="form.notes"
              type="text"
              placeholder="Ej. Técnico especialista en Telemática GPS 4G y sensores de combustible"
              class="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <!-- ========================================== -->
        <!-- SECCIÓN 2: ACCESO, CLAVE Y ESTADO -->
        <!-- ========================================== -->
        <div class="space-y-4 pt-2">
          <div class="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">2. Credenciales de Acceso a la Plataforma</h4>
          </div>

          <!-- Aviso en modo edición -->
          <div v-if="isEditing" class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
            <span class="font-medium">¿Deseas resetear o cambiar la contraseña? Si no, deja estos campos en blanco.</span>
          </div>

          <!-- Generar contraseña aleatoria -->
          <div class="flex items-center justify-between pb-1">
            <span class="text-xs text-slate-500 font-medium">Contraseña de inicio de sesión:</span>
            <button
              type="button"
              @click="generateRandomPassword"
              class="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center space-x-1 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Generar Contraseña Segura</span>
            </button>
          </div>

          <div v-if="copiedAlert" class="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs text-center font-medium animate-fade-in">
            ✓ ¡Contraseña generada y copiada al portapapeles!
          </div>

          <!-- Campos Contraseña y Confirmar Contraseña -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Contraseña <span v-if="!isEditing" class="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="text-[11px] text-slate-400 hover:text-slate-600 flex items-center space-x-1"
                >
                  <span>{{ showPassword ? 'Ocultar' : 'Mostrar' }}</span>
                </button>
              </div>
              <input
                v-model="form.password"
                @input="validatePasswords"
                :type="showPassword ? 'text' : 'password'"
                name="ft_worker_pwd_main"
                autocomplete="new-password"
                placeholder="Mínimo 6 caracteres"
                class="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
                :class="fieldErrors.password ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' : 'border-slate-300 focus:border-sky-500'"
              />
              <p v-if="fieldErrors.password" class="text-[11px] text-rose-600 font-medium mt-1">{{ fieldErrors.password }}</p>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Confirmar Contraseña <span v-if="!isEditing || form.password" class="text-rose-500">*</span>
                </label>
              </div>
              <input
                v-model="form.password_confirmation"
                @input="validatePasswords"
                :type="showPassword ? 'text' : 'password'"
                name="ft_worker_pwd_confirm"
                autocomplete="new-password"
                placeholder="Repite la contraseña"
                class="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
                :class="fieldErrors.password_confirmation ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' : 'border-slate-300 focus:border-sky-500'"
              />
              <p v-if="fieldErrors.password_confirmation" class="text-[11px] text-rose-600 font-medium mt-1">
                {{ fieldErrors.password_confirmation }}
              </p>
              <p v-else-if="passwordsMatch" class="text-[11px] text-emerald-600 font-semibold mt-1">
                ✓ Las contraseñas coinciden
              </p>
            </div>
          </div>

          <!-- Switch Estado Activo -->
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-slate-800">Colaborador Habilitado en Sistema</p>
              <p class="text-[11px] text-slate-500">Permite iniciar sesión en la app móvil y registrar inspecciones o instalaciones.</p>
            </div>
            <input
              id="is_active_toggle"
              v-model="form.is_active"
              type="checkbox"
              class="h-5 w-5 text-sky-600 focus:ring-sky-500 border-slate-300 rounded cursor-pointer"
            />
          </div>
        </div>

        <!-- Footer Acciones -->
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
            <span>{{ isEditing ? 'Guardar Cambios' : 'Registrar Colaborador' }}</span>
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
  operator: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'saved'])

const isEditing = computed(() => !!props.operator?.id)
const isSubmitting = ref(false)
const showPassword = ref(false)
const copiedAlert = ref(false)
const generalError = ref('')

const isLookingUpDni = ref(false)
const dniSuccessMsg = ref('')
const dniNoticeMsg = ref('')

const form = reactive({
  name: '',
  dni: '',
  email: '',
  phone: '',
  role: 'operator',
  shift: 'morning',
  emergency_contact: '',
  notes: '',
  password: '',
  password_confirmation: '',
  is_active: true,
})

const fieldErrors = reactive({
  name: '',
  dni: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const passwordsMatch = computed(() => {
  return form.password && form.password_confirmation && form.password === form.password_confirmation
})

const onDniInput = (e) => {
  form.dni = e.target.value.replace(/\D/g, '').substring(0, 8)
  dniSuccessMsg.value = ''
  dniNoticeMsg.value = ''
}

const handleLookupDni = async () => {
  if (form.dni.length !== 8) return

  isLookingUpDni.value = true
  dniSuccessMsg.value = ''
  dniNoticeMsg.value = ''

  try {
    const response = await api.get(`/admin/dni-lookup/${form.dni}`)
    if (response.data.success && response.data.data?.name) {
      form.name = response.data.data.name
      dniSuccessMsg.value = 'Nombres obtenidos de RENIEC satisfactoriamente'
      validateField('name')

      // Sugerir correo si está vacío
      if (!form.email && response.data.data.first_name && response.data.data.last_name) {
        const cleanFirst = response.data.data.first_name.split(' ')[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        const cleanLast = response.data.data.last_name.split(' ')[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        form.email = `${cleanFirst}.${cleanLast}@fleettech.pe`
      }
      setTimeout(() => { dniSuccessMsg.value = '' }, 5000)
    } else {
      dniNoticeMsg.value = response.data.message || 'No se pudo autocompletar. Puedes ingresar el nombre manualmente.'
      setTimeout(() => { dniNoticeMsg.value = '' }, 6000)
    }
  } catch (err) {
    dniNoticeMsg.value = 'Servicio no disponible en este momento. Ingresa el nombre manualmente.'
    setTimeout(() => { dniNoticeMsg.value = '' }, 6000)
  } finally {
    isLookingUpDni.value = false
  }
}

const onPhoneInput = (e) => {
  form.phone = e.target.value.replace(/[^\d+]/g, '').substring(0, 15)
}

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let randomStr = ''
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  const generated = `Patio${randomStr}*`
  form.password = generated
  form.password_confirmation = generated
  showPassword.value = true
  validatePasswords()

  if (navigator.clipboard) {
    navigator.clipboard.writeText(generated).then(() => {
      copiedAlert.value = true
      setTimeout(() => { copiedAlert.value = false }, 4000)
    })
  }
}

const validatePasswords = () => {
  fieldErrors.password = ''
  fieldErrors.password_confirmation = ''

  if (!isEditing.value && !form.password) {
    fieldErrors.password = 'La contraseña es obligatoria.'
  } else if (form.password && form.password.length < 6) {
    fieldErrors.password = 'La contraseña debe tener al menos 6 caracteres.'
  }

  if (form.password && form.password !== form.password_confirmation) {
    fieldErrors.password_confirmation = 'Las contraseñas no coinciden.'
  }
}

const validateField = (field) => {
  switch (field) {
    case 'name':
      if (!form.name.trim()) {
        fieldErrors.name = 'El nombre completo es obligatorio.'
      } else if (form.name.trim().length < 3) {
        fieldErrors.name = 'El nombre debe tener al menos 3 caracteres.'
      } else {
        fieldErrors.name = ''
      }
      break
    case 'dni':
      if (!form.dni.trim()) {
        fieldErrors.dni = 'El número de DNI es obligatorio.'
      } else if (form.dni.trim().length < 8) {
        fieldErrors.dni = 'El DNI debe tener 8 dígitos.'
      } else {
        fieldErrors.dni = ''
      }
      break
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email.trim()) {
        fieldErrors.email = 'El correo electrónico es obligatorio.'
      } else if (!emailRegex.test(form.email.trim())) {
        fieldErrors.email = 'Ingresa un correo electrónico válido.'
      } else {
        fieldErrors.email = ''
      }
      break
  }
}

const validateAll = () => {
  validateField('name')
  validateField('dni')
  validateField('email')
  validatePasswords()

  return !fieldErrors.name && !fieldErrors.dni && !fieldErrors.email && !fieldErrors.password && !fieldErrors.password_confirmation
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      generalError.value = ''
      showPassword.value = false
      copiedAlert.value = false
      dniSuccessMsg.value = ''
      dniNoticeMsg.value = ''

      fieldErrors.name = ''
      fieldErrors.dni = ''
      fieldErrors.email = ''
      fieldErrors.password = ''
      fieldErrors.password_confirmation = ''

      if (props.operator) {
        form.name = props.operator.name || ''
        form.dni = props.operator.dni || ''
        form.email = props.operator.email || ''
        form.phone = props.operator.phone || ''
        form.role = props.operator.role || 'operator'
        form.shift = props.operator.shift || 'morning'
        form.emergency_contact = props.operator.emergency_contact || ''
        form.notes = props.operator.notes || ''
        form.password = ''
        form.password_confirmation = ''
        form.is_active = props.operator.is_active ?? true
      } else {
        form.name = ''
        form.dni = ''
        form.email = ''
        form.phone = ''
        form.role = 'operator'
        form.shift = 'morning'
        form.emergency_contact = ''
        form.notes = ''
        form.password = ''
        form.password_confirmation = ''
        form.is_active = true
      }
    }
  }
)

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!validateAll()) return

  isSubmitting.value = true
  generalError.value = ''

  const payload = {
    name: form.name.trim(),
    dni: form.dni.trim(),
    email: form.email.trim(),
    phone: form.phone ? form.phone.trim() : null,
    role: form.role,
    shift: form.shift,
    emergency_contact: form.emergency_contact ? form.emergency_contact.trim() : null,
    notes: form.notes ? form.notes.trim() : null,
    is_active: form.is_active,
  }

  if (form.password) {
    payload.password = form.password
    payload.password_confirmation = form.password_confirmation
  }

  emit('saved', {
    isEditing: isEditing.value,
    id: props.operator?.id,
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
