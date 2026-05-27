<template>
  <div class="flex h-screen">
    <!-- 侧边栏 -->
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

    <!-- 主内容区 -->
    <main class="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <AppPageContainer variant="gradient" padding="lg" max-width="2xl">
        <div class="flex justify-between items-center mb-6">
          <div>
            <div class="flex items-center gap-2 text-white/60 text-sm mb-1">
              <span>活动管理</span>
              <iconify-icon class="text-[10px]" icon="ph:caret-right-bold"></iconify-icon>
              <span class="text-white/90">我的活动</span>
            </div>
            <h1 class="text-3xl font-bold text-white">活动管理</h1>
          </div>
          <AppButton variant="blue" @click="goToCreateActivity">
            <iconify-icon icon="ph:plus-bold"></iconify-icon> 创建活动
          </AppButton>
        </div>

        <!-- 状态筛选按钮组 -->
        <div class="mb-6">
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="text-white/70 text-sm mr-2 self-center">状态：</span>
            <button
              v-for="group in statusGroups"
              :key="group.key"
              @click="setGroup(group.key)"
              class="px-4 py-1.5 rounded-full border transition"
              :class="currentGroup === group.key ? 'bg-blue-600 text-white border-blue-600' : 'border-white/30 text-white/80 hover:bg-white/10'"
            >
              {{ group.label }}
            </button>
          </div>
          <div class="flex flex-wrap gap-2 pl-2" v-if="subStatuses.length">
            <button
              v-for="sub in subStatuses"
              :key="sub.key"
              @click="setSubStatus(sub.key)"
              class="px-3 py-1 rounded-full text-sm border transition"
              :class="currentSubStatus === sub.key ? 'bg-blue-600 text-white border-blue-600' : 'border-white/30 text-white/80 hover:bg-white/10'"
            >
              {{ sub.label }}
            </button>
          </div>
        </div>

        <!-- 筛选栏 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-4 items-end">
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
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">活动名称</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">分类</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">开始时间</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">校区</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">地点</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="act in activities" :key="act.id" class="hover:bg-gray-50 cursor-pointer" @dblclick="goToDetail(act.id)">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ act.title }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ act.categoryName }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ act.startTime }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ act.campus }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ act.location }}</td>
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
        </div>
      </AppPageContainer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppPageContainer from '@/components/layout/AppPageContainer.vue'
import AppButton from '@/components/common/AppButton.vue'
import { getMyActivities, getCategories } from '@/api/organizer'

const router = useRouter()
const loading = ref(false)
const activities = ref<any[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10
const categories = ref<{ id: number; name: string }[]>([])
const currentGroup = ref('all')
const currentSubStatus = ref('')
const filters = reactive({
  categoryId: '',
  startDateFrom: '',
  startDateTo: ''
})

const statusGroups = [
  { key: 'all', label: '全部' },
  { key: 'unpublished', label: '未发布活动' },
  { key: 'published', label: '发布中活动' },
  { key: 'ended', label: '已结束活动' }
]
const unpublishedSubStatuses = [
  { key: '', label: '全部' },
  { key: 'pending', label: '待审核' },
  { key: 'modifying', label: '审核中' },
  { key: 'rejected', label: '审核未通过' },
  { key: 'shelved', label: '下架' }
]
const publishedSubStatuses = [
  { key: '', label: '全部' },
  { key: 'open', label: '报名中' },
  { key: 'edit_pending', label: '审核修改中' },
  { key: 'ongoing', label: '进行中' }
]

const subStatuses = computed(() => {
  if (currentGroup.value === 'unpublished') return unpublishedSubStatuses
  if (currentGroup.value === 'published') return publishedSubStatuses
  return []
})

const statusTextMap: Record<string, string> = {
  pending: '待审核', modifying: '审核中', rejected: '审核未通过', shelved: '下架',
  open: '报名中', edit_pending: '审核修改中', ongoing: '进行中', ended: '已结束'
}
const statusColorMap: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', modifying: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700', shelved: 'bg-gray-100 text-gray-700',
  open: 'bg-green-100 text-green-700', ongoing: 'bg-indigo-100 text-indigo-700',
  ended: 'bg-slate-100 text-slate-700'
}
const statusText = (s: string) => statusTextMap[s] || s
const statusColorClass = (s: string) => statusColorMap[s] || 'bg-gray-100 text-gray-700'

// 模拟数据
const mockCategories = [
  { id: 1, name: '学术类' },
  { id: 2, name: '文体类' },
  { id: 3, name: '志愿服务类' }
]
const mockActivities = [
  { id: 1, title: '校园歌手大赛', categoryName: '文体类', startTime: '2026-06-10 18:00', campus: '校本部', location: '报告厅', status: 'pending' },
  { id: 2, title: 'AI学术讲座', categoryName: '学术类', startTime: '2026-06-15 14:00', campus: '北校区', location: '教学楼101', status: 'open' },
  { id: 3, title: '社区志愿服务', categoryName: '志愿服务类', startTime: '2026-06-20 08:00', campus: '南校区', location: '社区中心', status: 'ongoing' }
]

const fetchCategories = async () => {
  try {
    const res = await getCategories()
    if (res.code === 200 && res.data) {
      const flat: any[] = []
      res.data.forEach((cat: any) => {
        flat.push({ id: cat.id, name: cat.name })
        if (cat.children) {
          cat.children.forEach((child: any) => flat.push({ id: child.id, name: child.name }))
        }
      })
      categories.value = flat
    } else throw new Error()
  } catch {
    categories.value = mockCategories
  }
}

const fetchActivities = async () => {
  loading.value = true
  try {
    let statusParam = ''
    if (currentGroup.value === 'unpublished') {
      statusParam = currentSubStatus.value || 'pending,modifying,rejected,shelved'
    } else if (currentGroup.value === 'published') {
      statusParam = currentSubStatus.value || 'open,edit_pending,ongoing'
    } else if (currentGroup.value === 'ended') {
      statusParam = 'ended'
    }
    const params: any = {
      page: currentPage.value,
      page_size: pageSize,
      status: statusParam || undefined,
      category_id: filters.categoryId || undefined,
      start_date: filters.startDateFrom || undefined
    }
    const res = await getMyActivities(params)
    if (res.code === 200) {
      const list = res.data.list || []
      activities.value = list.map((a: any) => ({
        id: a.activity_id,
        title: a.name,
        categoryName: a.category_name,
        startTime: a.start_time,
        campus: a.campus,
        location: a.location,
        status: a.status
      }))
      totalPages.value = Math.ceil(res.data.total / pageSize)
    } else {
      throw new Error('API error')
    }
  } catch {
    activities.value = mockActivities
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const setGroup = (group: string) => {
  currentGroup.value = group
  currentSubStatus.value = ''
  fetchActivities()
}
const setSubStatus = (sub: string) => {
  currentSubStatus.value = sub
  fetchActivities()
}
const applyFilters = () => {
  currentPage.value = 1
  fetchActivities()
}
const resetFilters = () => {
  filters.categoryId = ''
  filters.startDateFrom = ''
  filters.startDateTo = ''
  fetchActivities()
}
const goToPage = (page: number) => {
  currentPage.value = page
  fetchActivities()
}
const goToDetail = (id: number) => router.push(`/organizer/activity?id=${id}`)
const goToCreateActivity = () => router.push('/organizer/activity')
const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchCategories()
  fetchActivities()
})
</script>