<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <AppNavbar :brand-name="'CampusActivity'" :nav-items="navItems" />

    <AppPageContainer class="px-6 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-2 text-white/60 text-sm mb-2">
          <span>审核管理</span>
          <iconify-icon class="text-[10px]" icon="ph:caret-right-bold"></iconify-icon>
          <span class="text-white/90">活动审核</span>
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">活动审核记录</h1>
      </div>

      <!-- 筛选栏（可选） -->
      <div class="mb-6 flex gap-2">
        <AppButton size="sm" :variant="filter === 'all' ? 'default' : 'outline'" @click="filter = 'all'">
          全部
        </AppButton>
        <AppButton size="sm" :variant="filter === 'pending' ? 'default' : 'outline'" @click="filter = 'pending'">
          待审核
        </AppButton>
        <AppButton size="sm" :variant="filter === 'approved' ? 'default' : 'outline'" @click="filter = 'approved'">
          已通过
        </AppButton>
        <AppButton size="sm" :variant="filter === 'rejected' ? 'default' : 'outline'" @click="filter = 'rejected'">
          已拒绝
        </AppButton>
      </div>

      <!-- 活动列表 -->
      <AppCard>
        <div class="space-y-4">
          <div
            v-for="act in filteredActivities"
            :key="act.id"
            class="flex flex-col sm:flex-row justify-between gap-4 p-4 border rounded-xl hover:bg-slate-50"
          >
            <div class="flex gap-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <iconify-icon :icon="act.icon" class="text-blue-600 text-2xl"></iconify-icon>
              </div>
              <div>
                <h4 class="font-bold">{{ act.title }}</h4>
                <p class="text-sm text-slate-500">
                  <iconify-icon icon="ph:user-circle"></iconify-icon>
                  {{ act.organizer }} · {{ act.date }}
                </p>
                <span
                  class="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-700': act.status === 'pending',
                    'bg-green-100 text-green-700': act.status === 'approved',
                    'bg-red-100 text-red-700': act.status === 'rejected'
                  }"
                >
                  {{ act.status === 'pending' ? '待审核' : act.status === 'approved' ? '已通过' : '已拒绝' }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <AppButton
                v-if="act.status !== 'approved'"
                size="sm"
                @click="updateStatus(act.id, 'approved')"
              >
                通过
              </AppButton>
              <AppButton
                v-if="act.status !== 'rejected'"
                size="sm"
                variant="destructive"
                @click="updateStatus(act.id, 'rejected')"
              >
                拒绝
              </AppButton>
            </div>
          </div>

          <div v-if="!filteredActivities.length" class="py-12 text-center text-slate-400">
            暂无符合条件的活动
          </div>
        </div>
      </AppCard>
    </AppPageContainer>

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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { AppButton, AppCard, AppNavbar, AppPageContainer } from '@/components/common'

const navItems = [
  { label: '首页', href: '/' },
  { label: '关于', href: '/about' },
  { label: '联系', href: '/contact' }
]

// 模拟数据（包含多种状态）
const activities = ref([
  { id: 1, title: '2026 校园歌手大赛', organizer: '学生会文艺部', date: '2026-06-01', icon: 'ph:microphone-stage-bold', status: 'approved' },
  { id: 2, title: '春季 48h 编程马拉松', organizer: '计算机学院科协', date: '2026-05-20', icon: 'ph:code-bold', status: 'approved' },
  { id: 3, title: '心理健康专题讲座', organizer: '心理咨询中心', date: '2026-05-25', icon: 'ph:brain-bold', status: 'rejected' },
  { id: 4, title: '毕业季创意跳蚤市场', organizer: '创业者协会', date: '2026-06-10', icon: 'ph:shopping-cart-bold', status: 'pending' },
  { id: 5, title: '新生欢迎晚会', organizer: '校学生会', date: '2026-07-01', icon: 'ph:party-hat-bold', status: 'pending' }
])

const filter = ref('all')

const filteredActivities = computed(() => {
  if (filter.value === 'all') return activities.value
  return activities.value.filter(a => a.status === filter.value)
})

const updateStatus = (id, newStatus) => {
  const act = activities.value.find(a => a.id === id)
  if (act) {
    act.status = newStatus
    showToast(`${act.title} 已${newStatus === 'approved' ? '通过' : '拒绝'}`, newStatus === 'approved' ? 'success' : 'error')
  }
}

const showToast = (msg, type) => {
  const container = document.getElementById('toast-container') || (() => {
    const div = document.createElement('div')
    div.id = 'toast-container'
    div.className = 'fixed bottom-6 right-6 z-[100] flex flex-col gap-3'
    document.body.appendChild(div)
    return div
  })()
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