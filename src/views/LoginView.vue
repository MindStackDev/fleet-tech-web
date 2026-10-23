<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-2xl">
      <!-- Logo y Título -->
      <div class="text-center mb-8">
        <div class="inline-flex w-14 h-14 rounded-2xl bg-sky-500 items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-sky-500/30 mb-4">
          FT
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">FleetTech Admin</h1>
        <p class="text-sm text-slate-400 mt-1">Portal exclusivo para la Administración de Flotas</p>
      </div>

      <!-- Alerta de Error -->
      <div v-if="authStore.error" class="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
        <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ authStore.error }}</span>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Correo Corporativo <span class="text-rose-400">*</span>
          </label>
          <input
            v-model="email"
            @input="validateEmail"
            @blur="validateEmail"
            type="email"
            placeholder="admin@fleettech.pe"
            class="w-full px-4 py-2.5 rounded-lg bg-slate-900 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors"
            :class="emailError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'"
          />
          <p v-if="emailError" class="text-[11px] text-rose-400 font-medium mt-1">
            {{ emailError }}
          </p>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Contraseña <span class="text-rose-400">*</span>
          </label>
          <input
            v-model="password"
            @input="validatePassword"
            @blur="validatePassword"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-lg bg-slate-900 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors"
            :class="passwordError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'"
          />
          <p v-if="passwordError" class="text-[11px] text-rose-400 font-medium mt-1">
            {{ passwordError }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="authStore.loading || isSubmitDisabled"
          class="w-full mt-2 py-3 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-semibold text-sm transition-colors shadow-md shadow-sky-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ authStore.loading ? 'Validando credenciales...' : 'Iniciar Sesión como Administrador' }}</span>
        </button>
      </form>

      <!-- Botón de Acceso Rápido para Pruebas -->
      <div class="mt-6 pt-6 border-t border-slate-700/60 text-center">
        <p class="text-xs text-slate-400 mb-2">¿Credenciales de prueba?</p>
        <button
          type="button"
          @click="fillAdminCredentials"
          class="text-xs text-sky-400 hover:text-sky-300 font-medium underline transition-colors"
        >
          Autocompletar Administrador Central (admin@fleettech.pe)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('admin@fleettech.pe')
const password = ref('password123')
const emailError = ref('')
const passwordError = ref('')

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const validateEmail = () => {
  if (!email.value || !email.value.trim()) {
    emailError.value = 'El correo electrónico es obligatorio.'
  } else if (!email.value.includes('@')) {
    emailError.value = 'El correo debe incluir el carácter "@".'
  } else if (!emailRegex.test(email.value.trim())) {
    emailError.value = 'Ingresa un formato de correo válido (ej. usuario@dominio.com).'
  } else {
    emailError.value = ''
  }
}

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'La contraseña es obligatoria.'
  } else if (password.value.length < 6) {
    passwordError.value = 'La contraseña debe tener al menos 6 caracteres.'
  } else {
    passwordError.value = ''
  }
}

const isSubmitDisabled = computed(() => {
  return !email.value || !password.value || !!emailError.value || !!passwordError.value
})

const fillAdminCredentials = () => {
  email.value = 'admin@fleettech.pe'
  password.value = 'password123'
  emailError.value = ''
  passwordError.value = ''
}

const handleSubmit = async () => {
  validateEmail()
  validatePassword()
  if (emailError.value || passwordError.value) return

  const result = await authStore.login(email.value, password.value)
  if (result.success) {
    router.push({ name: 'AdminDashboard' })
  }
}
</script>
