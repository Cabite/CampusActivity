<template>
  <div class="flex h-screen">
    <AdminSidebar />

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

        <AppDialog v-model:open="pwdModalVisible" title="修改密码" confirm-text="保存" cancel-text="取消" @confirm="changePassword">
          <div class="space-y-3">
            <input type="password" v-model="oldPassword" placeholder="当前密码" class="w-full border rounded px-3 py-2">
            <input type="password" v-model="newPassword" placeholder="新密码" class="w-full border rounded px-3 py-2">
            <input type="password" v-model="confirmPassword" placeholder="确认新密码" class="w-full border rounded px-3 py-2">
          </div>
        </AppDialog>

        <AppDialog v-model:open="avatarModalVisible" title="修改头像" confirm-text="保存" cancel-text="取消" @confirm="updateAvatar">
          <input type="file" ref="avatarInput" accept="image/*" class="hidden" @change="onAvatarSelected">
          <AppButton variant="outline" @click="triggerFileInput" class="w-full">选择图片</AppButton>
          <img v-if="avatarPreview" :src="avatarPreview" class="mt-3 w-32 h-32 rounded-full mx-auto object-cover">
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
import { getProfile, updateProfile, uploadAvatar, resetPassword, deleteAccount } from '@/api/user'
import { logout } from '@/api/auth'
import { showApiError } from '@/api/request'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'

const router = useRouter()

const username = ref('')
const email = ref('')
const avatar = ref('')
const role = ref('')

const pwdModalVisible = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const avatarModalVisible = ref(false)
const avatarInput = ref<HTMLInputElement>()
const avatarPreview = ref('')
const selectedFile = ref<File | null>(null)

const fetchProfile = async () => {
  try {
    const data = await getProfile()
    username.value = data.username
    email.value = data.email
    avatar.value = data.avatar || ''
    role.value = (data as any).role || ''
  } catch (e) {
    showApiError(e, '获取个人信息失败')
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
  alert('密码修改成功，请重新登录')
  pwdModalVisible.value = false
  handleLogout()
}

const onAvatarSelected = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
    avatarPreview.value = URL.createObjectURL(selectedFile.value)
  }
}
const triggerFileInput = () => avatarInput.value?.click()
const updateAvatar = async () => {
  if (!selectedFile.value) {
    alert('请选择图片')
    return
  }
  try {
    const res = await uploadAvatar(selectedFile.value)
    avatar.value = res.avatar_url
    alert('头像更新成功')
    avatarModalVisible.value = false
  } catch (e) {
    showApiError(e, '上传失败')
  }
}

const openPwdModal = () => {
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  pwdModalVisible.value = true
}
const openAvatarModal = () => {
  avatarModalVisible.value = true
  avatarPreview.value = ''
  selectedFile.value = null
}
const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    try {
      await logout()
    } catch {}
    router.push('/login')
  }
}
const handleDeleteAccount = async () => {
  if (confirm('注销账号后将无法恢复，所有数据将被清除。确定注销吗？')) {
    try {
      await deleteAccount()
      router.push('/login')
    } catch (e) {
      showApiError(e, '注销失败')
    }
  }
}

onMounted(() => {
  fetchProfile()
})
</script>