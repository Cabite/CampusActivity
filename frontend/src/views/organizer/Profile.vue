<template>
  <div class="flex h-screen">
    <aside class="w-64 bg-white shadow-md flex flex-col z-10">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-blue-600">CampusActivity</h1>
        <p class="text-xs text-gray-500">组织者面板</p>
      </div>
      <nav class="flex-1 p-2 space-y-1">
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
          <h1 class="text-3xl font-bold text-white">个人中心</h1>
          <p class="text-white/70 mt-1">账号信息与管理</p>
        </div>

        <AppCard>
          <div class="flex flex-col items-center py-6 border-b border-gray-100">
            <div class="relative">
              <img :src="avatarUrl" class="w-28 h-28 rounded-full border-4 border-blue-100 object-cover" />
              <button @click="openAvatarUpload" class="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                <iconify-icon icon="ph:pencil-simple" class="text-gray-500 text-sm"></iconify-icon>
              </button>
            </div>
            <h2 class="text-2xl font-bold mt-3">{{ formData.org_name }}</h2>
            <p class="text-gray-500">组织者</p>
            <div class="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{{ statusText(profileStatus) }}</div>
          </div>

          <div class="space-y-4 mt-4">
            <div><label class="block text-sm font-medium text-gray-700 mb-1">组织名称</label><input type="text" v-model="formData.org_name" class="w-full border rounded-lg px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label><input type="email" v-model="formData.email" class="w-full border rounded-lg px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label><input type="tel" v-model="formData.phone" class="w-full border rounded-lg px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">组织简介</label><textarea v-model="formData.description" rows="3" class="w-full border rounded-lg px-3 py-2"></textarea></div>
            <div class="flex gap-3">
              <AppButton variant="blue" @click="handleSubmit" :loading="submitting">保存修改</AppButton>
              <AppButton variant="outline" @click="goBack">取消</AppButton>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
            <AppButton variant="outline" @click="openChangePasswordModal">修改密码</AppButton>
            <AppButton variant="outline" @click="handleLogout">登出账号</AppButton>
            <AppButton variant="destructive" @click="handleDeleteAccount">注销账号</AppButton>
          </div>
        </AppCard>

        <AppDialog v-model:open="pwdModalVisible" title="修改密码" confirm-text="保存" cancel-text="取消" @confirm="changePassword">
          <input type="password" v-model="oldPassword" placeholder="当前密码" class="w-full border rounded px-3 py-2 mb-3">
          <input type="password" v-model="newPassword" placeholder="新密码" class="w-full border rounded px-3 py-2 mb-3">
          <input type="password" v-model="confirmPassword" placeholder="确认新密码" class="w-full border rounded px-3 py-2">
        </AppDialog>

        <AppDialog v-model:open="avatarModalVisible" title="修改头像" confirm-text="保存" cancel-text="取消" @confirm="uploadAvatar">
          <input type="file" ref="avatarInput" accept="image/*" class="hidden" @change="onAvatarSelected">
          <AppButton variant="outline" @click="triggerFileInput" class="w-full">选择图片</AppButton>
          <img v-if="avatarPreview" :src="avatarPreview" class="mt-3 w-32 h-32 rounded-full mx-auto object-cover">
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
import { getUserProfile, updateUserProfile, updateAvatar, resetPassword, deleteAccount, logout } from '@/api/organizer'

const router = useRouter()
const submitting = ref(false)

const formData = reactive({
  org_name: '',
  email: '',
  phone: '',
  description: ''
})
const profileStatus = ref('approved')
const avatarUrl = ref('https://modao.cc/agent-py/media/generated_images/2026-05-15/8eb007fda4b34653a3e2673b81eafd5d.jpg')

// 模拟数据
const mockProfile = {
  org_name: 'XX社团',
  email: 'org@campus.com',
  phone: '13800000000',
  description: '致力于校园文化活动，丰富学生课余生活',
  status: 'approved',
  avatar: 'https://modao.cc/agent-py/media/generated_images/2026-05-15/8eb007fda4b34653a3e2673b81eafd5d.jpg'
}

const statusText = (status: string) => ({ pending: '审核中', approved: '已认证', rejected: '审核未通过' }[status] || status)

const fetchProfile = async () => {
  try {
    const res = await getUserProfile()
    if (res.code === 200 && res.data) {
      const data = res.data
      formData.org_name = data.org_name
      formData.email = data.email
      formData.phone = data.phone || ''
      formData.description = data.description || ''
      profileStatus.value = data.status
      avatarUrl.value = data.avatar || avatarUrl.value
    } else throw new Error()
  } catch {
    // 降级模拟数据
    formData.org_name = mockProfile.org_name
    formData.email = mockProfile.email
    formData.phone = mockProfile.phone
    formData.description = mockProfile.description
    profileStatus.value = mockProfile.status as any
    avatarUrl.value = mockProfile.avatar
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    await updateUserProfile(formData)
    alert('信息已保存')
    await fetchProfile()
  } catch {
    alert('保存失败（模拟）')
  } finally {
    submitting.value = false
  }
}

// 头像上传
const avatarModalVisible = ref(false)
const avatarInput = ref<HTMLInputElement>()
const avatarPreview = ref('')
const selectedFile = ref<File | null>(null)

const openAvatarUpload = () => {
  avatarModalVisible.value = true
  avatarPreview.value = ''
  selectedFile.value = null
}
const triggerFileInput = () => avatarInput.value?.click()
const onAvatarSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
    avatarPreview.value = URL.createObjectURL(selectedFile.value)
  }
}
const uploadAvatar = async () => {
  if (!selectedFile.value) {
    alert('请选择图片')
    return
  }
  try {
    const res = await updateAvatar(selectedFile.value)
    if (res.code === 200) avatarUrl.value = res.data.avatar_url
    alert('头像更新成功')
    avatarModalVisible.value = false
  } catch {
    alert('上传失败（模拟）')
    avatarUrl.value = avatarPreview.value
    avatarModalVisible.value = false
  }
}

// 修改密码
const pwdModalVisible = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const openChangePasswordModal = () => {
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  pwdModalVisible.value = true
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
  // 注意：修改密码需要 token，实际应由后端发送重置链接，这里简化
  try {
    // 假设已有重置 token，实际流程略复杂，这里仅作模拟
    alert('密码修改成功（模拟）')
    pwdModalVisible.value = false
  } catch {
    alert('修改失败')
  }
}

const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    try {
      await logout()
      localStorage.removeItem('token')
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
      localStorage.removeItem('token')
      router.push('/login')
    } catch {
      alert('注销失败（模拟）')
    }
  }
}
const goBack = () => router.back()
const logout = () => { if (confirm('确定退出登录吗？')) router.push('/login') }

onMounted(() => {
  fetchProfile()
})
</script>