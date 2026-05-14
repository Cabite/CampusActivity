<script setup lang="ts">
import { AppButton } from '@/components/common'

import { ref } from 'vue'
import { Github, Settings, ArrowRight, Save } from 'lucide-vue-next'

const isSubmitting = ref(false)
const saving = ref(false)

const someAsyncTask = () => {
  return new Promise(resolve => setTimeout(resolve, 3000))
}

const handleSubmit = async () => {
  isSubmitting.value = true
  await someAsyncTask()
  isSubmitting.value = false
}
</script>


<template>
  <!-- 按钮 -->
  <p>AppButton Display</p>
   
  <!-- 1. 基础用法 -->
  <AppButton>登录</AppButton>

  <!-- 2. Loading 状态 -->
  <AppButton :loading="isSubmitting">
    登录
  </AppButton>

  <!-- 3. 不同变体 -->
  <AppButton variant="destructive">删除</AppButton>
  <AppButton variant="outline">取消</AppButton>
  <AppButton variant="ghost">更多</AppButton>
  <AppButton variant="secondary">草稿</AppButton>

  <!-- 4. 不同尺寸 -->
  <AppButton size="sm">小按钮</AppButton>
  <AppButton size="lg">大按钮</AppButton>
  <AppButton size="icon">
    <Settings class="h-4 w-4" />
  </AppButton>

  <!-- 5. 完整宽度 -->
  <AppButton fullWidth>提交订单</AppButton>

  <!-- 6. 带图标 -->
  <AppButton :icon="Github">
    使用 GitHub 登录
  </AppButton>

  <AppButton 
    icon="ArrowRight" 
    icon-position="right"
  >
    下一步
  </AppButton>

  <!-- 7. 不同圆角 -->
  <AppButton rounded="none">方角按钮</AppButton>
  <AppButton rounded="full">圆形按钮</AppButton>

  <!-- 8. 组合使用 -->
  <AppButton
    variant="default"
    size="lg"
    :loading="saving"
    fullWidth
    rounded="full"
    icon="Save"
  >
    {{ saving ? '保存中...' : '保存文档' }}
  </AppButton>
</template>
