<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <!-- 顶部导航栏（与 dashboard 一致） -->
    <nav class="glass-nav sticky top-0 z-50 w-full px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <iconify-icon class="text-blue-600 text-xl" icon="ph:graduation-cap-fill"></iconify-icon>
          </div>
          <span class="text-white font-bold text-xl tracking-tight">CampusActivity</span>
        </div>
        <div class="hidden md:flex items-center gap-6">
          <a class="text-white font-medium border-b-2 border-white pb-1" href="#">首页</a>
          <a class="text-white/70 hover:text-white transition-colors" href="#">关于</a>
          <a class="text-white/70 hover:text-white transition-colors" href="#">联系</a>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button class="text-white/80 hover:text-white relative">
          <iconify-icon class="text-2xl" icon="ph:bell-bold"></iconify-icon>
          <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-blue-600"></span>
        </button>
        <div class="flex items-center gap-3 pl-4 border-l border-white/20">
          <div class="text-right hidden sm:block">
            <p class="text-white text-sm font-medium">管理员</p>
            <p class="text-white/60 text-xs">超级权限</p>
          </div>
          <div class="relative group cursor-pointer">
            <img
              alt="Admin Avatar"
              class="w-10 h-10 rounded-full border-2 border-white/30 object-cover"
              src="https://modao.cc/agent-py/media/generated_images/2026-05-15/8eb007fda4b34653a3e2673b81eafd5d.jpg"
            />
            <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
              <a class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" href="#">
                <iconify-icon icon="ph:user-bold"></iconify-icon> 个人中心
              </a>
              <a class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" href="#">
                <iconify-icon icon="ph:gear-bold"></iconify-icon> 系统设置
              </a>
              <hr class="my-1 border-slate-100">
              <a class="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50" href="#">
                <iconify-icon icon="ph:sign-out-bold"></iconify-icon> 退出登录
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-[1440px] mx-auto px-6 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-2 text-white/60 text-sm mb-2">
          <span>审核管理</span>
          <iconify-icon class="text-[10px]" icon="ph:caret-right-bold"></iconify-icon>
          <span class="text-white/90">活动审核</span>
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">活动审核</h1>
      </div>

      <!-- 大卡片：包含筛选栏和活动列表 -->
      <div class="bg-white rounded-2xl shadow-md overflow-hidden">
        <!-- 筛选栏 -->
        <div class="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">开始日期</label>
            <input type="date" v-model="filters.startDate" class="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">结束日期</label>
            <input type="date" v-model="filters.endDate" class="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">审核状态</label>
            <select v-model="filters.status" class="border rounded-lg px-3 py-2 text-sm">
              <option value="all">全部</option>
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
          <div>
            <button @click="applyFilters" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">筛选</button>
            <button @click="resetFilters" class="ml-2 px-4 py-2 border border-slate-300 rounded-lg text-sm">重置</button>
          </div>
        </div>

        <!-- 活动列表（每行三个框） -->
        <div class="divide-y divide-slate-100">
          <div v-for="act in filteredActivities" :key="act.id" class="p-6 flex flex-wrap items-center justify-between gap-4">
            <!-- 第一个框：活动标题（可点击查看详情） -->
            <div class="flex-1 min-w-[200px]">
              <button @click="viewDetail(act.id)" class="text-left font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                {{ act.title }}
              </button>
              <div class="text-xs text-slate-400 mt-1">
                {{ act.organizer }} · {{ act.date }}
              </div>
            </div>
            <!-- 第二个框：状态 -->
            <div class="w-28">
              <span
                :class="{
                  'bg-yellow-100 text-yellow-700': act.status === 'pending',
                  'bg-green-100 text-green-700': act.status === 'approved',
                  'bg-red-100 text-red-700': act.status === 'rejected'
                }"
                class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ act.status === 'pending' ? '待审核' : act.status === 'approved' ? '已通过' : '已拒绝' }}
              </span>
            </div>
            <!-- 第三个框：操作按钮 -->
            <div class="w-36 flex gap-2">
              <button
                v-if="act.status !== 'approved'"
                @click="approve(act.id)"
                class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                接受
              </button>
              <button
                v-if="act.status !== 'rejected'"
                @click="reject(act.id)"
                class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                拒绝
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredActivities.length === 0" class="py-16 text-center text-slate-400">
          暂无符合条件的活动
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="max-w-[1440px] mx-auto px-6 py-8 mt-12 border-t border-white/10">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-white/60 text-sm">© 2026 CampusActivity 校园活动管理平台. 保留所有权利.</p>
        <div class="flex items-center gap-6">
          <a class="text-white/40 hover:text-white transition-colors text-sm" href="#">使用条款</a>
          <a class="text-white/40 hover:text-white transition-colors text-sm" href="#">隐私政策</a>
          <a class="text-white/40 hover:text-white transition-colors text-sm" href="#">系统状态</a>
        </div>
      </div>
    </footer>

    <!-- Toast 容器 -->
    <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3" id="toast-container"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ==================== 模拟数据（后续替换为 API 调用） ====================
// TODO: 替换为 API 获取全部活动列表，例如 const { data } = await axios.get('/api/admin/activities')
const allActivities = ref([
  { id: 1, title: '2026 校园歌手大赛', organizer: '学生会文艺部', date: '2026-06-01', status: 'pending' },
  { id: 2, title: '春季 48h 编程马拉松', organizer: '计算机学院科协', date: '2026-05-20', status: 'approved' },
  { id: 3, title: '心理健康专题讲座', organizer: '心理咨询中心', date: '2026-05-25', status: 'rejected' },
  { id: 4, title: '毕业季创意跳蚤市场', organizer: '创业者协会', date: '2026-06-10', status: 'pending' },
  { id: 5, title: '新生迎新晚会', organizer: '校学生会', date: '2026-07-01', status: 'pending' },
])

// 筛选条件
const filters = ref({
  startDate: '',
  endDate: '',
  status: 'all'
})

// 应用筛选（前端模拟，实际应由后端接口筛选）
// TODO: 复杂筛选应通过 API 请求参数实现，例如 axios.get('/api/admin/activities', { params: filters.value })
const filteredActivities = computed(() => {
  let result = allActivities.value

  if (filters.value.status !== 'all') {
    result = result.filter(a => a.status === filters.value.status)
  }

  if (filters.value.startDate) {
    result = result.filter(a => a.date >= filters.value.startDate)
  }
  if (filters.value.endDate) {
    result = result.filter(a => a.date <= filters.value.endDate)
  }
  return result
})

// 手动触发筛选（可触发 API 刷新，目前使用 computed 自动更新）
const applyFilters = () => {
  // TODO: 调用 API 获取筛选后的数据，例如 fetchActivities(filters.value)
  console.log('筛选条件:', filters.value)
  // 由于使用 computed，无需额外操作；实际 API 时需重新赋值 allActivities
}

const resetFilters = () => {
  filters.value = { startDate: '', endDate: '', status: 'all' }
  // TODO: 重新获取全部活动数据
}

// 审核操作
// TODO: 替换为真实的 API 请求，例如 await axios.post(`/api/admin/activities/${id}/approve`)
const approve = (id) => {
  const act = allActivities.value.find(a => a.id === id)
  if (act && act.status !== 'approved') {
    act.status = 'approved'
    showToast(`已接受活动: ${act.title}`, 'success')
    // TODO: 成功后刷新列表（可重新调用 API）
  }
}

const reject = (id) => {
  const act = allActivities.value.find(a => a.id === id)
  if (act && act.status !== 'rejected') {
    act.status = 'rejected'
    showToast(`已拒绝活动: ${act.title}`, 'error')
  }
}

// 查看详情（跳转到活动详情页，路由可能需要先定义）
// TODO: 根据实际路由调整路径，可能需要传入活动 ID
const viewDetail = (id) => {
  router.push(`/admin/activity-detail/${id}`)
  console.log('查看详情', id)
}

// Toast 提示（与 dashboard 一致）
const showToast = (message, type) => {
  const container = document.getElementById('toast-container')
  if (!container) return
  const toast = document.createElement('div')
  const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
  const icon = type === 'success' ? 'ph:check-circle-bold' : 'ph:x-circle-bold'
  toast.className = `${bgColor} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 transform translate-y-10 opacity-0 transition-all duration-300`
  toast.innerHTML = `<iconify-icon icon="${icon}" class="text-xl"></iconify-icon><span class="font-medium">${message}</span>`
  container.appendChild(toast)
  setTimeout(() => toast.classList.remove('translate-y-10', 'opacity-0'), 10)
  setTimeout(() => {
    toast.classList.add('translate-y-[-20px]', 'opacity-0')
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}
</script>

<style scoped>
/* 与 dashboard 相同的样式 */
.glass-nav {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>