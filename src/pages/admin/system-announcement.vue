<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <AppNavbar :brand-name="'CampusActivity'" :nav-items="navItems" />

    <AppPageContainer class="px-6 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-2 text-white/60 text-sm mb-2">
          <span>内容管理</span>
          <iconify-icon class="text-[10px]" icon="ph:caret-right-bold"></iconify-icon>
          <span class="text-white/90">系统公告</span>
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">系统公告管理</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：发布新公告 -->
        <AppCard>
          <h2 class="text-xl font-bold mb-4">发布新公告</h2>
          <input
            v-model="newTitle"
            type="text"
            placeholder="公告标题"
            class="w-full border rounded-lg p-2 mb-3"
          />
          <textarea
            v-model="newContent"
            placeholder="公告内容"
            rows="4"
            class="w-full border rounded-lg p-2 mb-3"
          ></textarea>
          <div class="flex justify-end">
            <AppButton @click="publishAnnouncement">发布</AppButton>
          </div>
        </AppCard>

        <!-- 右侧：已有公告列表 -->
        <AppCard>
          <h2 class="text-xl font-bold mb-4">已有公告</h2>
          <div v-if="announcements.length === 0" class="text-center text-slate-400 py-8">
            暂无公告
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="ann in announcements"
              :key="ann.id"
              class="border-b pb-3 last:border-0"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold">{{ ann.title }}</h3>
                  <p class="text-xs text-slate-400">{{ ann.date }}</p>
                  <p class="text-sm mt-1">{{ ann.content }}</p>
                </div>
                <div class="flex gap-2">
                  <AppButton size="sm" variant="outline" @click="editAnnouncement(ann)">
                    编辑
                  </AppButton>
                  <AppButton size="sm" variant="destructive" @click="deleteAnnouncement(ann.id)">
                    删除
                  </AppButton>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- 编辑弹窗（简单实现） -->
      <div
        v-if="editModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="editModal = false"
      >
        <div class="bg-white rounded-xl p-6 w-96">
          <h3 class="text-lg font-bold mb-4">编辑公告</h3>
          <input v-model="editForm.title" class="w-full border rounded p-2 mb-3" placeholder="标题" />
          <textarea v-model="editForm.content" rows="3" class="w-full border rounded p-2 mb-3" placeholder="内容"></textarea>
          <div class="flex justify-end gap-2">
            <AppButton variant="outline" @click="editModal = false">取消</AppButton>
            <AppButton @click="saveEdit">保存</AppButton>
          </div>
        </div>
      </div>
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
const announcements = ref([
  { id: 1, title: '系统将于本周末进行数据库迁移维护', content: '为了提供更稳定的服务，我们将于周六凌晨2:00至6:00进行停机维护...', date: '2026-05-14 09:00' },
  { id: 2, title: '关于加强校园大型集会安全审核的通知', content: '根据最新安全要求，参与人数超过500人的活动需提交详细的安全预案...', date: '2026-05-10 14:30' }
])

const newTitle = ref('')
const newContent = ref('')

// 编辑弹窗相关
const editModal = ref(false)
const editForm = ref({ id: null, title: '', content: '' })

const publishAnnouncement = () => {
  if (!newTitle.value || !newContent.value) return
  announcements.value.unshift({
    id: Date.now(),
    title: newTitle.value,
    content: newContent.value,
    date: new Date().toLocaleString()
  })
  newTitle.value = ''
  newContent.value = ''
}

const editAnnouncement = (ann) => {
  editForm.value = { ...ann }
  editModal.value = true
}

const saveEdit = () => {
  const index = announcements.value.findIndex(a => a.id === editForm.value.id)
  if (index !== -1) {
    announcements.value[index] = { ...editForm.value, date: announcements.value[index].date }
  }
  editModal.value = false
}

const deleteAnnouncement = (id) => {
  announcements.value = announcements.value.filter(a => a.id !== id)
}
</script>