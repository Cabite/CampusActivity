<template>
  <div class="flex h-screen">
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
          <h1 class="text-3xl font-bold text-white">用户管理</h1>
          <p class="text-white/70 mt-1">管理平台所有用户</p>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AppCard class="text-center">
            <div class="text-3xl font-bold text-blue-600">1,234</div>
            <div class="text-gray-500 mt-2">普通用户数</div>
          </AppCard>
          <AppCard class="text-center">
            <div class="text-3xl font-bold text-blue-600">12</div>
            <div class="text-gray-500 mt-2">组织者</div>
          </AppCard>
          <AppCard class="text-center">
            <div class="text-3xl font-bold text-blue-600">3</div>
            <div class="text-gray-500 mt-2">管理员</div>
          </AppCard>
          <AppCard class="text-center">
            <div class="text-3xl font-bold text-orange-500">2</div>
            <div class="text-gray-500 mt-2">待审批组织者</div>
          </AppCard>
        </div>

        <!-- 顶部三个切换按钮 -->
        <div class="flex gap-3 mb-6">
          <button @click="activeTab = 'user'" class="px-4 py-2 rounded-lg font-medium" :class="activeTab === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'">普通用户</button>
          <button @click="activeTab = 'organizer'" class="px-4 py-2 rounded-lg font-medium" :class="activeTab === 'organizer' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'">组织者</button>
          <button @click="activeTab = 'admin'" class="px-4 py-2 rounded-lg font-medium" :class="activeTab === 'admin' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'">管理员</button>
        </div>

        <!-- 普通用户列表 -->
        <div v-show="activeTab === 'user'">
          <AppCard :loading="userLoading">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">学号</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">学院</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="u in users" :key="u.id">
                    <td class="px-6 py-4">{{ u.student_id }}</td>
                    <td class="px-6 py-4">{{ u.college }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 rounded-full text-xs" :class="u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                        {{ u.status === 'active' ? '正常' : '禁用' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AppCard>
        </div>

        <!-- 组织者列表 -->
        <div v-show="activeTab === 'organizer'">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-4 items-end">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">组织名称</label>
              <input type="text" v-model="orgFilters.name" placeholder="输入组织名称" class="border rounded-lg px-3 py-2 text-sm w-48">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">审核状态</label>
              <select v-model="orgFilters.status" class="border rounded-lg px-3 py-2 text-sm w-36">
                <option value="">全部</option>
                <option value="pending">待审核</option>
                <option value="approved">已通过</option>
                <option value="rejected">已拒绝</option>
              </select>
            </div>
            <div>
              <button @click="fetchOrganizers" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">筛选</button>
              <button @click="resetOrgFilters" class="ml-2 px-4 py-2 border border-gray-300 rounded-lg text-sm">重置</button>
            </div>
          </div>
          <AppCard :loading="orgLoading">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">组织名</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">邮箱</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">审核状态</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="org in organizers" :key="org.id">
                    <td class="px-6 py-4">{{ org.org_name }}</td>
                    <td class="px-6 py-4">{{ org.email }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 rounded-full text-xs" :class="getOrgStatusClass(org.status)">
                        {{ getOrgStatusText(org.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <button @click="openOrgDetail(org)" class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">详情</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AppCard>
        </div>

        <!-- 管理员列表（仅超级管理员可见） -->
        <div v-show="activeTab === 'admin'">
          <div class="flex justify-end mb-4">
            <AppButton variant="blue" @click="openAddAdminModal">+ 新增管理员</AppButton>
          </div>
          <AppCard :loading="adminLoading">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">用户名</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">邮箱</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="adm in admins" :key="adm.admin_id">
                    <td class="px-6 py-4">{{ adm.username }}</td>
                    <td class="px-6 py-4">{{ adm.email }}</td>
                    <td class="px-6 py-4">
                      <span v-if="adm.admin_no === '000001'" class="text-gray-400 text-xs">不可操作（0号）</span>
                      <button v-else @click="deleteAdmin(adm.admin_id)" class="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AppCard>
        </div>

        <!-- 组织者详情弹窗 -->
        <AppDialog v-model:open="orgModalVisible" title="组织者审核" confirm-text="通过" cancel-text="关闭" @confirm="approveOrganizer" :show-cancel="true" confirm-variant="blue">
          <div class="space-y-3">
            <div><label class="block text-sm font-medium">组织名</label><input type="text" v-model="currentOrg.org_name" class="w-full border rounded px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium">邮箱</label><input type="text" v-model="currentOrg.email" class="w-full border rounded px-3 py-2 bg-gray-50" readonly></div>
            <div><label class="block text-sm font-medium">当前状态</label><span class="ml-2 px-2 py-1 rounded-full text-xs" :class="getOrgStatusClass(currentOrg.status)">{{ getOrgStatusText(currentOrg.status) }}</span></div>
            <div><label class="block text-sm font-medium">审核操作</label>
              <div class="flex gap-2 mt-1">
                <button @click="approveOrganizer" class="px-4 py-2 bg-green-600 text-white rounded">通过</button>
                <button @click="openRejectOrgModal" class="px-4 py-2 bg-red-600 text-white rounded">拒绝</button>
              </div>
            </div>
            <div v-if="showRejectReason">
              <label class="block text-sm font-medium">拒绝理由</label>
              <textarea v-model="rejectReason" rows="2" class="w-full border rounded px-3 py-2"></textarea>
              <button @click="confirmRejectOrganizer" class="mt-2 px-4 py-2 bg-red-600 text-white rounded">确认拒绝</button>
            </div>
          </div>
        </AppDialog>

        <!-- 新增管理员弹窗 -->
        <AppDialog v-model:open="adminModalVisible" title="新增管理员" confirm-text="添加" cancel-text="取消" @confirm="addAdmin">
          <div class="space-y-3">
            <input type="text" v-model="newAdmin.username" placeholder="用户名" class="w-full border rounded px-3 py-2">
            <input type="email" v-model="newAdmin.email" placeholder="邮箱" class="w-full border rounded px-3 py-2">
            <input type="password" v-model="newAdmin.password" placeholder="初始密码" class="w-full border rounded px-3 py-2">
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
import { getUsers, getOrganizers, reviewOrganizer, getAdmins, createAdmin, deleteAdmin } from '@/api/admin'

const router = useRouter()

const activeTab = ref<'user' | 'organizer' | 'admin'>('user')

// 普通用户
const userLoading = ref(false)
const users = ref<any[]>([])

// 组织者
const orgLoading = ref(false)
const organizers = ref<any[]>([])
const orgFilters = reactive({ name: '', status: '' })
const orgModalVisible = ref(false)
const currentOrg = ref<any>({})
const showRejectReason = ref(false)
const rejectReason = ref('')

// 管理员
const adminLoading = ref(false)
const admins = ref<any[]>([])
const adminModalVisible = ref(false)
const newAdmin = reactive({ username: '', email: '', password: '' })

// 模拟数据
const mockUsers = [
  { id: 1, student_id: '2024110101', college: '计算机学院', status: 'active' },
  { id: 2, student_id: '2023120202', college: '软件学院', status: 'active' }
]
const mockOrganizers = [
  { id: 1, org_name: '学生会', email: 'studentunion@campus.com', status: 'approved' },
  { id: 2, org_name: '计算机协会', email: 'cs@campus.com', status: 'pending' }
]
const mockAdmins = [
  { admin_id: 1, admin_no: '000001', username: '超级管理员', email: 'super@campus.com', role: 'super_admin' },
  { admin_id: 2, admin_no: '000002', username: 'admin2', email: 'admin2@campus.com', role: 'admin' }
]

const fetchUsers = async () => {
  userLoading.value = true
  try {
    const res = await getUsers({ page: 1, page_size: 100 })
    if (res.code === 200) {
      users.value = res.data.list
    } else {
      throw new Error()
    }
  } catch {
    users.value = mockUsers
  } finally {
    userLoading.value = false
  }
}

const fetchOrganizers = async () => {
  orgLoading.value = true
  try {
    const res = await getOrganizers({ org_name: orgFilters.name, status: orgFilters.status })
    if (res.code === 200) {
      organizers.value = res.data.list
    } else {
      throw new Error()
    }
  } catch {
    organizers.value = mockOrganizers
  } finally {
    orgLoading.value = false
  }
}

const resetOrgFilters = () => {
  orgFilters.name = ''
  orgFilters.status = ''
  fetchOrganizers()
}

const getOrgStatusText = (status: string) => {
  const map: Record<string, string> = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
  return map[status] || status
}
const getOrgStatusClass = (status: string) => {
  const map: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' }
  return map[status] || 'bg-gray-100'
}

const openOrgDetail = (org: any) => {
  currentOrg.value = org
  showRejectReason.value = false
  rejectReason.value = ''
  orgModalVisible.value = true
}

const approveOrganizer = async () => {
  try {
    await reviewOrganizer(currentOrg.value.id, 'approve')
    alert('已通过')
    orgModalVisible.value = false
    fetchOrganizers()
  } catch {
    alert('操作失败')
  }
}

const openRejectOrgModal = () => {
  showRejectReason.value = true
}

const confirmRejectOrganizer = async () => {
  if (!rejectReason.value.trim()) {
    alert('请填写拒绝理由')
    return
  }
  try {
    await reviewOrganizer(currentOrg.value.id, 'reject', rejectReason.value)
    alert('已拒绝')
    orgModalVisible.value = false
    fetchOrganizers()
  } catch {
    alert('操作失败')
  }
}

const fetchAdmins = async () => {
  adminLoading.value = true
  try {
    const res = await getAdmins()
    if (res.code === 200) {
      admins.value = res.data
    } else {
      throw new Error()
    }
  } catch {
    admins.value = mockAdmins
  } finally {
    adminLoading.value = false
  }
}

const openAddAdminModal = () => {
  newAdmin.username = ''
  newAdmin.email = ''
  newAdmin.password = ''
  adminModalVisible.value = true
}

const addAdmin = async () => {
  if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
    alert('请填写完整')
    return
  }
  try {
    await createAdmin(newAdmin)
    alert('管理员添加成功')
    adminModalVisible.value = false
    fetchAdmins()
  } catch {
    alert('操作失败')
  }
}

const deleteAdmin = async (id: number) => {
  if (!confirm('确定删除该管理员吗？')) return
  try {
    await deleteAdmin(id)
    alert('已删除')
    fetchAdmins()
  } catch {
    alert('操作失败')
  }
}

const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchUsers()
  fetchOrganizers()
  fetchAdmins()
})
</script>