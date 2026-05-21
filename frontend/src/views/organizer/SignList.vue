<template>
  <div class="flex h-screen">
    <!-- 侧边栏（同上） -->
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

    <main class="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <AppPageContainer variant="gradient" padding="lg" max-width="2xl">
        <div class="mb-4">
          <AppButton variant="link" @click="goBack" class="text-white">
            <iconify-icon icon="ph:arrow-left-bold"></iconify-icon> 返回
          </AppButton>
        </div>

        <AppCard :loading="loading">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">签到管理 - {{ activityName }}</h2>
            <AppButton variant="blue" @click="openManualSignModal">手动签到</AppButton>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>📅 活动时间：{{ activityTime }}</div>
            <div>🏫 校区：{{ activityCampus }}</div>
            <div>📍 地点：{{ activityLocation }}</div>
            <div>👥 已签到：{{ checkedInCount }} / {{ totalRegistered }}</div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">学号</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">学院</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">专业</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">年级</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">签到时间</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="sign in signRecords" :key="sign.userId">
                  <td class="px-6 py-4 text-sm">{{ sign.studentId }}</td>
                  <td class="px-6 py-4 text-sm">{{ sign.college }}</td>
                  <td class="px-6 py-4 text-sm">{{ sign.major }}</td>
                  <td class="px-6 py-4 text-sm">{{ sign.grade }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span v-if="sign.checkinTime" class="text-green-600">{{ sign.checkinTime }}</span>
                    <span v-else class="text-gray-400">未签到</span>
                  </td>
                </tr>
                <tr v-if="!loading && signRecords.length === 0">
                  <td colspan="5" class="text-center py-8 text-gray-400">暂无签到记录</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-2">
            <button v-for="p in totalPages" :key="p" @click="goToPage(p)" class="px-3 py-1 rounded border" :class="p === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700'">{{ p }}</button>
          </div>
        </AppCard>

        <AppDialog v-model:open="manualSignModalVisible" title="手动签到" confirm-text="确认签到" cancel-text="取消" @confirm="confirmManualSign">
          <div class="space-y-3">
            <input v-model="manualStudentId" placeholder="请输入学号" class="w-full border rounded px-3 py-2">
          </div>
        </AppDialog>
      </AppPageContainer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppPageContainer from '@/components/layout/AppPageContainer.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppDialog from '@/components/layout/AppDialog.vue'

const router = useRouter()
const route = useRoute()
const activityId = Number(route.query.activityId)
const loading = ref(false)

const activityName = ref('校园歌手大赛')
const activityTime = ref('2026-06-10 18:00 ~ 21:00')
const activityCampus = ref('校本部')
const activityLocation = ref('报告厅')
const totalRegistered = ref(45)
const checkedInCount = ref(30)

const signRecords = ref<any[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

const mockSignRecords = [
  { userId: 1, studentId: '2024110101', college: '计算机学院', major: '计算机科学与技术', grade: '2024级', checkinTime: '2026-06-10 18:30' },
  { userId: 2, studentId: '2023120202', college: '软件学院', major: '软件工程', grade: '2023级', checkinTime: '2026-06-10 19:00' },
  { userId: 3, studentId: '2022110303', college: '信息学院', major: '信息管理', grade: '2022级', checkinTime: '' }
]

const fetchSignRecords = async () => {
  if (!activityId) return
  loading.value = true
  setTimeout(() => {
    signRecords.value = mockSignRecords
    totalPages.value = 1
    loading.value = false
  }, 100)
}

const manualSignModalVisible = ref(false)
const manualStudentId = ref('')

const openManualSignModal = () => {
  manualStudentId.value = ''
  manualSignModalVisible.value = true
}

const confirmManualSign = async () => {
  if (!manualStudentId.value.trim()) {
    alert('请输入学号')
    return
  }
  alert(`已为学号 ${manualStudentId.value} 手动签到`)
  await fetchSignRecords()
  manualSignModalVisible.value = false
}

const goBack = () => router.back()
const goToPage = (page: number) => {
  currentPage.value = page
  fetchSignRecords()
}

const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchSignRecords()
})
</script>