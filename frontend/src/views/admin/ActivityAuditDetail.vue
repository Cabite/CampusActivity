<template>
  <div class="flex h-screen">
    <!-- 侧边栏（同上） -->
    <aside class="w-64 bg-white shadow-md flex flex-col z-10">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-blue-600">CampusActivity</h1>
        <p class="text-xs text-gray-500">管理员面板</p>
      </div>
      <nav class="flex-1 p-2 space-y-1">
        <router-link to="/admin/dashboard" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-600">
          <iconify-icon icon="ph:gauge" class="mr-2 w-5 h-5"></iconify-icon> 控制台
        </router-link>
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
        <!-- 以下为原 ActivityAuditDetail.vue 的完整内容 -->
        <div class="mb-4">
          <AppButton variant="link" @click="goBack" class="text-white">
            <iconify-icon icon="ph:arrow-left-bold"></iconify-icon> 返回
          </AppButton>
        </div>

        <AppCard :loading="loading">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">活动审核详情</h2>
            <span class="px-3 py-1 rounded-full text-sm" :class="statusColorClass(activity.status)">
              {{ statusText(activity.status) }}
            </span>
          </div>

          <!-- 只读信息展示 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-8">
            <div><label class="block text-sm font-medium text-gray-700">活动名称</label><input type="text" v-model="activity.name" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium text-gray-700">分类</label><input type="text" v-model="activity.category_name" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium text-gray-700">组织者</label><input type="text" v-model="activity.organizer_name" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium text-gray-700">开始时间</label><input type="text" v-model="activity.start_time" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium text-gray-700">结束时间</label><input type="text" v-model="activity.end_time" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium text-gray-700">校区</label><input type="text" v-model="activity.campus" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium text-gray-700">地点</label><input type="text" v-model="activity.location" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium text-gray-700">人数上限</label><input type="text" v-model="activity.max_participants" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium text-gray-700">报名截止时间</label><input type="text" v-model="activity.registration_deadline" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium text-gray-700">取消报名截止时间</label><input type="text" v-model="activity.cancel_deadline" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium text-gray-700">报名人数</label><input type="text" v-model="activity.current_participants" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium text-gray-700">签到人数</label><input type="text" v-model="activity.checked_in_count" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></div>
            <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700">活动简介</label><textarea v-model="activity.description" rows="3" class="w-full border rounded-lg px-3 py-2 bg-gray-50" readonly></textarea></div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-3 pt-4 border-t" v-if="activity.status === 'pending'">
            <AppButton variant="blue" @click="approve">通过</AppButton>
            <AppButton variant="destructive" @click="openRejectModal">拒绝</AppButton>
          </div>
          <div class="flex gap-3 pt-4 border-t" v-if="activity.status === 'approved' && !isActivityStarted">
            <AppButton variant="destructive" @click="openRemoveModal">下架</AppButton>
          </div>
        </AppCard>

        <!-- 拒绝理由弹窗 -->
        <AppDialog v-model:open="rejectModalVisible" title="拒绝理由" confirm-text="确认拒绝" cancel-text="取消" @confirm="confirmReject">
          <textarea v-model="rejectReason" rows="3" placeholder="请输入拒绝理由" class="w-full border rounded-lg px-3 py-2"></textarea>
        </AppDialog>

        <!-- 下架理由弹窗 -->
        <AppDialog v-model:open="removeModalVisible" title="下架理由" confirm-text="确认下架" cancel-text="取消" @confirm="confirmRemove">
          <textarea v-model="removeReason" rows="3" placeholder="请输入下架理由" class="w-full border rounded-lg px-3 py-2"></textarea>
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
const activityId = Number(route.params.id)
const loading = ref(false)

const activity = reactive({
  id: 0,
  name: '',
  category_name: '',
  organizer_name: '',
  start_time: '',
  end_time: '',
  campus: '',
  location: '',
  max_participants: 0,
  current_participants: 0,
  registration_deadline: '',
  cancel_deadline: '',
  description: '',
  status: '',
  checked_in_count: 0
})

// 模拟数据
const mockActivityDetail = {
  id: 1,
  name: '校园歌手大赛',
  category_name: '文体类',
  organizer_name: '学生会文艺部',
  start_time: '2026-06-10 18:00',
  end_time: '2026-06-10 21:00',
  campus: '校本部',
  location: '报告厅',
  max_participants: 100,
  current_participants: 45,
  registration_deadline: '2026-06-05 23:59',
  cancel_deadline: '2026-06-09 23:59',
  description: '全校歌唱比赛',
  status: 'pending',
  checked_in_count: 0
}

const isActivityStarted = computed(() => {
  return new Date(activity.start_time) <= new Date()
})

const statusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    removed: '已下架'
  }
  return map[status] || status
}
const statusColorClass = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    removed: 'bg-gray-100 text-gray-700'
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

const fetchActivityDetail = async () => {
  loading.value = true
  try {
    // const res = await getActivityDetail(activityId)
    throw new Error('API not implemented')
  } catch {
    Object.assign(activity, mockActivityDetail, { id: activityId })
  } finally {
    loading.value = false
  }
}

const approve = async () => {
  if (!confirm('确定通过该活动吗？')) return
  try {
    // await reviewActivity(activityId, { action: 'approve' })
    alert('审核通过')
    router.push('/admin/audit')
  } catch {
    alert('操作失败')
  }
}

const rejectModalVisible = ref(false)
const rejectReason = ref('')
const openRejectModal = () => {
  rejectReason.value = ''
  rejectModalVisible.value = true
}
const confirmReject = async () => {
  if (!rejectReason.value.trim()) {
    alert('请填写拒绝理由')
    return
  }
  try {
    // await reviewActivity(activityId, { action: 'reject', reject_reason: rejectReason.value })
    alert('已拒绝')
    router.push('/admin/audit')
  } catch {
    alert('操作失败')
  }
}

const removeModalVisible = ref(false)
const removeReason = ref('')
const openRemoveModal = () => {
  removeReason.value = ''
  removeModalVisible.value = true
}
const confirmRemove = async () => {
  if (!removeReason.value.trim()) {
    alert('请填写下架理由')
    return
  }
  try {
    // await removeActivity(activityId, { reason: removeReason.value })
    alert('活动已下架')
    router.push('/admin/audit')
  } catch {
    alert('操作失败')
  }
}

const goBack = () => router.back()

const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchActivityDetail()
})
</script>