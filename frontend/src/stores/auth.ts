import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userId = ref<number | null>(null)
  const role = ref<'user' | 'organizer' | 'admin' | null>(localStorage.getItem('role') as any || null)

  const setAuth = (newToken: string, newUserId: number, newRole: 'user' | 'organizer' | 'admin') => {
    token.value = newToken
    userId.value = newUserId
    role.value = newRole
    localStorage.setItem('token', newToken)
    localStorage.setItem('user_id', String(newUserId))
    localStorage.setItem('role', newRole)
  }

  const clearAuth = () => {
    token.value = ''
    userId.value = null
    role.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('role')
  }

  const isLoggedIn = computed(() => !!token.value)

  return { token, userId, role, setAuth, clearAuth, isLoggedIn }
})