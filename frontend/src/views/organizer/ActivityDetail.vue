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
        <div class="mb-4">
          <AppButton variant="link" @click="goBack" class="text-white">
            <iconify-icon icon="ph:arrow-left-bold"></iconify-icon> 返回
          </AppButton>
        </div>

        <AppCard>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">{{ isEdit ? '编辑活动' : '创建活动' }}</h2>
            <span class="px-3 py-1 rounded-full text-sm" :class="statusColorClass(activityData.status)">
              {{ statusText(activityData.status) }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label class="block text-sm font-medium text-gray-700">活动名称</label><input type="text" v-model="formData.name" class="w-full border rounded px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700">分类</label><select v-model="formData.category_id" class="w-full border rounded px-3 py-2"><option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">{{ cat.label }}</option></select></div>
            <div><label class="block text-sm font-medium text-gray-700">开始时间</label><input type="datetime-local" v-model="formData.start_time" class="w-full border rounded px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700">结束时间</label><input type="datetime-local" v-model="formData.end_time" class="w-full border rounded px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700">校区</label><input type="text" v-model="formData.campus" class="w-full border rounded px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700">地点</label><input type="text" v-model="formData.location" class="w-full border rounded px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700">人数上限</label><input type="number" v-model="formData.max_participants" class="w-full border rounded px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700">报名截止时间</label><input type="datetime-local" v-model="formData.registration_deadline" class="w-full border rounded px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700">取消报名截止时间</label><input type="datetime-local" v-model="formData.cancel_deadline" class="w-full border rounded px-3 py-2"></div>
            <div class="col-span-2"><label class="block text-sm font-medium text-gray-700">活动简介</label><textarea v-model="formData.description" rows="3" class="w-full border rounded px-3 py-2"></textarea></div>
          </div>

          <div class="flex flex-wrap gap-3 pt-4 mt-4 border-t">
            <AppButton variant="blue" @click="handleSave" :disabled="!canSave">保存修改</AppButton>
            <AppButton variant="blue" @click="handleApplyReview" :disabled="!canApplyReview">申请审核</AppButton>
            <AppButton variant="blue" @click="goToRegistrations">报名管理</AppButton>
            <AppButton variant="blue" @click="generateQRCode">生成签到码</AppButton>
            <AppButton variant="blue" @click="goToSignRecords">签到管理</AppButton>
            <AppButton variant="blue" @click="goToStats">数据统计</AppButton>
            <AppButton variant="destructive" @click="handleDelete" :disabled="!canDelete">删除活动</AppButton>
          </div>
        </AppCard>

        <AppDialog v-model:open="qrDialogVisible" title="签到码" confirm-text="关闭" @confirm="qrDialogVisible = false">
          <div class="text-center py-4"><p class="text-2xl font-mono tracking-wider">{{ qrCode }}</p><p class="text-sm text-gray-500 mt-2">有效期至活动结束</p></div>
        </AppDialog>
      </AppPageContainer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppPageContainer from '@/components/layout/AppPageContainer.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppDialog from '@/components/layout/AppDialog.vue'

const router = useRouter()
const route = useRoute()
const activityId = route.query.id ? Number(route.query.id) : null
const isEdit = !!activityId

const formData = reactive({
  name: '',
  category_id: null as number | null,
  start_time: '',
  end_time: '',
  campus: '',
  location: '',
  max_participants: 0,
  registration_deadline: '',
  cancel_deadline: '',
  description: ''
})

const activityData = reactive({
  id: 0,
  status: '',
  current_participants: 0
})

const categoryOptions = ref([
  { value: 1, label: '学术类' },
  { value: 2, label: '文体类' },
  { value: 3, label: '志愿服务类' }
])

const isPublished = computed(() => ['open', 'edit_pending', 'ongoing'].includes(activityData.status))
const isWithinOneHourBeforeStart = computed(() => false)
const canSave = computed(() => !isWithinOneHourBeforeStart.value)
const canApplyReview = computed(() => activityData.status === 'pending' || activityData.status === 'rejected')
const canDelete = computed(() => !isWithinOneHourBeforeStart.value && !['ended', 'shelved'].includes(activityData.status))

const statusText = (s: string) => {
  const map: Record<string, string> = { pending: '待审核', modifying: '审核中', rejected: '审核未通过', shelved: '下架', open: '报名中', edit_pending: '审核修改中', ongoing: '进行中', ended: '已结束' }
  return map[s] || s
}
const statusColorClass = (s: string) => {
  const map: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', modifying: 'bg-blue-100 text-blue-700', rejected: 'bg-red-100 text-red-700', shelved: 'bg-gray-100 text-gray-700', open: 'bg-green-100 text-green-700', ongoing: 'bg-indigo-100 text-indigo-700', ended: 'bg-slate-100 text-slate-700' }
  return map[s] || 'bg-gray-100 text-gray-700'
}

const fetchActivityDetail = async () => {
  if (!isEdit) return
  activityData.id = activityId!
  activityData.status = 'pending'
  activityData.current_participants = 0
  formData.name = '校园歌手大赛'
  formData.category_id = 2
  formData.start_time = '2026-06-10T18:00'
  formData.end_time = '2026-06-10T21:00'
  formData.campus = '校本部'
  formData.location = '报告厅'
  formData.max_participants = 100
  formData.registration_deadline = '2026-06-05T23:59'
  formData.cancel_deadline = '2026-06-09T23:59'
  formData.description = '全校歌唱比赛'
}

const handleSave = () => { alert('保存成功（模拟）') }
const handleApplyReview = () => { alert('已提交审核（模拟）') }
const handleDelete = () => { if (confirm('确定删除？')) alert('已删除（模拟）') }
const goToRegistrations = () => router.push(`/organizer/registrations?activityId=${activityId}`)
const goToSignRecords = () => router.push(`/organizer/signs?activityId=${activityId}`)
const goToStats = () => router.push(`/organizer/stats?activityId=${activityId}`)
const qrDialogVisible = ref(false)
const qrCode = ref('')
const generateQRCode = () => { qrCode.value = Math.random().toString(36).substring(2, 8).toUpperCase(); qrDialogVisible.value = true }
const goBack = () => router.back()

const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchActivityDetail()
})
</script>