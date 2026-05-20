<template>
  <div class="flex h-screen">
    <!-- 侧边栏 -->
    <aside class="w-64 bg-white shadow-md flex flex-col z-10">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-blue-600">CampusActivity</h1>
        <p class="text-xs text-gray-500">组织者面板</p>
      </div>
      <nav class="flex-1 p-2 space-y-1">
        <router-link to="/organizer/dashboard" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
          <iconify-icon icon="ph:gauge" class="mr-2 w-5 h-5"></iconify-icon> 工作台
        </router-link>
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

    <!-- 主内容区 -->
    <main class="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <AppPageContainer variant="gradient" padding="lg" max-width="2xl">
        <div class="flex justify-between items-center mb-6">
          <div>
            <div class="flex items-center gap-2 text-white/60 text-sm mb-1">
              <span>组织者</span>
              <iconify-icon class="text-[10px]" icon="ph:caret-right-bold"></iconify-icon>
              <span class="text-white/90">工作台</span>
            </div>
            <h1 class="text-3xl font-bold text-white">组织者工作台</h1>
          </div>
          <AppButton variant="blue" @click="goToCreateActivity">
            <iconify-icon icon="ph:plus-bold"></iconify-icon> 创建活动
          </AppButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AppCard class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ stats.myActivities }}</div>
            <div class="text-gray-500 mt-2">我的活动</div>
          </AppCard>
          <AppCard class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ stats.totalRegistrations }}</div>
            <div class="text-gray-500 mt-2">累计报名人次</div>
          </AppCard>
          <AppCard class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ stats.ongoingActivities }}</div>
            <div class="text-gray-500 mt-2">进行中的活动</div>
          </AppCard>
        </div>

        <AppCard :clickable="false">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">最近活动</h2>
            <AppButton variant="link" @click="goToActivityList">查看全部活动</AppButton>
          </div>
          <div v-if="loading" class="text-center py-8">加载中...</div>
          <div v-else-if="recentActivities.length === 0" class="text-gray-400 text-center py-8">暂无活动</div>
          <div v-else class="space-y-4">
            <div v-for="act in recentActivities" :key="act.id" class="border-b pb-3 last:border-0">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold">{{ act.title }}</h3>
                  <div class="text-sm text-gray-500">{{ act.startTime }} · {{ act.location }}</div>
                  <div class="text-sm mt-1">报名 {{ act.current }}/{{ act.max }} · {{ act.statusText }}</div>
                </div>
                <div class="flex gap-2">
                  <AppButton size="sm" variant="outline" @click="goToRegistrations(act.id)">报名列表</AppButton>
                  <AppButton size="sm" variant="outline" @click="goToSignRecords(act.id)">签到记录</AppButton>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </AppPageContainer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppPageContainer from '@/components/layout/AppPageContainer.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()
const loading = ref(false)

const stats = ref({
  myActivities: 6,
  totalRegistrations: 187,
  ongoingActivities: 2
})

const recentActivities = ref([
  { id: 1, title: '校园歌手大赛', startTime: '2026-06-10 18:00', location: '报告厅', current: 45, max: 100, status: 'open', statusText: '报名中' },
  { id: 2, title: 'AI学术讲座', startTime: '2026-06-15 14:00', location: '教学楼101', current: 50, max: 50, status: 'open', statusText: '报名中' },
  { id: 3, title: '社区志愿服务', startTime: '2026-06-20 08:00', location: '社区中心', current: 12, max: 30, status: 'ongoing', statusText: '进行中' }
])

const goToCreateActivity = () => router.push('/organizer/activity')
const goToActivityList = () => router.push('/organizer/activities')
const goToRegistrations = (id: number) => router.push(`/organizer/registrations?activityId=${id}`)
const goToSignRecords = (id: number) => router.push(`/organizer/signs?activityId=${id}`)

const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  loading.value = false
})
</script>