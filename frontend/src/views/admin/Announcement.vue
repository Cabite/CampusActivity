<template>
  <div class="flex h-screen">
    <!-- 侧边栏（已移除控制台菜单） -->
    <aside class="w-64 bg-white shadow-md flex flex-col z-10">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-blue-600">CampusActivity</h1>
        <p class="text-xs text-gray-500">管理员面板</p>
      </div>
      <nav class="flex-1 p-2 space-y-1">
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
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-white">系统公告管理</h1>
          <p class="text-white/70 mt-1">发布与管理系统公告</p>
        </div>

        <div class="flex justify-end mb-4">
          <AppButton variant="blue" @click="openCreateModal">发布公告</AppButton>
        </div>

        <AppCard :loading="loading">
          <div class="space-y-4">
            <div v-for="ann in announcements" :key="ann.id" class="border-b pb-3">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold">{{ ann.title }}</h3>
                  <p class="text-xs text-gray-400">{{ ann.start_time }}</p>
                  <p class="text-sm text-gray-600 mt-1">{{ ann.content }}</p>
                </div>
                <div class="flex gap-2">
                  <AppButton size="sm" variant="outline" @click="openEditModal(ann)">编辑</AppButton>
                  <AppButton size="sm" variant="destructive" @click="deleteAnnouncement(ann.id)">删除</AppButton>
                </div>
              </div>
            </div>
            <div v-if="announcements.length === 0" class="text-center text-gray-400 py-8">暂无公告</div>
          </div>
          <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-2">
            <button v-for="p in totalPages" :key="p" @click="goToPage(p)" class="px-3 py-1 rounded border" :class="p === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700'">{{ p }}</button>
          </div>
        </AppCard>

        <!-- 发布/编辑公告弹窗 -->
        <AppDialog v-model:open="modalVisible" :title="modalTitle" confirm-text="发布" cancel-text="取消" @confirm="submitAnnouncement">
          <div class="space-y-3">
            <input type="text" v-model="form.title" placeholder="标题" class="w-full border rounded px-3 py-2">
            <textarea v-model="form.content" rows="4" placeholder="内容" class="w-full border rounded px-3 py-2"></textarea>
            <input type="datetime-local" v-model="form.start_time" placeholder="开始时间（可选）" class="w-full border rounded px-3 py-2">
            <input type="datetime-local" v-model="form.end_time" placeholder="结束时间（可选）" class="w-full border rounded px-3 py-2">
          </div>
        </AppDialog>
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
import AppDialog from '@/components/layout/AppDialog.vue'
import { publishAnnouncement, deleteAnnouncement, getAnnouncements } from '@/api/admin'

const router = useRouter()
const loading = ref(false)
const announcements = ref<any[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

// 模拟数据（适配文档字段：start_time 代替 created_at）
const mockAnnouncements = [
  { id: 1, title: '系统将于本周末进行数据库迁移维护', content: '为了提供更稳定的服务，我们将于周六凌晨2:00至6:00进行停机维护...', start_time: '2026-05-14 09:00', end_time: '2026-05-30 23:59' },
  { id: 2, title: '关于加强校园大型集会安全审核的通知', content: '根据最新安全要求，参与人数超过500人的活动需提交详细的安全预案...', start_time: '2026-05-10 14:30', end_time: '2026-06-01 00:00' }
]

const fetchAnnouncements = async () => {
  loading.value = true
  try {
    const res = await getAnnouncements()
    if (res.code === 200) {
      announcements.value = res.data
      totalPages.value = Math.ceil(announcements.value.length / pageSize)
    } else throw new Error()
  } catch {
    announcements.value = mockAnnouncements
    totalPages.value = Math.ceil(announcements.value.length / pageSize)
  } finally {
    loading.value = false
  }
}

const modalVisible = ref(false)
const modalTitle = ref('发布公告')
const editingId = ref<number | null>(null)
const form = reactive({ title: '', content: '', start_time: '', end_time: '' })

const openCreateModal = () => {
  modalTitle.value = '发布公告'
  editingId.value = null
  form.title = ''
  form.content = ''
  form.start_time = ''
  form.end_time = ''
  modalVisible.value = true
}
const openEditModal = (ann: any) => {
  modalTitle.value = '编辑公告'
  editingId.value = ann.id
  form.title = ann.title
  form.content = ann.content
  form.start_time = ann.start_time || ''
  form.end_time = ann.end_time || ''
  modalVisible.value = true
}
const submitAnnouncement = async () => {
  if (!form.title.trim() || !form.content.trim()) {
    alert('请填写标题和内容')
    return
  }
  try {
    if (editingId.value) {
      // 编辑接口文档未提供，这里仅模拟更新
      const idx = announcements.value.findIndex(a => a.id === editingId.value)
      if (idx !== -1) {
        announcements.value[idx] = { ...announcements.value[idx], ...form }
      }
      alert('公告已更新（模拟）')
    } else {
      await publishAnnouncement(form)
      alert('公告发布成功')
    }
    modalVisible.value = false
    fetchAnnouncements()
  } catch {
    alert('操作失败')
  }
}
const deleteAnnouncement = async (id: number) => {
  if (!confirm('确定删除该公告吗？')) return
  try {
    await deleteAnnouncement(id)
    alert('已删除')
    fetchAnnouncements()
  } catch {
    alert('删除失败')
  }
}
const goToPage = (p: number) => {
  currentPage.value = p
  fetchAnnouncements()
}
const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchAnnouncements()
})
</script>