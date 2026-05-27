<template>
  <aside class="w-64 bg-white shadow-md flex flex-col z-10">
    <div class="p-4 border-b">
      <h1 class="text-xl font-bold text-blue-600">CampusActivity</h1>
      <p class="text-xs text-gray-500">组织者面板</p>
    </div>
    <nav class="flex-1 p-2 space-y-1">
      <router-link to="/organizer/activities" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
        <iconify-icon icon="ph:calendar-check" class="mr-2 w-5 h-5"></iconify-icon> 活动管理
      </router-link>
      <router-link to="/organizer/notice" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
        <iconify-icon icon="ph:bell" class="mr-2 w-5 h-5"></iconify-icon> 公告与消息
      </router-link>
      <router-link to="/organizer/profile" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
        <iconify-icon icon="ph:user-circle" class="mr-2 w-5 h-5"></iconify-icon> 个人中心
      </router-link>
    </nav>
    <div class="p-4 border-t text-sm text-gray-500">
      <p class="truncate">{{ userStore.userInfo?.org_name || userStore.userInfo?.username || '组织者' }}</p>
      <button @click="logout" class="text-red-500 hover:text-red-700 mt-2 text-left w-full text-left">退出登录</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const logout = () => {
  if (confirm('确定退出登录吗？')) {
    authStore.clearAuth()
    router.push('/login')
  }
}
</script>