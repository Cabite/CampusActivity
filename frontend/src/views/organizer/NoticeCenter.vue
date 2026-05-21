<template>
  <div class="flex h-screen">
    <!-- 侧边栏（同上） -->
    <aside class="w-64 bg-white shadow-md flex flex-col z-10">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-blue-600">CampusActivity</h1>
        <p class="text-xs text-gray-500">组织者面板</p>
      </div>
      <nav class="flex-1 p-2 space-y-1">
        <router-link to="/organizer/dashboard" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
          <iconify-icon icon="ph:gauge" class="mr-2 w-5 h-5"></iconify-icon> 工作台
        </router-link>
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

    <main class="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <AppPageContainer variant="gradient" padding="lg" max-width="2xl">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-white">公告与消息中心</h1>
          <p class="text-white/70 mt-1">系统公告和个人通知</p>
        </div>

        <div class="flex gap-4 mb-6 border-b border-white/20">
          <button @click="activeTab = 'announcement'" class="pb-2 px-1 font-medium transition" :class="activeTab === 'announcement' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/70 hover:text-white'">系统公告</button>
          <button @click="activeTab = 'message'" class="pb-2 px-1 font-medium transition" :class="activeTab === 'message' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/70 hover:text-white'">我的消息 <span v-if="unreadCount > 0" class="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">{{ unreadCount }}</span></button>
        </div>

        <div v-if="activeTab === 'announcement'">
          <AppCard :loading="loadingAnnouncement">
            <div class="space-y-4">
              <div v-for="ann in announcements" :key="ann.id" class="border-b pb-3 last:border-0">
                <h3 class="font-semibold text-gray-900">{{ ann.title }}</h3>
                <p class="text-xs text-gray-400 mt-1">{{ ann.created_at }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ ann.content }}</p>
              </div>
              <div v-if="announcements.length === 0 && !loadingAnnouncement" class="text-center text-gray-400 py-8">暂无公告</div>
            </div>
            <div v-if="announcementTotalPages > 1" class="flex justify-center mt-6 gap-2">
              <button v-for="p in announcementTotalPages" :key="p" @click="goToAnnouncementPage(p)" class="px-3 py-1 rounded border" :class="p === announcementPage ? 'bg-blue-600 text-white' : 'text-gray-700'">{{ p }}</button>
            </div>
          </AppCard>
        </div>

        <div v-else>
          <AppCard :loading="loadingMessage">
            <div class="space-y-3">
              <div v-for="msg in messages" :key="msg.id" class="p-3 rounded-lg border-l-4" :class="getMessageClass(msg)">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-semibold">{{ msg.title }}</div>
                    <div class="text-xs text-gray-400 mt-1">{{ msg.created_at }}</div>
                    <div class="text-sm mt-1">{{ msg.content }}</div>
                  </div>
                  <button v-if="!msg.is_read" @click="markAsRead(msg.id)" class="text-blue-500 text-xs hover:underline">标记已读</button>
                </div>
              </div>
              <div v-if="messages.length === 0 && !loadingMessage" class="text-center text-gray-400 py-8">暂无消息</div>
            </div>
            <div class="flex justify-between items-center mt-4">
              <button v-if="unreadCount > 0" @click="markAllAsRead" class="text-sm text-blue-500 hover:underline">全部已读</button>
              <div v-if="messageTotalPages > 1" class="flex justify-center gap-2">
                <button v-for="p in messageTotalPages" :key="p" @click="goToMessagePage(p)" class="px-3 py-1 rounded border" :class="p === messagePage ? 'bg-blue-600 text-white' : 'text-gray-700'">{{ p }}</button>
              </div>
            </div>
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

const router = useRouter()
const activeTab = ref<'announcement' | 'message'>('announcement')
const loadingAnnouncement = ref(false)
const loadingMessage = ref(false)

const announcements = ref<any[]>([])
const announcementPage = ref(1)
const announcementTotalPages = ref(1)
const messages = ref<any[]>([])
const unreadCount = ref(0)
const messagePage = ref(1)
const messageTotalPages = ref(1)

const mockAnnouncements = [
  { id: 1, title: '系统将于本周末进行数据库迁移维护', content: '为了提供更稳定的服务，我们将于周六凌晨2:00至6:00进行停机维护...', created_at: '2026-05-14 09:00' },
  { id: 2, title: '关于加强校园大型集会安全审核的通知', content: '根据最新安全要求，参与人数超过500人的活动需提交详细的安全预案...', created_at: '2026-05-10 14:30' }
]
const mockMessages = [
  { id: 1, title: '活动审核通过', content: '您创建的活动“校园歌手大赛”已通过审核，现在可以正常报名了。', created_at: '2026-05-12 08:30', is_read: false, type: 'success' },
  { id: 2, title: '新报名通知', content: '活动“AI学术讲座”有新的报名，请及时查看报名列表。', created_at: '2026-05-11 14:20', is_read: false, type: 'info' },
  { id: 3, title: '活动审核拒绝', content: '您创建的活动“春季运动会”因信息不全被拒绝，请修改后重新提交。', created_at: '2026-05-09 09:15', is_read: true, type: 'error' }
]

const fetchAnnouncements = async () => {
  loadingAnnouncement.value = true
  setTimeout(() => {
    announcements.value = mockAnnouncements
    announcementTotalPages.value = 1
    loadingAnnouncement.value = false
  }, 100)
}
const fetchMessages = async () => {
  loadingMessage.value = true
  setTimeout(() => {
    messages.value = mockMessages
    unreadCount.value = mockMessages.filter(m => !m.is_read).length
    messageTotalPages.value = 1
    loadingMessage.value = false
  }, 100)
}
const markAsRead = (id: number) => {
  const idx = messages.value.findIndex(m => m.id === id)
  if (idx !== -1 && !messages.value[idx].is_read) {
    messages.value[idx].is_read = true
    unreadCount.value = messages.value.filter(m => !m.is_read).length
  }
  alert('已标记为已读')
}
const markAllAsRead = () => {
  messages.value.forEach(m => m.is_read = true)
  unreadCount.value = 0
  alert('全部已读')
}
const getMessageClass = (msg: any) => {
  if (msg.is_read) return 'bg-gray-50 border-l-gray-400'
  switch (msg.type) {
    case 'success': return 'bg-green-50 border-l-green-500'
    case 'error': return 'bg-red-50 border-l-red-500'
    default: return 'bg-blue-50 border-l-blue-500'
  }
}
const goToAnnouncementPage = (page: number) => { announcementPage.value = page; fetchAnnouncements() }
const goToMessagePage = (page: number) => { messagePage.value = page; fetchMessages() }
const logout = () => { if (confirm('确定退出登录吗？')) router.push('/login') }

onMounted(() => {
  fetchAnnouncements()
  fetchMessages()
})
</script>