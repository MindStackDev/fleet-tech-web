import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Root',
    redirect: () => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated && authStore.isAdmin ? '/admin/dashboard' : '/login'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/DailyDashboardView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'operators',
        name: 'AdminOperators',
        component: () => import('../views/admin/OperatorsView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'fleet',
        name: 'AdminFleet',
        component: () => import('../views/admin/FleetView.vue'),
        meta: { requiresAdmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAdmin = to.matched.some((record) => record.meta?.requiresAdmin)
  const isGuestOnly = to.matched.some((record) => record.meta?.guestOnly)

  if (requiresAdmin) {
    if (!authStore.isAuthenticated) {
      return next({ name: 'Login' })
    }
    if (authStore.user?.role !== 'admin') {
      authStore.logout()
      return next({ name: 'Login', query: { error: 'unauthorized' } })
    }
  }

  if (isGuestOnly && authStore.isAuthenticated && authStore.isAdmin) {
    return next({ name: 'AdminDashboard' })
  }

  next()
})

export default router
