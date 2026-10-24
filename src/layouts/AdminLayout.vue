<template>
  <div class="min-h-screen bg-slate-100 flex flex-col md:flex-row">
    <!-- Sidebar Navegación Lateral -->
    <aside class="w-full md:w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800">
      <div class="p-5 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-sky-500/20">
            FT
          </div>
          <div>
            <h1 class="text-base font-bold text-white tracking-tight">FleetTech</h1>
            <p class="text-xs text-sky-400 font-medium">Panel Administrativo</p>
          </div>
        </div>
      </div>

      <!-- Menú de Enlaces -->
      <nav class="p-4 space-y-1.5 flex-1">
        <router-link
          to="/admin/dashboard"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="route.name === 'AdminDashboard' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Actividad del Día</span>
        </router-link>

        <router-link
          to="/admin/operators"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="route.name === 'AdminOperators' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Gestión de Operadores</span>
        </router-link>

        <router-link
          to="/admin/fleet"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="route.name === 'AdminFleet' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>Flota Vehicular (Patio)</span>
        </router-link>
      </nav>

      <!-- Perfil y Logout -->
      <div class="p-4 border-t border-slate-800 bg-slate-900/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 min-w-0">
            <div class="w-8 h-8 rounded-full bg-slate-700 text-sky-400 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-600">
              AD
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold text-white truncate">{{ authStore.user?.name || 'Administrador' }}</p>
              <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-950 text-sky-400 border border-sky-800">
                ADMIN
              </span>
            </div>
          </div>
          <button
            @click="handleLogout"
            title="Cerrar sesión"
            class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Área de Contenido Principal -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Barra Superior -->
      <header class="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Portal de Control</span>
          <h2 class="text-base font-bold text-slate-800">{{ currentTitle }}</h2>
        </div>
        <div class="flex items-center space-x-3">
          <div class="text-right hidden sm:block">
            <p class="text-xs font-medium text-slate-700">{{ authStore.user?.company?.name || 'TransAndina Logistics S.A.C.' }}</p>
            <p class="text-[11px] text-slate-400">RUC: {{ authStore.user?.company?.tax_id || '20601234567' }}</p>
          </div>
        </div>
      </header>

      <!-- Vista de Rutas Hijas -->
      <main class="flex-1 p-6 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const currentTitle = computed(() => {
  switch (route.name) {
    case 'AdminDashboard':
      return 'Bitácora & Resumen Operativo Diario'
    case 'AdminOperators':
      return 'Directorio y Registro de Operadores'
    case 'AdminFleet':
      return 'Monitoreo de Flota en Patio'
    default:
      return 'Panel de Administración'
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>
