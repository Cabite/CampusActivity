<template>
  <div class="flex h-screen">
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
        <p class="truncate">XX社团</p>
        <button @click="logout" class="text-red-500 hover:text-red-700 mt-2 text-left">退出登录</button>
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <AppPageContainer variant="gradient" padding="lg" max-width="2xl">
        <div class="mb-4">
          <AppButton variant="link" @click="goBack" class="text-white">
            <iconify-icon icon="ph:arrow-left-bold"></iconify-icon> 返回
          </AppButton>
        </div>

        <AppCard :loading="loading">
          <h2 class="text-xl font-bold mb-4">数据统计 - {{ activityName }}</h2>

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
              <h3 class="text-md font-semibold text-center mb-3">性别分布</h3>
              <div v-for="(value, key) in stats.byGender" :key="key" class="mb-2">
                <div class="flex justify-between text-sm"><span>{{ key }}</span><span>{{ value }}%</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-blue-600 h-2 rounded-full" :style="{ width: value + '%' }"></div></div>
              </div>
            </div>
            <div class="border rounded-xl p-4">
              <h3 class="text-md font-semibold text-center mb-3">专业分布</h3>
              <div v-for="(value, key) in stats.byMajor" :key="key" class="mb-2">
                <div class="flex justify-between text-sm"><span>{{ key }}</span><span>{{ value }}%</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-green-600 h-2 rounded-full" :style="{ width: value + '%' }"></div></div>
              </div>
            </div>
            <div class="border rounded-xl p-4">
              <h3 class="text-md font-semibold text-center mb-3">年级分布</h3>
              <div v-for="(value, key) in stats.byGrade" :key="key" class="mb-2">
                <div class="flex justify-between text-sm"><span>{{ key }}</span><span>{{ value }}%</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-yellow-600 h-2 rounded-full" :style="{ width: value + '%' }"></div></div>
              </div>
            </div>
            <div class="border rounded-xl p-4">
              <h3 class="text-md font-semibold text-center mb-3">学院分布</h3>
              <div v-for="(value, key) in stats.byCollege" :key="key" class="mb-2">
                <div class="flex justify-between text-sm"><span>{{ key }}</span><span>{{ value }}%</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-red-600 h-2 rounded-full" :style="{ width: value + '%' }"></div></div>
              </div>
            </div>
          </div>
        </AppCard>
      </AppPageContainer>
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

const router = useRouter()
const route = useRoute()
const activityId = Number(route.query.activityId)
const loading = ref(false)
const activityName = ref('校园歌手大赛')

const stats = reactive({
  totalRegistered: 45,
  checkedInCount: 30,
  checkinRate: 67,
  byGender: {} as Record<string, number>,
  byMajor: {} as Record<string, number>,
  byGrade: {} as Record<string, number>,
  byCollege: {} as Record<string, number>
})

// 模拟数据
const mockStats = {
  totalRegistered: 45,
  checkedInCount: 30,
  checkinRate: 67,
  byGender: { '男': 60, '女': 40 },
  byMajor: { '计算机科学与技术': 40, '软件工程': 30, '信息管理与信息系统': 30 },
  byGrade: { '2024级': 40, '2023级': 40, '2022级': 20 },
  byCollege: { '计算机学院': 40, '软件学院': 30, '信息学院': 20, '经管学院': 10 }
}

const fetchStats = async () => {
  if (!activityId) return
  loading.value = true
  try {
    const res = await getRegistrationStats(activityId)
    if (res.code === 200) {
      const d = res.data
      stats.totalRegistered = d.total_registered
      stats.checkedInCount = d.total_checked
      stats.checkinRate = d.total_registered ? Math.round((d.total_checked / d.total_registered) * 100) : 0
      stats.byGender = d.by_gender || {}
      stats.byMajor = d.by_major || {}
      stats.byGrade = d.by_grade || {}
      stats.byCollege = d.by_college || {}
    } else throw new Error()
  } catch {
    Object.assign(stats, mockStats)
  } finally {
    loading.value = false
  }
}

const goBack = () => router.back()
const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchStats()
})
</script>