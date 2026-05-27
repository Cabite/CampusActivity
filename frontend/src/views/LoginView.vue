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

const roleTab = ref<'user' | 'organizer' | 'admin'>('user')
const isSubmitting = ref(false)

const roleTabs = [
  { value: 'user', label: '普通用户' },
  { value: 'organizer', label: '组织者' },
  { value: 'admin', label: '管理员' },
] as const

// 根据角色动态调整表单字段的标签和提示
const loginFields = ref<FormField[]>([
  {
    name: 'account',
    label: '学号 / 邮箱',
    placeholder: '请输入学号或邮箱',
    required: true,
    leftIcon: User,
    hint: '普通用户：学号或邮箱',
  },
  {
    name: 'password',
    label: '密码',
    type: 'password',
    placeholder: '请输入密码',
    required: true,
    leftIcon: Lock,
  },
])

// 监听角色变化，改变字段的提示文本
const updateFieldHint = () => {
  if (roleTab.value === 'organizer') {
    loginFields.value[0].label = '邮箱'
    loginFields.value[0].placeholder = '请输入组织者邮箱'
    loginFields.value[0].hint = '组织者使用注册邮箱登录'
  } else if (roleTab.value === 'admin') {
    loginFields.value[0].label = '管理员编号'
    loginFields.value[0].placeholder = '请输入管理员编号'
    loginFields.value[0].hint = '管理员编号示例：000001'
  } else {
    loginFields.value[0].label = '学号 / 邮箱'
    loginFields.value[0].placeholder = '请输入学号或邮箱'
    loginFields.value[0].hint = '普通用户：学号或邮箱'
  }
}

async function handleLogin(values: Record<string, string>) {
  isSubmitting.value = true
  try {
    const data = await login({
      role: roleTab.value,
      account: values.account,
      password: values.password,
    })
    auth.setAuth(data.token, data.user_id)
    // 根据角色设置 localStorage 的 role 字段
    localStorage.setItem('role', roleTab.value)
    await userStore.fetchProfile()
    toast.success('登录成功')

    // 根据角色跳转到不同页面
    if (roleTab.value === 'organizer') {
      router.push('/organizer/activities')
    } else if (roleTab.value === 'admin') {
      router.push('/admin/audit')
    } else {
      router.push((route.query.redirect as string) || '/activities')
    }
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
            @click="() => { roleTab = tab.value; updateFieldHint() }"
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

        <div class="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
          <RouterLink to="/register" class="text-blue-600 hover:underline">普通用户注册</RouterLink>
          <RouterLink to="/organizer/register" class="text-blue-600 hover:underline">组织者注册</RouterLink>
          <span class="text-xs">管理员账号由超级管理员分配，请联系管理员获取</span>
        </div>
      </AppCard>
    </div>

    <p class="pb-6 text-center text-xs text-white/80">技术支持：前端a</p>
  </AppPageContainer>
</template>