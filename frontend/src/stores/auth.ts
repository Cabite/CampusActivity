import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const TOKEN_KEY = 'campus_activity_token'
const USER_ID_KEY = 'campus_activity_user_id'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const userId = ref<number | null>(
    localStorage.getItem(USER_ID_KEY) ? Number(localStorage.getItem(USER_ID_KEY)) : null,
  )

  const isLoggedIn = computed(() => !!token.value)

  function setAuth(newToken: string, newUserId: number) {
    token.value = newToken
    userId.value = newUserId
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_ID_KEY, String(newUserId))
  }

  function clearAuth() {
    token.value = null
    userId.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
  }

  return { token, userId, isLoggedIn, setAuth, clearAuth }
})
