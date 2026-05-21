<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <!-- 顶部导航栏（后续可替换为全局 AppNavbar） -->
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
      <!-- 页面主标题 -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-white/60 text-sm mb-2">
          <span>控制台</span>
          <iconify-icon class="text-[10px]" icon="ph:caret-right-bold"></iconify-icon>
          <span class="text-white/90">概览</span>
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">管理员控制台</h1>
      </div>

      <!-- 统计卡片区域 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-md flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-slate-500 font-medium text-sm">总活动数</p>
              <h3 class="text-4xl font-bold mt-2 tracking-tight">{{ stats.totalActivities }}</h3>
            </div>
            <div class="p-3 bg-blue-50 rounded-xl">
              <iconify-icon class="text-blue-600 text-2xl" icon="ph:calendar-check-bold"></iconify-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-medium">
            <iconify-icon icon="ph:trend-up-bold"></iconify-icon>
            <span>↑12%</span>
            <span class="text-slate-400 font-normal ml-1">较上月</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-md flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-slate-500 font-medium text-sm">总用户数</p>
              <h3 class="text-4xl font-bold mt-2 tracking-tight">{{ stats.totalUsers }}</h3>
            </div>
            <div class="p-3 bg-indigo-50 rounded-xl">
              <iconify-icon class="text-indigo-600 text-2xl" icon="ph:users-three-bold"></iconify-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-medium">
            <iconify-icon icon="ph:trend-up-bold"></iconify-icon>
            <span>↑8%</span>
            <span class="text-slate-400 font-normal ml-1">较上月</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-md flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-slate-500 font-medium text-sm">待审核活动</p>
              <h3 class="text-4xl font-bold mt-2 tracking-tight" :class="pendingCount === 0 ? 'text-slate-400' : 'text-orange-500'">
                {{ pendingCount }}
              </h3>
            </div>
            <div class="p-3 bg-orange-50 rounded-xl">
              <iconify-icon class="text-orange-500 text-2xl" icon="ph:clock-countdown-bold"></iconify-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-orange-500 text-sm font-medium">
            <iconify-icon icon="ph:warning-circle-bold"></iconify-icon>
            <span>需要尽快处理</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：待审核活动清单 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 h-full flex flex-col">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 class="text-xl font-bold text-slate-800">待审核活动清单</h2>
              <span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">实时更新</span>
            </div>
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 max-h-[500px]" v-if="pendingActivities.length > 0">
              <div
                v-for="activity in pendingActivities"
                :key="activity.id"
                class="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <iconify-icon class="text-blue-600 text-2xl" :icon="activity.icon"></iconify-icon>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900">{{ activity.title }}</h4>
                    <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <p class="text-sm text-slate-500 flex items-center gap-1">
                        <iconify-icon icon="ph:user-circle"></iconify-icon> {{ activity.organizer }}
                      </p>
                      <p class="text-sm text-slate-500 flex items-center gap-1">
                        <iconify-icon icon="ph:calendar-blank"></iconify-icon> {{ activity.date }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="approveActivity(activity.id)" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">通过</button>
                  <button @click="rejectActivity(activity.id)" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-lg transition-colors">拒绝</button>
                </div>
              </div>
            </div>
            <div v-else class="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <iconify-icon class="text-slate-300 text-4xl" icon="ph:list-checks-bold"></iconify-icon>
              </div>
              <h3 class="text-lg font-bold text-slate-900">暂无待审核活动</h3>
              <p class="text-slate-500 mt-1">所有的活动申请都已处理完毕，干得漂亮！</p>
            </div>
            <div class="p-4 bg-slate-50 text-center border-t border-slate-100">
              <button @click="goToActivityAudit" class="text-blue-600 text-sm font-semibold hover:underline">查看所有历史记录</button>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 系统公告 -->
          <div class="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-slate-900 flex items-center gap-2">
                <iconify-icon class="text-blue-600" icon="ph:megaphone-simple-bold"></iconify-icon>
                最新系统公告
              </h3>
              <button @click="goToAnnouncement" class="text-blue-600 text-xs font-bold hover:underline">更多</button>
            </div>
            <div class="space-y-4">
              <div v-for="(notice, index) in announcements" :key="notice.id" class="group cursor-pointer">
                <p class="text-xs text-slate-400 mb-1">{{ notice.date }}</p>
                <h4 class="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {{ notice.title }}
                </h4>
                <p class="text-xs text-slate-500 mt-1 line-clamp-2">{{ notice.summary }}</p>
                <div v-if="index !== announcements.length - 1" class="h-px bg-slate-100 w-full mt-4"></div>
              </div>
            </div>
          </div>

          <!-- 活跃度卡片 -->
          <div class="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <h3 class="font-bold text-slate-900 mb-4">今日平台活跃度</h3>
            <div class="flex items-end gap-1 h-24 mb-4">
              <div v-for="(height, idx) in activityHeights" :key="idx" class="flex-1 bg-blue-100 rounded-t-sm" :class="idx === 5 ? 'bg-blue-600 shadow-lg' : ''" :style="{ height: `${height}%` }"></div>
            </div>
            <div class="flex justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span class="text-blue-600">Sat</span><span>Sun</span>
            </div>
          </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ==================== 数据定义（示例静态数据，后续替换为 API 调用） ====================

// 统计卡片数据
// TODO: 替换为 API 调用，例如 const { data } = await axios.get('/api/admin/stats')
const stats = ref({
  totalActivities: 24,
  totalUsers: 1234,
})

// 待审核活动列表
// TODO: 替换为 API 调用，例如 const { data } = await axios.get('/api/admin/pending-activities')
const pendingActivities = ref([
  { id: 1, title: '2026 校园歌手大赛', organizer: '学生会文艺部', date: '2026-06-01', icon: 'ph:microphone-stage-bold' },
  { id: 2, title: '春季 48h 编程马拉松', organizer: '计算机学院科协', date: '2026-05-20', icon: 'ph:code-bold' },
  { id: 3, title: '心理健康专题讲座', organizer: '心理咨询中心', date: '2026-05-25', icon: 'ph:brain-bold' },
  { id: 4, title: '毕业季创意跳蚤市场', organizer: '创业者协会', date: '2026-06-10', icon: 'ph:shopping-cart-bold' },
])

const pendingCount = computed(() => pendingActivities.value.length)

// 系统公告列表
// TODO: 替换为 API 调用，例如 const { data } = await axios.get('/api/admin/announcements')
const announcements = ref([
  {
    id: 1,
    date: '2026-05-14 09:00',
    title: '系统将于本周末进行数据库迁移维护',
    summary: '为了提供更稳定的服务，我们将于周六凌晨 2:00 至 6:00 进行停机维护...',
  },
  {
    id: 2,
    date: '2026-05-10 14:30',
    title: '关于加强校园大型集会安全审核的通知',
    summary: '根据最新安全要求，参与人数超过 500 人的活动需提交详细的安全预案...',
  },
])

// 活跃度数据（静态示例）
const activityHeights = ref([40, 60, 30, 80, 50, 95, 40])

// ==================== 方法 ====================

// 通过活动
// TODO: 替换为真实的 API 请求，例如 await axios.post(`/api/admin/activities/${id}/approve`)
const approveActivity = (id) => {
  const activity = pendingActivities.value.find(a => a.id === id)
  if (!activity) return
  // 模拟成功提示，实际应等待 API 响应
  showToast(`已通过审核: ${activity.title}`, 'success')
  // TODO: 成功后应重新调用获取待审核列表的 API 刷新数据
  pendingActivities.value = pendingActivities.value.filter(a => a.id !== id)
}

// 拒绝活动
// TODO: 替换为真实的 API 请求，例如 await axios.post(`/api/admin/activities/${id}/reject`)
const rejectActivity = (id) => {
  const activity = pendingActivities.value.find(a => a.id === id)
  if (!activity) return
  showToast(`已拒绝申请: ${activity.title}`, 'error')
  pendingActivities.value = pendingActivities.value.filter(a => a.id !== id)
}

// 跳转到活动审核页面
const goToActivityAudit = () => {
  router.push('/admin/activity-audit')
}

// 跳转到系统公告管理页面
const goToAnnouncement = () => {
  router.push('/admin/system-announcement')
}

// 简易 Toast 提示（与之前相同）
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

// ==================== 生命周期：加载数据 ====================
// TODO: 在 onMounted 中调用 API 初始化数据
onMounted(() => {
  // 示例：获取统计数据
  // fetchStats()
  // 获取待审核活动列表
  // fetchPendingActivities()
  // 获取公告列表
  // fetchAnnouncements()
  console.log('页面加载，实际应调用 API 获取数据')
})
</script>

<style scoped>
/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
/* 玻璃导航栏 */
.glass-nav {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
/* 行内截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>