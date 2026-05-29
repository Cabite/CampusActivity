<template>
  <div class="flex h-screen">
    <AdminSidebar />
    <main class="flex-1 overflow-y-auto bg-blue-600 p-6 custom-scrollbar">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-white">平台统计</h1>
          <p class="text-white/70 mt-1">平台数据总览</p>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div class="text-3xl font-bold text-blue-600">{{ stats.totalActivities }}</div>
            <div class="text-gray-500 mt-2">总活动数</div>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div class="text-3xl font-bold text-blue-600">{{ stats.totalUsers }}</div>
            <div class="text-gray-500 mt-2">总用户数</div>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div class="text-3xl font-bold text-blue-600">{{ stats.totalRegistrations }}</div>
            <div class="text-gray-500 mt-2">总报名人次</div>
          </div>
        </div>

        <!-- 活动类型分布 + 签到率统计 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 左侧：活动类型分布 -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-xl font-bold mb-4 text-gray-800">活动类型分布</h2>
            <div v-if="Object.keys(categoryDistribution).length === 0" class="text-center text-gray-400 py-8">
              暂无分类数据
            </div>
            <div v-else class="space-y-4">
              <div v-for="(count, name) in categoryDistribution" :key="name">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700">{{ name }}</span>
                  <span class="text-gray-500">{{ count }} 场</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full bg-blue-500"
                    :style="{ width: getCategoryPercent(count) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：签到率统计 -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-xl font-bold mb-4 text-gray-800">签到率统计</h2>
            <div class="text-center">
              <div class="text-6xl font-bold text-blue-600 mb-2">{{ stats.checkinRate }}%</div>
              <div class="text-gray-500 mb-6">整体签到率</div>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="text-xl font-bold text-gray-700">{{ stats.codeRate }}%</div>
                  <div class="text-sm text-gray-500">二维码签到</div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="text-xl font-bold text-gray-700">{{ stats.manualRate }}%</div>
                  <div class="text-sm text-gray-500">手动签到</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
import { getPlatformStatistics } from '@/api/admin'
import { showApiError } from '@/api/request'

const stats = ref({
  totalActivities: 0,
  totalUsers: 0,
  totalRegistrations: 0,
  checkinRate: 0,
  codeRate: 0,
  manualRate: 0
})

const categoryDistribution = ref<Record<string, number>>({})
const categoryTotalCount = ref(0)

const fetchStatistics = async () => {
  try {
    const data = await getPlatformStatistics()
    stats.value.totalActivities = data.activities?.total ?? 0
    stats.value.totalUsers = data.user?.total ?? 0
    stats.value.totalRegistrations = data.total_participation_count ?? 0
    const rateStr = data.average_checkin_rate ?? '0%'
    stats.value.checkinRate = parseFloat(rateStr.replace('%', '')) || 0
    categoryDistribution.value = data.activities?.by_categories ?? {}
    categoryTotalCount.value = Object.values(categoryDistribution.value).reduce((a, b) => a + b, 0)
  } catch (e) {
    showApiError(e, '获取统计数据失败')
  }
}

const getCategoryPercent = (count: number): number => {
  if (categoryTotalCount.value === 0) return 0
  return (count / categoryTotalCount.value) * 100
}

onMounted(() => {
  fetchStatistics()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>