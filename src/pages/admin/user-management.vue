<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <AppNavbar :brand-name="'CampusActivity'" :nav-items="navItems" />

    <AppPageContainer class="px-6 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-2 text-white/60 text-sm mb-2">
          <span>用户管理</span>
          <iconify-icon class="text-[10px]" icon="ph:caret-right-bold"></iconify-icon>
          <span class="text-white/90">账号与权限</span>
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">用户管理</h1>
      </div>

      <!-- 统计卡片（可选，简洁） -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AppCard class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ stats.totalUsers }}</div>
          <div class="text-gray-500 text-sm">总用户数</div>
        </AppCard>
        <AppCard class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ stats.organizers }}</div>
          <div class="text-gray-500 text-sm">发布者</div>
        </AppCard>
        <AppCard class="text-center">
          <div class="text-2xl font-bold text-orange-500">{{ stats.pendingApproval }}</div>
          <div class="text-gray-500 text-sm">待审批发布者</div>
        </AppCard>
      </div>

      <!-- 用户列表 -->
      <AppCard>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="border-b">
              <tr>
                <th class="text-left py-2">用户名</th>
                <th class="text-left py-2">邮箱</th>
                <th class="text-left py-2">角色</th>
                <th class="text-left py-2">发布资质</th>
                <th class="text-left py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="border-b">
                <td class="py-2">{{ user.username }}</td>
                <td class="py-2">{{ user.email }}</td>
                <td class="py-2">
                  <span :class="user.role === 'admin' ? 'text-purple-600' : user.role === 'organizer' ? 'text-blue-600' : 'text-gray-600'">
                    {{ user.role === 'admin' ? '管理员' : user.role === 'organizer' ? '发布者' : '发现者' }}
                  </span>
                </td>
                <td class="py-2">
                  <span v-if="user.role === 'organizer'" :class="user.approved ? 'text-green-600' : 'text-orange-500'">
                    {{ user.approved ? '已批准' : '未批准' }}
                  </span>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="py-2 space-x-2">
                  <AppButton
                    v-if="user.role === 'organizer' && !user.approved"
                    size="sm"
                    @click="approveOrganizer(user.id)"
                  >
                    批准资质
                  </AppButton>
                  <AppButton
                    v-if="user.role !== 'admin'"
                    size="sm"
                    variant="destructive"
                    @click="deleteUser(user.id)"
                  >
                    删除
                  </AppButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="users.length === 0" class="py-12 text-center text-slate-400">
          暂无用户
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
import { ref } from 'vue'
import { AppButton, AppCard, AppNavbar, AppPageContainer } from '@/components/common'

const navItems = [
  { label: '首页', href: '/' },
  { label: '关于', href: '/about' },
  { label: '联系', href: '/contact' }
]

// 模拟数据
const users = ref([
  { id: 1, username: '张三', email: 'zhangsan@test.com', role: 'discoverer', approved: null },
  { id: 2, username: '李四', email: 'lisi@test.com', role: 'organizer', approved: false },
  { id: 3, username: '王五', email: 'wangwu@test.com', role: 'organizer', approved: true },
  { id: 4, username: 'admin', email: 'admin@test.com', role: 'admin', approved: true }
])

const stats = ref({
  totalUsers: users.value.length,
  organizers: users.value.filter(u => u.role === 'organizer').length,
  pendingApproval: users.value.filter(u => u.role === 'organizer' && !u.approved).length
})

const approveOrganizer = (id) => {
  const user = users.value.find(u => u.id === id)
  if (user) {
    user.approved = true
    // 更新统计
    stats.value.pendingApproval = users.value.filter(u => u.role === 'organizer' && !u.approved).length
    showToast(`已批准 ${user.username} 的发布资质`, 'success')
  }
}

const deleteUser = (id) => {
  const user = users.value.find(u => u.id === id)
  if (user && user.role !== 'admin') {
    users.value = users.value.filter(u => u.id !== id)
    stats.value.totalUsers = users.value.length
    stats.value.organizers = users.value.filter(u => u.role === 'organizer').length
    stats.value.pendingApproval = users.value.filter(u => u.role === 'organizer' && !u.approved).length
    showToast(`已删除用户 ${user.username}`, 'error')
  } else {
    showToast('无法删除管理员账号', 'error')
  }
}

// Toast 辅助函数（与之前一致）
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