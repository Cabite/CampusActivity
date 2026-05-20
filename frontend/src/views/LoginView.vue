<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { User, Lock } from 'lucide-vue-next'
import { AppCard, AppForm, AppPageContainer } from '@/components'
import type { FormField } from '@/components/layout/AppForm.vue'
import { login } from '@/api/auth'
import { showApiError } from '@/api/request'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { toast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const userStore = useUserStore()

const roleTab = ref('user')
const isSubmitting = ref(false)

const roleTabs = [
  { value: 'user', label: '普通用户' },
  { value: 'organizer', label: '组织者' },
  { value: 'admin', label: '管理员' },
]

const loginFields: FormField[] = [
  {
    name: 'account',
    label: '学号',
    placeholder: '请输入学号',
    required: true,
    leftIcon: User,
    hint: 'Mock：2024000001 / password123',
  },
  {
    name: 'password',
    label: '密码',
    type: 'password',
    placeholder: '请输入密码',
    required: true,
    leftIcon: Lock,
  },
]

async function handleLogin(values: Record<string, string>) {
  if (roleTab.value !== 'user') {
    toast.info('学生端请使用「普通用户」登录')
    return
  }
  isSubmitting.value = true
  try {
    const data = await login(values.account, values.password)
    auth.setAuth(data.token, data.user_id)
    await userStore.fetchProfile()
    toast.success('登录成功')
    router.push((route.query.redirect as string) || '/activities')
  } catch (e) {
    showApiError(e, '账号或密码错误')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AppPageContainer variant="gradient" :show-grid="true" :show-glow="true" padding="none" max-width="full">
    <div class="absolute left-8 top-6 z-20 text-xl font-bold text-white">BIT</div>

    <div class="flex min-h-screen items-center justify-center gap-12 px-6 py-16 lg:px-16">
      <div class="hidden max-w-xl flex-1 text-white lg:block">
        <h1 class="mb-4 whitespace-nowrap text-5xl font-bold leading-tight">Hi，你好！</h1>
        <p class="text-2xl font-semibold leading-snug">欢迎进入校园活动管理系统</p>
      </div>

      <AppCard rounded="2xl" class="z-10 w-full max-w-md">
        <h2 class="mb-6 text-center text-xl font-semibold text-blue-600">登录</h2>

        <div class="proto-segment mb-6 w-full">
          <button
            v-for="tab in roleTabs"
            :key="tab.value"
            type="button"
            :class="['proto-segment-item flex-1 text-center', roleTab === tab.value && 'active']"
            @click="roleTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <AppForm
          :fields="loginFields"
          :columns="1"
          submit-text="登录"
          submit-variant="blue"
          :submit-full-width="true"
          :loading="isSubmitting"
          @submit="handleLogin"
        />

        <p class="mt-4 text-sm text-muted-foreground">
          <RouterLink to="/register" class="text-blue-600 hover:underline">注册账号</RouterLink>
        </p>
      </AppCard>
    </div>

    <p class="pb-6 text-center text-xs text-white/80">技术支持：前端a</p>
  </AppPageContainer>
</template>
