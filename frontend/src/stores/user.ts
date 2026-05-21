import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProfile } from '@/api/user'
import type { UserProfile } from '@/types/api'

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)

  async function fetchProfile() {
    loading.value = true
    try {
      profile.value = await getProfile()
    } finally {
      loading.value = false
    }
  }

  function clearProfile() {
    profile.value = null
  }

  return { profile, loading, fetchProfile, clearProfile }
})
