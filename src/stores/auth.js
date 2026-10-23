import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/client'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('fleet_tech_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('fleet_tech_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        device_name: 'FleetTech-Admin-Web',
      })

      const data = response.data.data
      
      // Validar si el usuario tiene rol de Administrador
      if (data.user.role !== 'admin') {
        throw new Error('Acceso restringido: Esta plataforma es exclusiva para el Administrador del sistema.')
      }

      token.value = data.token
      user.value = data.user

      localStorage.setItem('fleet_tech_token', data.token)
      localStorage.setItem('fleet_tech_user', JSON.stringify(data.user))

      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al iniciar sesión'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      const res = await api.get('/auth/me')
      user.value = res.data.data
      localStorage.setItem('fleet_tech_user', JSON.stringify(res.data.data))
    } catch (err) {
      logout()
    }
  }

  function logout() {
    if (token.value) {
      api.post('/auth/logout').catch(() => {})
    }
    token.value = null
    user.value = null
    localStorage.removeItem('fleet_tech_token')
    localStorage.removeItem('fleet_tech_user')
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    fetchProfile,
    logout,
  }
})
