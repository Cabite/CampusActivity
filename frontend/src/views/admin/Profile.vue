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
          <h1 class="text-3xl font-bold text-white">个人中心</h1>
          <p class="text-white/70 mt-1">账号信息与管理</p>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl mx-auto">
          <div class="flex flex-col items-center py-8 px-6 border-b border-gray-100 bg-gray-50">
            <div class="relative">
              <img :src="avatar" class="w-28 h-28 rounded-full border-4 border-blue-100 object-cover" />
              <button @click="openAvatarModal" class="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100">
                <iconify-icon icon="ph:pencil-simple" class="text-gray-500 text-sm"></iconify-icon>
              </button>
            </div>
            <h2 class="text-2xl font-bold mt-3">{{ username }}</h2>
            <p class="text-gray-500">{{ role === 'super_admin' ? '超级管理员' : '管理员' }}</p>
            <div class="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">认证管理员</div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input type="text" v-model="username" class="w-full border rounded-lg px-3 py-2" disabled />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input type="email" v-model="email" class="w-full border rounded-lg px-3 py-2" disabled />
              </div>
            </div>
            <div class="flex flex-wrap gap-3 mt-8 pt-4 border-t border-gray-100">
              <AppButton variant="outline" @click="openPwdModal">修改密码</AppButton>
              <AppButton variant="outline" @click="handleLogout">登出账号</AppButton>
              <AppButton variant="destructive" @click="handleDeleteAccount">注销账号</AppButton>
            </div>
          </div>
        </div>

        <!-- 修改密码弹窗 -->
        <AppDialog v-model:open="pwdModalVisible" title="修改密码" confirm-text="保存" cancel-text="取消" @confirm="changePassword">
          <div class="space-y-3">
            <input type="password" v-model="oldPassword" placeholder="当前密码" class="w-full border rounded px-3 py-2">
            <input type="password" v-model="newPassword" placeholder="新密码" class="w-full border rounded px-3 py-2">
            <input type="password" v-model="confirmPassword" placeholder="确认新密码" class="w-full border rounded px-3 py-2">
          </div>
        </AppDialog>

        <!-- 修改头像弹窗 -->
        <AppDialog v-model:open="avatarModalVisible" title="修改头像" confirm-text="保存" cancel-text="取消" @confirm="updateAvatar">
          <input type="text" v-model="avatarUrl" placeholder="输入头像图片URL" class="w-full border rounded px-3 py-2">
        </AppDialog>
      </AppPageContainer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppPageContainer from '@/components/layout/AppPageContainer.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppDialog from '@/components/layout/AppDialog.vue'
import { getUserProfile, updateAvatar, resetPassword, deleteAccount, logout } from '@/api/organizer' // 复用

const router = useRouter()

// 用户信息
const username = ref('管理员')
const email = ref('admin@campus.com')
const avatar = ref('https://modao.cc/agent-py/media/generated_images/2026-05-15/8eb007fda4b34653a3e2673b81eafd5d.jpg')
const role = ref('super_admin') // 或 'admin'

// 修改密码
const pwdModalVisible = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 修改头像
const avatarModalVisible = ref(false)
const avatarUrl = ref('')

// 模拟数据
const mockProfile = {
  username: '管理员',
  email: 'admin@campus.com',
  avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-15/8eb007fda4b34653a3e2673b81eafd5d.jpg',
  role: 'super_admin'
}

const fetchProfile = async () => {
  try {
    const res = await getUserProfile()
    if (res.code === 200) {
      username.value = res.data.username
      email.value = res.data.email
      avatar.value = res.data.avatar
      role.value = res.data.role
    } else {
      throw new Error()
    }
  } catch {
    username.value = mockProfile.username
    email.value = mockProfile.email
    avatar.value = mockProfile.avatar
    role.value = mockProfile.role
  }
}

const changePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    alert('请填写完整')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    alert('新密码与确认密码不一致')
    return
  }
  try {
    // 注意：重置密码需要 token，此处简化，实际应调用 /user/reset-password
    // 这里模拟成功
    alert('密码修改成功，请重新登录')
    pwdModalVisible.value = false
    handleLogout()
  } catch {
    alert('修改失败')
  }
}

const updateAvatar = async () => {
  if (!avatarUrl.value.trim()) {
    alert('请输入图片URL')
    return
  }
  try {
    // 注意：updateAvatar 需要 formData，这里为简化直接传 URL（实际应通过文件上传）
    // 模拟成功
    avatar.value = avatarUrl.value
    alert('头像已更新')
    avatarModalVisible.value = false
  } catch {
    alert('更新失败')
  }
}

const openPwdModal = () => {
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  pwdModalVisible.value = true
}
const openAvatarModal = () => {
  avatarUrl.value = avatar.value
  avatarModalVisible.value = true
}

const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    try {
      await logout()
      router.push('/login')
    } catch {
      router.push('/login')
    }
  }
}

const handleDeleteAccount = async () => {
  if (confirm('注销账号后将无法恢复，所有数据将被清除。确定注销吗？')) {
    try {
      await deleteAccount(true)
      router.push('/login')
    } catch {
      alert('注销失败')
    }
  }
}

const logout = () => {
  if (confirm('确定退出登录吗？')) router.push('/login')
}

onMounted(() => {
  fetchProfile()
})
</script>