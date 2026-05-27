<template>
  <div class="flex h-screen">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <AppPageContainer variant="gradient" padding="lg" max-width="2xl">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-white">平台统计</h1>
          <p class="text-white/70 mt-1">平台数据总览</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AppCard class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ stats.totalActivities }}</div>
            <div class="text-gray-500 mt-2">总活动数</div>
          </AppCard>
          <AppCard class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ stats.totalUsers }}</div>
            <div class="text-gray-500 mt-2">总用户数</div>
          </AppCard>
          <AppCard class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ stats.totalRegistrations }}</div>
            <div class="text-gray-500 mt-2">总报名人次</div>
          </AppCard>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AppCard>
            <h2 class="text-xl font-bold mb-4">活动类型分布</h2>
            <div v-for="(value, key) in stats.categoryDistribution" :key="key" class="mb-2">
              <div class="flex justify-between text-sm"><span>{{ key }}</span><span>{{ value }}%</span></div>
              <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-blue-600 h-2 rounded-full" :style="{ width: value + '%' }"></div></div>
            </div>
          </AppCard>
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
import AppPageContainer from '@/components/layout/AppPageContainer.vue'
import AppCard from '@/components/common/AppCard.vue'
import request from '@/api/request'
import { showApiError } from '@/api/request'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'

const stats = reactive({
  totalActivities: 0,
  totalUsers: 0,
  totalRegistrations: 0,
  averageCheckinRate: 0,
  categoryDistribution: {} as Record<string, number>
})

const fetchStatistics = async () => {
  try {
    const res = await request.get('/admin/statistics')
    const data = res.data.data
    stats.totalActivities = data.activities.total
    stats.totalUsers = data.user.total
    stats.totalRegistrations = data.total_participation_count
    stats.averageCheckinRate = parseFloat(data.average_checkin_rate) || 0
    stats.categoryDistribution = data.activities.by_categories || {}
  } catch (e) {
    showApiError(e, '获取统计数据失败')
  }
}

onMounted(() => {
  fetchStatistics()
})
</script>