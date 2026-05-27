import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProfile } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<any>(null)
  const loading = ref(false)

  const fetchProfile = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    loading.value = true
    try {
      const data = await getProfile()
      userInfo.value = data
    } catch (error) {
      console.error('获取用户信息失败', error)
    } finally {
      loading.value = false
    }
  }

  const clearProfile = () => {
    userInfo.value = null
  }

  return { userInfo, loading, fetchProfile, clearProfile }
})