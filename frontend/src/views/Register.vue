<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-blue-600">CampusActivity</h1>
        <p class="text-gray-500 text-sm">组织者注册</p>
        <p class="text-xs text-gray-400 mt-1">申请发布活动权限，需管理员审核</p>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
          <input type="email" v-model="form.email" required class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="org@example.com">
          <p class="text-xs text-gray-400 mt-1">请使用合法邮箱，系统将校验唯一性</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">组织名称 *</label>
          <input type="text" v-model="form.org_name" required minlength="2" maxlength="20" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="2-20位字符（字母/数字/中文）">
          <p class="text-xs text-gray-400 mt-1">长度2-20，支持字母、数字、中文</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">密码 *</label>
          <input type="password" v-model="form.password" required minlength="6" maxlength="20" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="6-20位字符">
          <p class="text-xs text-gray-400 mt-1">6-20位，建议字母+数字组合（后端将加密存储）</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">确认密码 *</label>
          <input type="password" v-model="form.confirm_password" required class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="再次输入密码">
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">组织证明</label>
          <textarea v-model="form.org_proof_text" rows="3" class="w-full border rounded-lg px-3 py-2" placeholder="请描述组织身份、活动范围（可选）"></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">上传证明图片（可选）</label>
          <input type="file" ref="fileInput" accept="image/jpeg,image/png" @change="handleFileChange" class="hidden">
          <button type="button" @click="triggerFileInput" class="w-full border border-dashed rounded-lg py-2 text-gray-500 hover:bg-gray-50">上传证明图片</button>
          <p v-if="form.org_proof_image" class="text-xs text-green-600 mt-1">已选择文件</p>
          <p class="text-xs text-gray-400 mt-1">支持图片格式（jpg/png），大小不超过5MB（前端仅展示，实际需后端处理）</p>
        </div>

        <div class="text-xs text-gray-500 text-center mb-4">
          注册后需要管理员审核发布资质，审核通过后方可创建活动。
        </div>

        <button type="submit" class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" :disabled="loading">
          {{ loading ? '注册中...' : '提交注册申请' }}
        </button>

        <div class="text-center mt-4 text-sm">
          已有组织者账号？
          <router-link to="/login" class="text-blue-600 hover:underline">立即登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { registerOrganizer, type OrganizerRegisterPayload } from '@/api/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const fileInput = ref<HTMLInputElement>()

const form = ref({
  email: '',
  org_name: '',
  password: '',
  confirm_password: '',
  org_proof_text: '',
  org_proof_image: ''
})

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB')
      return
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('只支持 jpg/png 格式')
      return
    }
    form.value.org_proof_image = file.name
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleRegister = async () => {
  // 表单验证
  if (!form.value.email) {
    alert('请输入邮箱')
    return
  }
  if (!form.value.org_name) {
    alert('请输入组织名称')
    return
  }
  if (!form.value.password) {
    alert('请输入密码')
    return
  }
  if (form.value.password !== form.value.confirm_password) {
    alert('两次输入的密码不一致')
    return
  }
  if (form.value.password.length < 6) {
    alert('密码长度不能小于6位')
    return
  }

  loading.value = true
  try {
    // 调用组织者注册接口
    // apiPost 返回的是 data 字段的内容，即 { userId, token }
    const data = await registerOrganizer({
      email: form.value.email,
      org_name: form.value.org_name,
      password: form.value.password,
      confirm_password: form.value.confirm_password,
      org_proof_text: form.value.org_proof_text,
      org_proof_image: form.value.org_proof_image || undefined
    })
    
    // 根据接口文档，data 包含 userId 和 token
    if (data.token && data.userId) {
      // 保存认证信息
      auth.setAuth(data.token, data.userId)
      localStorage.setItem('role', 'organizer')
      alert('注册成功！请等待管理员审核')
      router.push('/organizer/activities')
    } else {
      alert('注册成功，但自动登录失败，请手动登录')
      router.push('/login')
    }
  } catch (err: any) {
    console.error('注册失败:', err)
    const message = err.message || '注册失败，请稍后重试'
    alert(message)
  } finally {
    loading.value = false
  }
}
</script>