<template>
  <div class="flex h-screen">
    <!-- 侧边栏 -->
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

    <!-- 主内容区：保留原有全部内容 -->
    <main class="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <AppPageContainer variant="gradient" padding="lg" max-width="2xl">
        <!-- 以下为原 Dashboard.vue 的完整内容，未做任何删改 -->
        <div class="mb-6">
          <div class="flex items-center gap-2 text-white/60 text-sm mb-1">
            <span>控制台</span>
            <iconify-icon class="text-[10px]" icon="ph:caret-right-bold"></iconify-icon>
            <span class="text-white/90">概览</span>
          </div>
          <h1 class="text-3xl font-bold text-white">管理员控制台</h1>
        </div>

        <!-- 统计卡片 -->
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
            <div class="text-3xl font-bold text-orange-500">{{ stats.pendingActivities }}</div>
            <div class="text-gray-500 mt-2">待审核活动</div>
          </AppCard>
        </div>

        <!-- 待审核活动清单 -->
        <div class="lg:col-span-2">
          <AppCard :clickable="false">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">待审核活动清单</h2>
              <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">实时更新</span>
            </div>
            <div v-if="loadingPending" class="text-center py-8">加载中...</div>
            <div v-else-if="pendingActivities.length === 0" class="text-center py-8 text-gray-400">暂无待审核活动</div>
            <div v-else class="space-y-3">
              <div v-for="act in pendingActivities" :key="act.id" class="flex justify-between items-center p-3 border rounded-xl">
                <div>
                  <div class="font-bold">{{ act.name }}</div>
                  <div class="text-sm text-gray-500">{{ act.organizer_name }} · {{ act.submitted_at }}</div>
                </div>
                <div class="flex gap-2">
                  <AppButton size="sm" variant="blue" @click="goToAuditDetail(act.id)">查看详情</AppButton>
                </div>
              </div>
            </div>
            <div v-if="pendingTotalPages > 1" class="flex justify-center mt-4 gap-2">
              <button v-for="p in pendingTotalPages" :key="p" @click="fetchPendingActivities(p)" class="px-2 py-1 text-xs border rounded">{{ p }}</button>
            </div>
          </AppCard>
        </div>

        <!-- 右侧公告预览（可选） -->
        <div>
          <AppCard :clickable="false">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold flex items-center gap-2">
                <iconify-icon icon="ph:megaphone-simple-bold" class="text-blue-600"></iconify-icon>
                最新系统公告
              </h3>
              <AppButton variant="link" size="sm" @click="goToAnnouncement">更多</AppButton>
            </div>
            <div v-if="latestAnnouncement">
              <p class="text-xs text-gray-400">{{ latestAnnouncement.created_at }}</p>
              <p class="text-sm font-semibold mt-1">{{ latestAnnouncement.title }}</p>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ latestAnnouncement.content }}</p>
            </div>
            <div v-else class="text-gray-400 text-center py-4">暂无公告</div>
          </AppCard>
        </div>
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
const loadingPending = ref(false)

const stats = ref({
  totalActivities: 124,
  totalUsers: 3456,
  pendingActivities: 4
})

const pendingActivities = ref<any[]>([])
const pendingPage = ref(1)
const pendingTotalPages = ref(1)
const pageSize = 5

const latestAnnouncement = ref<any>(null)

// 模拟数据
const mockStats = {
  totalActivities: 124,
  totalUsers: 3456,
  pendingActivities: 4
}
const mockPendingActivities = [
  { id: 1, name: '校园歌手大赛', organizer_name: '学生会文艺部', submitted_at: '2026-06-01 10:00', status: 'pending' },
  { id: 2, name: '春季48h编程马拉松', organizer_name: '计算机学院科协', submitted_at: '2026-05-20 14:30', status: 'pending' }
]
const mockAnnouncement = {
  id: 1,
  title: '系统将于本周末进行数据库迁移维护',
  content: '为了提供更稳定的服务，我们将于周六凌晨2:00至6:00进行停机维护...',
  created_at: '2026-05-14 09:00'
}

const fetchStatistics = async () => {
  try {
    // 真实 API 调用（暂注释）
    // const res = await getAdminStatistics()
    // if (res.code === 200) { ... }
    throw new Error('API not implemented')
  } catch {
    stats.value = mockStats
  }
}

const fetchPendingActivities = async (page = 1) => {
  loadingPending.value = true
  pendingPage.value = page
  try {
    // const res = await getAdminActivities({ type: 'pending', page, page_size: pageSize })
    throw new Error('API not implemented')
  } catch {
    pendingActivities.value = mockPendingActivities
    pendingTotalPages.value = 1
  } finally {
    loadingPending.value = false
  }
}

const fetchLatestAnnouncement = async () => {
  try {
    // const res = await getAnnouncements({ page: 1, page_size: 1 })
    throw new Error('API not implemented')
  } catch {
    latestAnnouncement.value = mockAnnouncement
  }
}

const goToAuditDetail = (id: number) => router.push(`/admin/audit/${id}`)
const goToAnnouncement = () => router.push('/admin/announcements')

const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchStatistics()
  fetchPendingActivities()
  fetchLatestAnnouncement()
})
</script>