<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <AppNavbar :brand-name="'CampusActivity'" :nav-items="navItems" />

    <AppPageContainer class="px-6 py-8">
      <!-- 页面标题 -->
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
        <AppCard class="flex flex-col justify-between hover:scale-[1.02] transition-transform">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-slate-500 text-sm">总活动数</p>
              <h3 class="text-4xl font-bold mt-2">{{ stats.totalActivities }}</h3>
            </div>
            <div class="p-3 bg-blue-50 rounded-xl">
              <iconify-icon class="text-blue-600 text-2xl" icon="ph:calendar-check-bold"></iconify-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-emerald-600 text-sm">
            <iconify-icon icon="ph:trend-up-bold"></iconify-icon>↑12%
            <span class="text-slate-400 ml-1">较上月</span>
          </div>
        </AppCard>

        <AppCard class="flex flex-col justify-between hover:scale-[1.02] transition-transform">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-slate-500 text-sm">总用户数</p>
              <h3 class="text-4xl font-bold mt-2">{{ stats.totalUsers }}</h3>
            </div>
            <div class="p-3 bg-indigo-50 rounded-xl">
              <iconify-icon class="text-indigo-600 text-2xl" icon="ph:users-three-bold"></iconify-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-emerald-600 text-sm">
            <iconify-icon icon="ph:trend-up-bold"></iconify-icon>↑8%
            <span class="text-slate-400 ml-1">较上月</span>
          </div>
        </AppCard>

        <AppCard class="flex flex-col justify-between hover:scale-[1.02] transition-transform">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-slate-500 text-sm">待审核活动</p>
              <h3
                class="text-4xl font-bold mt-2"
                :class="pendingCount ? 'text-orange-500' : 'text-slate-400'"
              >
                {{ pendingCount }}
              </h3>
            </div>
            <div class="p-3 bg-orange-50 rounded-xl">
              <iconify-icon class="text-orange-500 text-2xl" icon="ph:clock-countdown-bold"></iconify-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-orange-500 text-sm">
            <iconify-icon icon="ph:warning-circle-bold"></iconify-icon>需要尽快处理
          </div>
        </AppCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：待审核活动清单 -->
        <div class="lg:col-span-2">
          <AppCard class="h-full flex flex-col">
            <div class="flex justify-between items-center border-b pb-4 mb-4">
              <h2 class="text-xl font-bold">待审核活动清单</h2>
              <span class="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold">实时更新</span>
            </div>

            <div class="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              <div
                v-for="act in pendingActivities"
                :key="act.id"
                class="flex flex-col sm:flex-row justify-between gap-4 p-4 border rounded-xl hover:bg-slate-50"
              >
                <div class="flex gap-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <iconify-icon :icon="act.icon" class="text-blue-600 text-2xl"></iconify-icon>
                  </div>
                  <div>
                    <h4 class="font-bold">{{ act.title }}</h4>
                    <p class="text-sm text-slate-500 flex items-center gap-1">
                      <iconify-icon icon="ph:user-circle"></iconify-icon>
                      {{ act.organizer }} · {{ act.date }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <AppButton size="sm" @click="approveActivity(act.id)">通过</AppButton>
                  <AppButton size="sm" variant="destructive" @click="rejectActivity(act.id)">拒绝</AppButton>
                </div>
              </div>
            </div>

            <div v-if="!pendingActivities.length" class="py-12 text-center text-slate-400">
              暂无待审核活动
            </div>

            <!-- 查看所有历史记录按钮 → 跳转到活动审核页面 -->
            <div class="mt-4 pt-4 border-t text-center">
              <AppButton variant="link" size="sm" @click="goToActivityAudit">
                查看所有历史记录
              </AppButton>
            </div>
          </AppCard>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 系统公告卡片 -->
          <AppCard>
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold flex items-center gap-2">
                <iconify-icon icon="ph:megaphone-simple-bold" class="text-blue-600"></iconify-icon>
                最新系统公告
              </h3>
              <!-- 更多按钮 → 跳转到系统公告管理页面 -->
              <AppButton variant="link" size="sm" @click="goToAnnouncement">
                更多
              </AppButton>
            </div>
            <div
              v-for="(notice, idx) in announcements"
              :key="notice.id"
              class="mb-4 last:mb-0"
            >
              <p class="text-xs text-slate-400">{{ notice.date }}</p>
              <h4 class="text-sm font-semibold line-clamp-1">{{ notice.title }}</h4>
              <p class="text-xs text-slate-500 line-clamp-2">{{ notice.summary }}</p>
              <div v-if="idx !== announcements.length - 1" class="h-px bg-slate-100 my-3"></div>
            </div>
          </AppCard>

          <!-- 快速操作卡片（保留，暂不删除） -->
          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
            <h3 class="font-bold mb-4 flex items-center gap-2">
              <iconify-icon icon="ph:lightning-bold"></iconify-icon>快速操作
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <AppButton
                variant="outline"
                size="sm"
                class="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                创建公告
              </AppButton>
              <AppButton
                variant="outline"
                size="sm"
                class="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                导出报表
              </AppButton>
              <AppButton
                variant="outline"
                size="sm"
                class="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                添加成员
              </AppButton>
              <AppButton
                variant="outline"
                size="sm"
                class="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                权限管理
              </AppButton>
            </div>
          </div>

          <!-- 活跃度卡片 -->
          <AppCard>
            <h3 class="font-bold mb-4">今日平台活跃度</h3>
            <div class="flex items-end gap-1 h-24 mb-2">
              <div
                v-for="(h, i) in activityHeights"
                :key="i"
                class="flex-1 bg-blue-100 rounded-t"
                :class="i === 5 ? 'bg-blue-600' : ''"
                :style="{ height: h + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
              <span class="text-blue-600">Sat</span><span>Sun</span>
            </div>
          </AppCard>
        </div>
      </div>
    </AppPageContainer>

    <!-- 页脚 -->
    <footer class="max-w-[1440px] mx-auto px-6 py-8 mt-12 border-t border-white/10">
      <div class="flex flex-col md:flex-row justify-between gap-4 text-white/60 text-sm">
        <p>© 2026 CampusActivity 校园活动管理平台. 保留所有权利.</p>
        <div class="flex gap-6">
          <a class="hover:text-white" href="#">使用条款</a>
          <a class="hover:text-white" href="#">隐私政策</a>
          <a class="hover:text-white" href="#">系统状态</a>
        </div>
      </div>
    </footer>

    <!-- Toast 容器 -->
    <div id="toast-container" class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AppButton, AppCard, AppNavbar, AppPageContainer } from '@/components/common'

const router = useRouter()

// 导航栏配置
const navItems = [
  { label: '首页', href: '/' },
  { label: '关于', href: '/about' },
  { label: '联系', href: '/contact' }
]

// 模拟数据
const stats = ref({
  totalActivities: 24,
  totalUsers: 1234
})

const pendingActivities = ref([
  {
    id: 1,
    title: '2026 校园歌手大赛',
    organizer: '学生会文艺部',
    date: '2026-06-01',
    icon: 'ph:microphone-stage-bold'
  },
  {
    id: 2,
    title: '春季 48h 编程马拉松',
    organizer: '计算机学院科协',
    date: '2026-05-20',
    icon: 'ph:code-bold'
  },
  {
    id: 3,
    title: '心理健康专题讲座',
    organizer: '心理咨询中心',
    date: '2026-05-25',
    icon: 'ph:brain-bold'
  },
  {
    id: 4,
    title: '毕业季创意跳蚤市场',
    organizer: '创业者协会',
    date: '2026-06-10',
    icon: 'ph:shopping-cart-bold'
  }
])

const pendingCount = computed(() => pendingActivities.value.length)

const announcements = ref([
  {
    id: 1,
    date: '2026-05-14 09:00',
    title: '系统将于本周末进行数据库迁移维护',
    summary: '为了提供更稳定的服务，我们将于周六凌晨 2:00 至 6:00 进行停机维护...'
  },
  {
    id: 2,
    date: '2026-05-10 14:30',
    title: '关于加强校园大型集会安全审核的通知',
    summary: '根据最新安全要求，参与人数超过 500 人的活动需提交详细的安全预案...'
  }
])

const activityHeights = ref([40, 60, 30, 80, 50, 95, 40])

// 方法
const approveActivity = (id) => {
  const act = pendingActivities.value.find(a => a.id === id)
  if (act) {
    showToast(`已通过: ${act.title}`, 'success')
    pendingActivities.value = pendingActivities.value.filter(a => a.id !== id)
  }
}

const rejectActivity = (id) => {
  const act = pendingActivities.value.find(a => a.id === id)
  if (act) {
    showToast(`已拒绝: ${act.title}`, 'error')
    pendingActivities.value = pendingActivities.value.filter(a => a.id !== id)
  }
}

// 跳转到活动审核页面
const goToActivityAudit = () => {
  router.push('/admin/activity-audit')
}

// 跳转到系统公告管理页面
const goToAnnouncement = () => {
  router.push('/admin/system-announcement')
}

// 简易 Toast（与之前相同）
const showToast = (msg, type) => {
  const container = document.getElementById('toast-container')
  if (!container) return
  const toast = document.createElement('div')
  toast.className = `${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 transform translate-y-10 opacity-0 transition-all duration-300`
  toast.innerHTML = `<iconify-icon icon="${type === 'success' ? 'ph:check-circle-bold' : 'ph:x-circle-bold'}" class="text-xl"></iconify-icon><span>${msg}</span>`
  container.appendChild(toast)
  setTimeout(() => toast.classList.remove('translate-y-10', 'opacity-0'), 10)
  setTimeout(() => {
    toast.classList.add('translate-y-[-20px]', 'opacity-0')
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}
</script>

<style scoped>
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