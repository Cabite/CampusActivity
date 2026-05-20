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
        <!-- 以下为原 ActivityAudit.vue 的完整内容，未做任何删改 -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-white">活动审核</h1>
          <p class="text-white/70 mt-1">审核活动申请</p>
        </div>

        <!-- 筛选栏 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">审核状态</label>
            <select v-model="filters.status" class="border rounded-lg px-3 py-2 text-sm w-36">
              <option value="pending">未审核</option>
              <option value="end">已审核</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">活动分类</label>
            <select v-model="filters.categoryId" class="border rounded-lg px-3 py-2 text-sm w-36">
              <option value="">全部</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">开始时间(起)</label>
            <input type="date" v-model="filters.startDateFrom" class="border rounded-lg px-3 py-2 text-sm w-36">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">开始时间(止)</label>
            <input type="date" v-model="filters.startDateTo" class="border rounded-lg px-3 py-2 text-sm w-36">
          </div>
          <div>
            <button @click="applyFilters" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">筛选</button>
            <button @click="resetFilters" class="ml-2 px-4 py-2 border border-gray-300 rounded-lg text-sm">重置</button>
          </div>
        </div>

        <!-- 活动列表表格 -->
        <AppCard :loading="loading">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">活动名称</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">组织者</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">分类</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">开始时间</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">校区</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="act in activities" :key="act.id" class="hover:bg-gray-50 cursor-pointer" @dblclick="goToDetail(act.id)">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ act.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ act.organizer_name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ act.category_name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ act.start_time }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ act.campus }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded-full text-xs" :class="statusColorClass(act.status)">{{ statusText(act.status) }}</span>
                  </td>
                </tr>
                <tr v-if="!loading && activities.length === 0">
                  <td colspan="6" class="text-center py-8 text-gray-400">暂无活动</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-2">
            <button v-for="p in totalPages" :key="p" @click="goToPage(p)" class="px-3 py-1 rounded border" :class="p === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700'">{{ p }}</button>
          </div>
        </AppCard>
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
const loading = ref(false)
const activities = ref<any[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10
const categories = ref<{ id: number; name: string }[]>([])

const filters = reactive({
  status: 'pending',
  categoryId: '',
  startDateFrom: '',
  startDateTo: ''
})

// 模拟数据
const mockCategories = [
  { id: 1, name: '学术类' },
  { id: 2, name: '文体类' },
  { id: 3, name: '志愿服务类' }
]
const mockActivitiesPending = [
  { id: 1, name: '校园歌手大赛', organizer_name: '学生会文艺部', category_name: '文体类', start_time: '2026-06-10 18:00', campus: '校本部', status: 'pending' },
  { id: 2, name: '春季48h编程马拉松', organizer_name: '计算机学院科协', category_name: '学术类', start_time: '2026-05-20 14:00', campus: '北校区', status: 'pending' }
]
const mockActivitiesEnd = [
  { id: 3, name: 'AI学术讲座', organizer_name: '计算机学院科协', category_name: '学术类', start_time: '2026-06-15 14:00', campus: '北校区', status: 'approved' },
  { id: 4, name: '心理健康讲座', organizer_name: '心理咨询中心', category_name: '学术类', start_time: '2026-05-25 14:00', campus: '校本部', status: 'rejected' }
]

const statusText = (status: string) => {
  const map: Record<string, string> = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
  return map[status] || status
}
const statusColorClass = (status: string) => {
  const map: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' }
  return map[status] || 'bg-gray-100 text-gray-700'
}

const fetchCategories = async () => {
  try {
    // const res = await getCategories()
    throw new Error('API not implemented')
  } catch {
    categories.value = mockCategories
  }
}

const fetchActivities = async () => {
  loading.value = true
  try {
    // const res = await getAdminActivities({ ... })
    throw new Error('API not implemented')
  } catch {
    if (filters.status === 'pending') {
      activities.value = mockActivitiesPending
    } else {
      activities.value = mockActivitiesEnd
    }
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchActivities()
}
const resetFilters = () => {
  filters.status = 'pending'
  filters.categoryId = ''
  filters.startDateFrom = ''
  filters.startDateTo = ''
  applyFilters()
}
const goToPage = (page: number) => {
  currentPage.value = page
  fetchActivities()
}
const goToDetail = (id: number) => router.push(`/admin/audit/${id}`)

const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchCategories()
  fetchActivities()
})
</script>