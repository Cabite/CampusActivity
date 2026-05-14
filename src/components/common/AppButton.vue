<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import type { ButtonVariants } from '@/components/ui/button'

interface Props {
  // shadcn 原生属性
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  as?: string
  asChild?: boolean
  
  // 扩展属性
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon?: typeof Loader2
  iconPosition?: 'left' | 'right'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  loading: false,
  disabled: false,
  fullWidth: false,
  iconPosition: 'left',
  rounded: '2xl'
})

// 动态圆角类
const roundedClass = computed(() => {
  const map = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  }
  return map[props.rounded]
})

// 完整宽度类
const widthClass = computed(() => props.fullWidth ? 'w-full' : '')

// 带图标时的内边距调整（可选）
const paddingClass = computed(() => {
  if (props.icon && props.size === 'default') {
    return 'px-4'
  }
  return ''
})
</script>

<template>
  <Button
    :variant="variant"
    :size="size"
    :disabled="disabled || loading"
    :as="as"
    :as-child="asChild"
    :class="[
      roundedClass,
      widthClass,
      paddingClass,
      'font-medium transition-all duration-200',
      'active:scale-95', // 点击微缩放效果
      {
        'cursor-not-allowed opacity-50': loading,
        'shadow-lg': variant === 'default' && !disabled && !loading,
      }
    ]"
  >
    <!-- 左侧图标（加载中或自定义图标） -->
    <Loader2
      v-if="loading"
      class="mr-2 h-4 w-4 animate-spin"
    />
    
    <component
      :is="icon"
      v-else-if="icon && iconPosition === 'left'"
      class="mr-2 h-4 w-4"
    />

    <!-- 按钮内容 -->
    <slot />

    <!-- 右侧图标 -->
    <component
      :is="icon"
      v-if="icon && iconPosition === 'right' && !loading"
      class="ml-2 h-4 w-4"
    />
  </Button>
</template>