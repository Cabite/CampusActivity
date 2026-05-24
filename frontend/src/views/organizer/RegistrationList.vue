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
          <div class="flex items-center gap-4 mb-6">
            <h2 class="text-xl font-bold text-gray-800">报名管理 - {{ activityName }}</h2>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>📅 活动时间：{{ activityTime }}</div>
            <div>🏫 校区：{{ activityCampus }}</div>
            <div>📍 地点：{{ activityLocation }}</div>
            <div>👥 报名人数：{{ totalRegistered }} / {{ maxParticipants }}</div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">学号</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">学院</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">专业</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">年级</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">报名时间</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="reg in registrations" :key="reg.id">
                  <td class="px-6 py-4 text-sm">{{ reg.studentId }}</td>
                  <td class="px-6 py-4 text-sm">{{ reg.college }}</td>
                  <td class="px-6 py-4 text-sm">{{ reg.major }}</td>
                  <td class="px-6 py-4 text-sm">{{ reg.grade }}</td>
                  <td class="px-6 py-4 text-sm">{{ reg.registeredAt }}</td>
                  <td class="px-6 py-4">
                    <AppButton size="sm" variant="destructive" @click="openRejectModal(reg.id)">拒绝</AppButton>
                  </td>
                <tr>
                <tr v-if="!loading && registrations.length === 0">
                  <td colspan="6" class="text-center py-8 text-gray-400">暂无报名记录</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-2">
            <button v-for="p in totalPages" :key="p" @click="goToPage(p)" class="px-3 py-1 rounded border" :class="p === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700'">{{ p }}</button>
          </div>
        </AppCard>

        <AppDialog v-model:open="rejectModalVisible" title="拒绝报名" confirm-text="确认拒绝" cancel-text="取消" @confirm="confirmReject">
          <textarea v-model="rejectReason" rows="3" placeholder="请输入拒绝理由" class="w-full border rounded-lg px-3 py-2"></textarea>
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
import { getActivityRegistrations, rejectRegistration } from '@/api/organizer'

const router = useRouter()
const route = useRoute()
const activityId = Number(route.query.activityId)
const loading = ref(false)

const activityName = ref('校园歌手大赛')
const activityTime = ref('2026-06-10 18:00 ~ 21:00')
const activityCampus = ref('校本部')
const activityLocation = ref('报告厅')
const totalRegistered = ref(5)
const maxParticipants = ref(100)

const registrations = ref<any[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

// 模拟数据
const mockRegistrations = [
  { id: 1, studentId: '2024110101', college: '计算机学院', major: '计算机科学与技术', grade: '2024级', registeredAt: '2026-05-20 09:23' },
  { id: 2, studentId: '2023120202', college: '软件学院', major: '软件工程', grade: '2023级', registeredAt: '2026-05-21 10:15' },
  { id: 3, studentId: '2022110303', college: '信息学院', major: '信息管理', grade: '2022级', registeredAt: '2026-05-22 14:30' }
]

const fetchRegistrations = async () => {
  if (!activityId) return
  loading.value = true
  try {
    const res = await getActivityRegistrations(activityId, { page: currentPage.value, page_size: pageSize })
    if (res.code === 200) {
      const list = res.data.list || []
      registrations.value = list.map((r: any) => ({
        id: r.registration_id,
        studentId: r.student_id,
        college: r.college,
        major: r.major,
        grade: r.grade,
        registeredAt: r.registration_time
      }))
      totalPages.value = Math.ceil((res.data.total || 0) / pageSize)
      // 更新总报名人数（可根据实际接口返回调整）
      if (res.data.total !== undefined) totalRegistered.value = res.data.total
    } else throw new Error()
  } catch {
    // 降级模拟数据
    registrations.value = mockRegistrations
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

// 拒绝报名
const rejectModalVisible = ref(false)
const rejectReason = ref('')
let currentRejectId: number | null = null

const openRejectModal = (id: number) => {
  currentRejectId = id
  rejectReason.value = ''
  rejectModalVisible.value = true
}

const confirmReject = async () => {
  if (!rejectReason.value.trim()) {
    alert('请填写拒绝理由')
    return
  }
  try {
    await rejectRegistration(currentRejectId!, rejectReason.value)
    alert('已拒绝该报名')
    // 刷新列表
    await fetchRegistrations()
  } catch {
    // 降级：本地移除
    registrations.value = registrations.value.filter(r => r.id !== currentRejectId)
    totalRegistered.value--
    alert('已拒绝该报名（模拟）')
  }
  rejectModalVisible.value = false
}

const goBack = () => router.back()
const goToPage = (page: number) => {
  currentPage.value = page
  fetchRegistrations()
}
const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchRegistrations()
})
</script>