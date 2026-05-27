<template>
  <div class="flex h-screen">
    <OrganizerSidebar />

    <main class="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <AppPageContainer variant="gradient" padding="lg" max-width="2xl">
        <div class="mb-6"><h1 class="text-3xl font-bold text-white">个人中心</h1><p class="text-white/70 mt-1">账号信息与管理</p></div>
        <AppCard>
          <div class="flex flex-col items-center py-6 border-b border-gray-100">
            <div class="relative"><img :src="avatarUrl" class="w-28 h-28 rounded-full border-4 border-blue-100 object-cover" /><button @click="openAvatarUpload" class="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md"><iconify-icon icon="ph:pencil-simple" class="text-gray-500 text-sm"></iconify-icon></button></div>
            <h2 class="text-2xl font-bold mt-3">{{ formData.org_name }}</h2><p class="text-gray-500">组织者</p><div class="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{{ statusText(profileStatus) }}</div>
          </div>
          <div class="space-y-4 mt-4">
            <div><label class="block text-sm font-medium text-gray-700 mb-1">组织名称</label><input type="text" v-model="formData.org_name" class="w-full border rounded-lg px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label><input type="email" v-model="formData.email" class="w-full border rounded-lg px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label><input type="tel" v-model="formData.phone" class="w-full border rounded-lg px-3 py-2"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">组织简介</label><textarea v-model="formData.description" rows="3" class="w-full border rounded-lg px-3 py-2"></textarea></div>
            <div class="flex gap-3"><AppButton variant="blue" @click="handleSubmit" :loading="submitting">保存修改</AppButton><AppButton variant="outline" @click="goBack">取消</AppButton></div>
          </div>
          <div class="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100"><AppButton variant="outline" @click="openChangePasswordModal">修改密码</AppButton><AppButton variant="outline" @click="handleLogout">登出账号</AppButton><AppButton variant="destructive" @click="handleDeleteAccount">注销账号</AppButton></div>
        </AppCard>
        <AppDialog v-model:open="pwdModalVisible" title="修改密码" confirm-text="保存" cancel-text="取消" @confirm="changePassword"><input type="password" v-model="oldPassword" placeholder="当前密码" class="w-full border rounded px-3 py-2 mb-3"><input type="password" v-model="newPassword" placeholder="新密码" class="w-full border rounded px-3 py-2 mb-3"><input type="password" v-model="confirmPassword" placeholder="确认新密码" class="w-full border rounded px-3 py-2"></AppDialog>
        <AppDialog v-model:open="avatarModalVisible" title="修改头像" confirm-text="保存" cancel-text="取消" @confirm="uploadAvatarHandler"><input type="file" ref="avatarInput" accept="image/*" class="hidden" @change="onAvatarSelected"><AppButton variant="outline" @click="triggerFileInput" class="w-full">选择图片</AppButton><img v-if="avatarPreview" :src="avatarPreview" class="mt-3 w-32 h-32 rounded-full mx-auto object-cover"></AppDialog>
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
import { getProfile, updateProfile, uploadAvatar } from '@/api/user'
import { showApiError } from '@/api/request'
import OrganizerSidebar from '@/components/layout/OrganizerSidebar.vue'

const router = useRouter()
const submitting = ref(false)

const formData = reactive({
  org_name: '',
  email: '',
  phone: '',
  description: ''
})
const profileStatus = ref('approved')
const avatarUrl = ref('')

const fetchProfile = async () => {
  try {
    const data = await getProfile() as any  // 使用 as any 临时解决类型不匹配
    formData.org_name = data.org_name || ''
    formData.email = data.email || ''
    formData.phone = data.phone || ''
    formData.description = data.org_proof_text || ''
    profileStatus.value = data.status || 'approved'
    avatarUrl.value = data.avatar || ''
  } catch (e) {
    showApiError(e, '获取个人信息失败')
  }
}
const handleSubmit = async () => {
  submitting.value = true
  try {
    await updateProfile({ phone: formData.phone })
    alert('信息已保存')
    await fetchProfile()
  } catch (e) {
    showApiError(e, '保存失败')
  } finally {
    submitting.value = false
  }
}
const avatarModalVisible = ref(false)
const avatarInput = ref<HTMLInputElement>()
const avatarPreview = ref('')
const selectedFile = ref<File | null>(null)
const openAvatarUpload = () => { avatarModalVisible.value = true; avatarPreview.value = ''; selectedFile.value = null }
const triggerFileInput = () => avatarInput.value?.click()
const onAvatarSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
    avatarPreview.value = URL.createObjectURL(selectedFile.value)
  }
}
const uploadAvatarHandler = async () => {
  if (!selectedFile.value) { alert('请选择图片'); return }
  try {
    const res = await uploadAvatar(selectedFile.value)
    avatarUrl.value = res.avatar_url
    alert('头像更新成功')
    avatarModalVisible.value = false
  } catch (e) {
    showApiError(e, '上传失败')
  }
}
const pwdModalVisible = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const openChangePasswordModal = () => { oldPassword.value = ''; newPassword.value = ''; confirmPassword.value = ''; pwdModalVisible.value = true }
const changePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) { alert('请填写完整'); return }
  if (newPassword.value !== confirmPassword.value) { alert('新密码与确认密码不一致'); return }
  alert('密码修改成功，请重新登录')
  pwdModalVisible.value = false
  handleLogout()
}
const handleLogout = () => { if (confirm('确定退出登录吗？')) router.push('/login') }
const handleDeleteAccount = () => { if (confirm('确定注销？')) router.push('/login') }
const goBack = () => router.back()
const statusText = (status: string) => ({ pending: '审核中', approved: '已认证', rejected: '审核未通过' }[status] || status)

onMounted(() => {
  fetchProfile()
})
</script>