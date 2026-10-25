<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden transform transition-all">
      <!-- Modal Header -->
      <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <h3 class="text-lg font-bold text-slate-800">
            {{ isEditing ? 'Editar Datos del Operador' : 'Registrar Nuevo Operador' }}
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            {{ isEditing ? 'Actualiza los datos de acceso o contacto del operador' : 'Habilita un nuevo operador para realizar relevos e inspecciones' }}
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
        <!-- Campo Nombre -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Nombre Completo <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.name"
            @input="onNameInput"
            @blur="validateField('name')"
            type="text"
            placeholder="Ej. Juan Carlos Pérez Quispe"
            class="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
            :class="fieldErrors.name ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'"
          />
          <p v-if="fieldErrors.name" class="text-[11px] text-rose-600 font-medium mt-1 flex items-center space-x-1">
            <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ fieldErrors.name }}</span>
          </p>
          <p v-else class="text-[11px] text-slate-400 mt-1">Solo letras y espacios (no números ni símbolos como @, #, etc.)</p>
        </div>

        <!-- Campo Correo Electrónico -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Correo Electrónico (Usuario) <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.email"
            @input="validateField('email')"
            @blur="validateField('email')"
            type="email"
            placeholder="operador@fleettech.pe"
            class="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
            :class="fieldErrors.email ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'"
          />
          <p v-if="fieldErrors.email" class="text-[11px] text-rose-600 font-medium mt-1 flex items-center space-x-1">
            <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ fieldErrors.email }}</span>
          </p>
          <p v-else class="text-[11px] text-slate-400 mt-1">Debe incluir @ y un dominio válido (ej. usuario@empresa.pe)</p>
        </div>

        <!-- Campo Teléfono Móvil -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Teléfono Móvil
          </label>
          <input
            v-model="form.phone"
            @input="onPhoneInput"
            @blur="validateField('phone')"
            type="tel"
            placeholder="987654321 o +51 987654321"
            class="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
            :class="fieldErrors.phone ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'"
          />
          <p v-if="fieldErrors.phone" class="text-[11px] text-rose-600 font-medium mt-1 flex items-center space-x-1">
            <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ fieldErrors.phone }}</span>
          </p>
          <p v-else class="text-[11px] text-slate-400 mt-1">Solo números (celular de 9 dígitos)</p>
        </div>

        <!-- Campo Contraseña -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Contraseña de Acceso {{ isEditing ? '(Opcional: Dejar vacía para no cambiar)' : '*' }}
          </label>
          <input
            v-model="form.password"
            @input="validateField('password')"
            @blur="validateField('password')"
            type="password"
            placeholder="Mínimo 6 caracteres"
            class="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors text-slate-800 focus:outline-none"
            :class="fieldErrors.password ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'"
          />
          <p v-if="fieldErrors.password" class="text-[11px] text-rose-600 font-medium mt-1 flex items-center space-x-1">
            <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ fieldErrors.password }}</span>
          </p>
          <p v-else class="text-[11px] text-slate-400 mt-1">Al menos 6 caracteres seguros</p>
        </div>

        <!-- Switch Estado Activo -->
        <div class="flex items-center space-x-2 pt-2">
          <input
            id="is_active"
            v-model="form.is_active"
            type="checkbox"
            class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded cursor-pointer"
          />
          <label for="is_active" class="text-xs font-semibold text-slate-700 cursor-pointer">
            Operador activo y habilitado para operar vehículos en patio
          </label>
        </div>

        <!-- Botones de Acción -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading || isFormInvalid"
            class="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Guardando...' : (isEditing ? 'Actualizar Operador' : 'Crear Operador') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  operator: Object,
})

const emit = defineEmits(['close', 'saved'])

const isEditing = ref(false)
const loading = ref(false)
const generalError = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  is_active: true,
})

const fieldErrors = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
})

// Regex estricto para nombres: Solo letras, tildes, ñ y espacios
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
// Regex estricto para emails válidos con @ y dominio
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
// Regex para celulares peruanos (9 dígitos o con prefijo +51)
const phoneRegex = /^(\+?51)?\s?9\d{8}$/

// Filtro en tiempo real para nombre (elimina números o caracteres especiales como @, #, $, etc.)
const onNameInput = () => {
  // Reemplaza cualquier caracter que no sea letra o espacio
  form.name = form.name.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '')
  validateField('name')
}

// Filtro en tiempo real para teléfono (elimina letras y caracteres extra)
const onPhoneInput = () => {
  form.phone = form.phone.replace(/[^0-9+\s]/g, '')
  validateField('phone')
}

const validateField = (field) => {
  switch (field) {
    case 'name':
      if (!form.name || !form.name.trim()) {
        fieldErrors.name = 'El nombre completo es obligatorio.'
      } else if (form.name.trim().length < 3) {
        fieldErrors.name = 'El nombre debe tener al menos 3 caracteres.'
      } else if (!nameRegex.test(form.name.trim())) {
        fieldErrors.name = 'El nombre solo puede contener letras y espacios (sin números ni símbolos como @).'
      } else {
        fieldErrors.name = ''
      }
      break

    case 'email':
      if (!form.email || !form.email.trim()) {
        fieldErrors.email = 'El correo electrónico es obligatorio.'
      } else if (!form.email.includes('@')) {
        fieldErrors.email = 'El correo debe incluir el signo "@" (ej. operador@fleettech.pe).'
      } else if (!emailRegex.test(form.email.trim())) {
        fieldErrors.email = 'Formato de correo inválido (debe tener dominio como .com o .pe).'
      } else {
        fieldErrors.email = ''
      }
      break

    case 'phone':
      if (form.phone && form.phone.trim()) {
        const cleanPhone = form.phone.replace(/\s+/g, '')
        if (!phoneRegex.test(cleanPhone)) {
          fieldErrors.phone = 'Ingresa un celular válido de 9 dígitos (ej. 987654321 o +51 987654321).'
        } else {
          fieldErrors.phone = ''
        }
      } else {
        fieldErrors.phone = ''
      }
      break

    case 'password':
      if (!isEditing.value && (!form.password || form.password.length < 6)) {
        fieldErrors.password = 'La contraseña es obligatoria y debe tener al menos 6 caracteres.'
      } else if (isEditing.value && form.password && form.password.length < 6) {
        fieldErrors.password = 'Si modificas la contraseña, debe contener al menos 6 caracteres.'
      } else {
        fieldErrors.password = ''
      }
      break
  }
}

const validateAll = () => {
  validateField('name')
  validateField('email')
  validateField('phone')
  validateField('password')
  return !fieldErrors.name && !fieldErrors.email && !fieldErrors.phone && !fieldErrors.password
}

const isFormInvalid = computed(() => {
  if (!form.name || form.name.trim().length < 3) return true
  if (!form.email || !form.email.includes('@')) return true
  if (!isEditing.value && (!form.password || form.password.length < 6)) return true
  if (fieldErrors.name || fieldErrors.email || fieldErrors.phone || fieldErrors.password) return true
  return false
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    generalError.value = ''
    fieldErrors.name = ''
    fieldErrors.email = ''
    fieldErrors.phone = ''
    fieldErrors.password = ''

    if (props.operator && props.operator.id) {
      isEditing.value = true
      form.name = props.operator.name || ''
      form.email = props.operator.email || ''
      form.phone = props.operator.phone || ''
      form.password = ''
      form.is_active = props.operator.is_active ?? true
    } else {
      isEditing.value = false
      form.name = ''
      form.email = ''
      form.phone = ''
      form.password = ''
      form.is_active = true
    }
  }
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!validateAll()) return

  loading.value = true
  generalError.value = ''

  emit('saved', {
    isEditing: isEditing.value,
    id: props.operator?.id,
    data: { ...form },
    setLoading: (val) => { loading.value = val },
    setError: (err) => {
      loading.value = false
      // Si el backend envió errores por campo (422)
      if (typeof err === 'object' && err !== null) {
        if (err.name) fieldErrors.name = err.name[0]
        if (err.email) fieldErrors.email = err.email[0]
        if (err.phone) fieldErrors.phone = err.phone[0]
        if (err.password) fieldErrors.password = err.password[0]
        generalError.value = 'Por favor corrige los campos señalados en rojo.'
      } else {
        generalError.value = err || 'Ocurrió un error al procesar la solicitud.'
      }
    },
  })
}
</script>
