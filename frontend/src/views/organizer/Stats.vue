<template>
  <div class="flex h-screen">
    <OrganizerSidebar />
    <main class="flex-1 overflow-y-auto bg-blue-600 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-4">
          <AppButton variant="link" @click="goBack" class="text-white">
            <iconify-icon icon="ph:arrow-left-bold"></iconify-icon> 返回
          </AppButton>
        </div>

        <AppCard :loading="loading">
          <h2 class="text-xl font-bold mb-4 text-gray-800">数据统计 - 活动ID: {{ activityId }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-blue-50 rounded-xl p-4 text-center">
              <div class="text-3xl font-bold text-blue-600">{{ stats.totalRegistered }}</div>
              <div class="text-gray-600">报名人数</div>
            </div>
            <div class="bg-green-50 rounded-xl p-4 text-center">
              <div class="text-3xl font-bold text-green-600">{{ stats.checkedInCount }}</div>
              <div class="text-gray-600">签到人数</div>
            </div>
            <div class="bg-purple-50 rounded-xl p-4 text-center">
              <div class="text-3xl font-bold text-purple-600">{{ stats.checkinRate }}%</div>
              <div class="text-gray-600">签到率</div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="border rounded-xl p-4">
              <h3 class="text-md font-semibold text-center mb-3 text-gray-800">性别分布</h3>
              <div v-for="(value, key) in stats.byGender" :key="key" class="mb-2">
                <div class="flex justify-between text-sm"><span class="text-gray-700">{{ key }}</span><span class="text-gray-700">{{ value }}%</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-blue-600 h-2 rounded-full" :style="{ width: value + '%' }"></div></div>
              </div>
            </div>
            <div class="border rounded-xl p-4">
              <h3 class="text-md font-semibold text-center mb-3 text-gray-800">专业分布</h3>
              <div v-for="(value, key) in stats.byMajor" :key="key" class="mb-2">
                <div class="flex justify-between text-sm"><span class="text-gray-700">{{ key }}</span><span class="text-gray-700">{{ value }}%</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-green-600 h-2 rounded-full" :style="{ width: value + '%' }"></div></div>
              </div>
            </div>
            <div class="border rounded-xl p-4">
              <h3 class="text-md font-semibold text-center mb-3 text-gray-800">年级分布</h3>
              <div v-for="(value, key) in stats.byGrade" :key="key" class="mb-2">
                <div class="flex justify-between text-sm"><span class="text-gray-700">{{ key }}</span><span class="text-gray-700">{{ value }}%</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-yellow-600 h-2 rounded-full" :style="{ width: value + '%' }"></div></div>
              </div>
            </div>
            <div class="border rounded-xl p-4">
              <h3 class="text-md font-semibold text-center mb-3 text-gray-800">学院分布</h3>
              <div v-for="(value, key) in stats.byCollege" :key="key" class="mb-2">
                <div class="flex justify-between text-sm"><span class="text-gray-700">{{ key }}</span><span class="text-gray-700">{{ value }}%</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-red-600 h-2 rounded-full" :style="{ width: value + '%' }"></div></div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppPageContainer from '@/components/layout/AppPageContainer.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import { getRegistrationStats } from '@/api/organizer'
import { showApiError } from '@/api/request'
import OrganizerSidebar from '@/components/layout/OrganizerSidebar.vue'

const router = useRouter()
const route = useRoute()
const activityId = Number(route.query.activityId)
const loading = ref(false)
const stats = reactive({
  totalRegistered: 0,
  checkedInCount: 0,
  checkinRate: 0,
  byGender: {} as Record<string, number>,
  byMajor: {} as Record<string, number>,
  byGrade: {} as Record<string, number>,
  byCollege: {} as Record<string, number>
})

const fetchStats = async () => {
  if (!activityId) return
  loading.value = true
  try {
    const data = await getRegistrationStats(activityId)
    stats.totalRegistered = data.total_registered
    stats.checkedInCount = data.total_checked
    stats.checkinRate = data.total_registered ? Math.round((data.total_checked / data.total_registered) * 100) : 0
    stats.byGender = data.by_gender || {}
    stats.byMajor = data.by_major || {}
    stats.byGrade = data.by_grade || {}
    stats.byCollege = data.by_college || {}
  } catch (e) {
    showApiError(e, '获取统计数据失败')
  } finally {
    loading.value = false
  }
}
const goBack = () => router.back()

onMounted(() => {
  fetchStats()
})
</script>