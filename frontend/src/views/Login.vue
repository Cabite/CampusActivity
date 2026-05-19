<script setup lang="ts">
import { AppButton, AppCard, AppPageContainer, AppForm } from '@/components'
import Topbar from '@/layouts/Topbar.vue'
import router from '@/router'

import { ref } from 'vue'
import { login, register } from '@/api/auth'
import { User, Lock, Mail, Phone } from '@lucide/vue'
import type { FormField } from '@/components/layout/AppForm.vue'

// 当前模式：login | signup
const mode = ref<'login' | 'signup'>('login')

// 登录表单字段配置
const loginFields: FormField[] = [
  { 
    name: 'username', 
    label: '用户名', 
    placeholder: '请输入用户名', 
    required: true,
    leftIcon: User,
    hint: '测试账号：admin'
  },
  { 
    name: 'password', 
    label: '密码', 
    type: 'password', 
    placeholder: '请输入密码', 
    required: true,
    leftIcon: Lock,
    hint: '测试密码：123456'
  }
]

// 注册表单字段配置
const signupFields: FormField[] = [
  { 
    name: 'username', 
    label: '用户名', 
    placeholder: '请输入用户名', 
    required: true,
    leftIcon: User,
    hint: '2-20个字符，支持字母、数字',
    rules: [
      (val: string) => (val && val.length >= 2) || '至少2个字符',
      (val: string) => (val && val.length <= 20) || '最多20个字符'
    ]
  },
  {
    name: 'email', 
    label: '邮箱', 
    type: 'email', 
    placeholder: '请输入邮箱', 
    required: true,
    leftIcon: Mail,
    hint: '用于接收通知和找回密码'
  },
  { 
    name: 'phone', 
    label: '手机号', 
    type: 'tel', 
    placeholder: '请输入手机号', 
    leftIcon: Phone,
    hint: '选填，用于安全验证'
  },
  { 
    name: 'password', 
    label: '密码', 
    type: 'password', 
    placeholder: '请输入密码', 
    required: true,
    leftIcon: Lock,
    hint: '至少6个字符',
    rules: [
      (val: string) => (val && val.length >= 6) || '密码至少6个字符'
    ]
  },
  { 
    name: 'confirmPassword', 
    label: '确认密码', 
    type: 'password', 
    placeholder: '请再次输入密码', 
    required: true,
    leftIcon: Lock,
    rules: [
      (val: string, formData: any) => (val === formData?.password) || '两次输入的密码不一致'
    ]
  }
]

// 表单提交中状态
const isSubmitting = ref(false)

// 处理登录
const handleLogin = async (values: any) => {
  console.log('登录:', values)
  isSubmitting.value = true
  
  try {
    const res = await login({
      username: values.username,
      password: values.password
    })

    console.log(res)

    if (res.data.code === 200) {
      localStorage.setItem('token', res.data.data.token)
      alert('登录成功')
      router.push('/dashboard')
    } else {
      alert(res.data.message || '登录失败')
    }
  } catch (error) {
    console.error('登录错误:', error)
    alert('登录失败，请检查网络连接')
  } finally {
    isSubmitting.value = false
  }
}

// 处理注册
const handleSignup = async (values: any) => {
  console.log('注册:', values)
  isSubmitting.value = true
  
  try {
    // 移除确认密码字段，只提交需要的字段
    const { confirmPassword, ...signupData } = values
    
    const res = await register(signupData)

    console.log(res)

    if (res.data.code === 200) {
      alert('注册成功！请登录')
      // 切换到登录模式
      mode.value = 'login'
    } else {
      alert(res.data.message || '注册失败')
    }
  } catch (error) {
    console.error('注册错误:', error)
    alert('注册失败，请检查网络连接')
  } finally {
    isSubmitting.value = false
  }
}

// 切换模式
const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
}

// 跳转到组件展示页
const goToComponentsDisplay = () => {
  router.push('Components')
}
</script>

<template>
  <AppPageContainer variant="gradient" :show-grid="true" :show-glow="true">
    <Topbar />
    
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <AppCard 
        variant="default"
        rounded="2xl"
        class="w-full max-w-md mx-4"
      >
        <!-- 标题区域 -->
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold mb-2">
            {{ mode === 'login' ? '欢迎回来' : '创建账号' }}
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ mode === 'login' ? '请登录以继续使用 CampusActivity' : '注册成为 CampusActivity 的一员' }}
          </p>
        </div>

        <!-- 登录表单 -->
        <AppForm
          v-if="mode === 'login'"
          :fields="loginFields"
          submit-text="登录"
          submit-variant="blue"
          :loading="isSubmitting"
          @submit="handleLogin"
        />
      
        <!-- 注册表单 -->
        <AppForm
          v-else
          :fields="signupFields"
          submit-text="注册"
          submit-variant="blue"
          :loading="isSubmitting"
          @submit="handleSignup"
        />

        <!-- 底部操作区域 -->
        <div class="mt-6 space-y-3">
          <div class="text-center text-sm">
            <span class="text-muted-foreground">
              {{ mode === 'login' ? '还没有账号？' : '已有账号？' }}
            </span>
            <AppButton
              variant="link"
              size="sm"
              class="ml-1"
              @click="toggleMode"
            >
              {{ mode === 'login' ? '立即注册' : '去登录' }}
            </AppButton>
          </div>

          <!-- 测试账号提示（仅登录模式显示） -->
          <div v-if="mode === 'login'" class="text-center text-xs text-muted-foreground">
            <p>测试账号：admin / 123456</p>
          </div>

          <!-- 分隔线 -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-card text-muted-foreground">其他功能</span>
            </div>
          </div>

          <!-- 其他按钮 -->
          <AppButton
            variant="outline"
            full-width
            @click="goToComponentsDisplay"
          >
            查看组件展示
          </AppButton>
        </div>
      </AppCard>
    </div>
  </AppPageContainer>
</template>