<template>
  <div class="flex h-screen">
    <!-- 侧边栏（同上） -->
    <aside class="w-64 bg-white shadow-md flex flex-col z-10">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-blue-600">CampusActivity</h1>
        <p class="text-xs text-gray-500">管理员面板</p>
      </div>
      <nav class="flex-1 p-2 space-y-1">
        <router-link to="/admin/dashboard" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
          <iconify-icon icon="ph:gauge" class="mr-2 w-5 h-5"></iconify-icon> 控制台
        </router-link>
        <router-link to="/admin/audit" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
          <iconify-icon icon="ph:check-circle" class="mr-2 w-5 h-5"></iconify-icon> 活动审核
        </router-link>
        <router-link to="/admin/users" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
          <iconify-icon icon="ph:users" class="mr-2 w-5 h-5"></iconify-icon> 用户管理
        </router-link>
        <router-link to="/admin/announcements" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
          <iconify-icon icon="ph:megaphone" class="mr-2 w-5 h-5"></iconify-icon> 系统公告
        </router-link>
        <router-link to="/admin/statistics" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
          <iconify-icon icon="ph:chart-bar" class="mr-2 w-5 h-5"></iconify-icon> 平台统计
        </router-link>
        <router-link to="/admin/profile" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
          <iconify-icon icon="ph:user-circle" class="mr-2 w-5 h-5"></iconify-icon> 个人中心
        </router-link>
      </nav>
      <div class="p-4 border-t text-sm text-gray-500">
        <p class="truncate">管理员</p>
        <button @click="logout" class="text-red-500 hover:text-red-700 mt-2 text-left">退出登录</button>
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <AppPageContainer variant="gradient" padding="lg" max-width="2xl">
        <!-- 原 Statistics.vue 的完整内容 -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-white">平台统计</h1>
          <p class="text-white/70 mt-1">平台数据总览</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AppCard class="text-center"><div class="text-3xl font-bold text-blue-600">{{ stats.totalActivities }}</div><div class="text-gray-500 mt-2">总活动数</div></AppCard>
          <AppCard class="text-center"><div class="text-3xl font-bold text-blue-600">{{ stats.totalUsers }}</div><div class="text-gray-500 mt-2">总用户数</div></AppCard>
          <AppCard class="text-center"><div class="text-3xl font-bold text-blue-600">{{ stats.totalRegistrations }}</div><div class="text-gray-500 mt-2">总报名人次</div></AppCard>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 活动类型分布 -->
          <AppCard>
            <h2 class="text-xl font-bold mb-4">活动类型分布</h2>
            <div v-for="(value, key) in stats.categoryDistribution" :key="key" class="mb-2">
              <div class="flex justify-between text-sm"><span>{{ key }}</span><span>{{ value }}%</span></div>
              <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-blue-600 h-2 rounded-full" :style="{ width: value + '%' }"></div></div>
            </div>
          </AppCard>

          <!-- 签到率统计 -->
          <AppCard>
            <h2 class="text-xl font-bold mb-4">签到率统计</h2>
            <div class="text-6xl font-bold text-blue-600 text-center mb-2">{{ stats.averageCheckinRate }}%</div>
            <div class="text-gray-500 text-center mb-4">整体签到率</div>
            <div class="flex justify-center gap-6">
              <div class="text-center"><div class="text-2xl font-bold text-green-600">65%</div><div>二维码签到</div></div>
              <div class="text-center"><div class="text-2xl font-bold text-blue-600">13%</div><div>手动签到</div></div>
            </div>
          </AppCard>
        </div>
      </AppPageContainer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppPageContainer from '@/components/layout/AppPageContainer.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()

const mockStats = {
  totalActivities: 124,
  totalUsers: 3456,
  totalRegistrations: 8923,
  averageCheckinRate: 78,
  categoryDistribution: { '学术类': 35, '文体类': 45, '志愿服务类': 20 }
}

const stats = reactive({
  totalActivities: 0,
  totalUsers: 0,
  totalRegistrations: 0,
  averageCheckinRate: 0,
  categoryDistribution: {} as Record<string, number>
})

const fetchStatistics = async () => {
  try {
    // const res = await getAdminStatistics()
    throw new Error('API not implemented')
  } catch {
    stats.totalActivities = mockStats.totalActivities
    stats.totalUsers = mockStats.totalUsers
    stats.totalRegistrations = mockStats.totalRegistrations
    stats.averageCheckinRate = mockStats.averageCheckinRate
    stats.categoryDistribution = mockStats.categoryDistribution
  }
}

const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchStatistics()
})
</script>