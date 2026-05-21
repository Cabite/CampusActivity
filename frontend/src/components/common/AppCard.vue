<!-- AppCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/utils'

interface Props {
  // 卡片变体
  variant?: 'default' | 'outline' | 'color' | 'color-bg'
  
  // 颜色变体（当 variant="color" 或 "color-bg" 时使用）
  color?: string // 支持 rgb(59,130,246) 或 #3b82f6 等格式
  
  // 圆角大小
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  
  // 内边距大小
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  
  // 是否显示边框
  border?: boolean
  
  // 是否可点击（包含悬停效果）
  clickable?: boolean
  
  // 加载状态
  loading?: boolean
  
  // 头部区域（可选）
  title?: string
  description?: string
  
  // 自定义类名
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  rounded: '2xl',
  padding: 'md',
  border: false,
  clickable: false,
  loading: false,
  color: 'rgb(99, 102, 241)' // 默认主色
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// 圆角类映射
const roundedClass = computed(() => {
  const map = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl'
  }
  return map[props.rounded]
})

// 内边距类映射
const paddingClass = computed(() => {
  const map = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  return map[props.padding]
})

// 变体样式
const variantClass = computed(() => {
  const map = {
    default: 'bg-card shadow-md',
    outline: 'bg-transparent border-2 border-border',
    color: 'bg-card shadow-md', // 左边框颜色变体
    'color-bg': 'shadow-md' // 背景色变体，背景色通过内联样式设置
  }
  return map[props.variant]
})

// 背景色样式
const bgColorStyle = computed(() => {
  if (props.variant !== 'color-bg') return {}
  
  // 解析颜色值，提取 RGB 值用于生成半透明效果
  let bgColor = props.color
  let rgbValues = ''
  
  // 处理不同的颜色格式
  if (props.color.startsWith('rgb')) {
    rgbValues = props.color.match(/\d+/g)?.slice(0, 3).join(',') || ''
  } else if (props.color.startsWith('#')) {
    // 转换 hex 到 rgb
    const hex = props.color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    rgbValues = `${r},${g},${b}`
  } else {
    // 尝试匹配颜色名称或其他格式，默认使用颜色值
    rgbValues = props.color
  }
  
  return {
    backgroundColor: props.color,
    // 添加半透明白色叠加层，让文字更清晰（可选）
    // 如果需要更柔和的背景，可以使用以下方式：
    // backgroundColor: `rgba(${rgbValues}, 0.1)`,
    // borderLeft: `4px solid ${props.color}`
  }
})

// 左边框样式
const colorBorderStyle = computed(() => {
  if (props.variant !== 'color') return {}
  return {
    borderLeft: `4px solid ${props.color}`,
    borderLeftColor: props.color
  }
})

// 文字颜色样式（当背景色较深时，自动使用白色文字）
const textColorStyle = computed(() => {
  if (props.variant !== 'color-bg') return {}
  if(!props.color) return{}
  
  // 简单的亮度计算，决定文字颜色
  const getBrightness = (color: string) => {
    let r = 0, g = 0, b = 0
    
    if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g)
      if (matches && matches.length >= 3) {
        r = parseInt(matches[0] ?? '0')
        g = parseInt(matches[1] ?? '0')
        b = parseInt(matches[2] ?? '0')
      }
    } else if (color.startsWith('#')) {
      const hex = color.slice(1)
      r = parseInt(hex.slice(0, 2), 16)
      g = parseInt(hex.slice(2, 4), 16)
      b = parseInt(hex.slice(4, 6), 16)
    } else {
      return {} // 无法解析，使用默认颜色
    }
    
    // 计算亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? { color: '#1a1a1a' } : { color: '#ffffff' }
  }
  
  return getBrightness(props.color)
})

// 卡片主类
const cardClass = computed(() => {
  return cn(
    'relative',
    'transition-all duration-200',
    roundedClass.value,
    variantClass.value,
    {
      'border': props.border && props.variant !== 'outline' && props.variant !== 'color-bg',
      'border-border': props.border && props.variant !== 'outline' && props.variant !== 'color-bg',
      'border-none': !props.border && props.variant !== 'outline',
      // clickable 同时控制悬浮和点击效果
      'cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-98': props.clickable,
    },
    props.class
  )
})

// 内容加载状态
const contentClass = computed(() => {
  return cn(
    paddingClass.value,
    {
      'opacity-50 pointer-events-none': props.loading
    }
  )
})

// 处理点击
const handleClick = (event: MouseEvent) => {
  if (props.clickable && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <Card 
    :class="cardClass"
    :style="[colorBorderStyle, bgColorStyle, textColorStyle]"
    @click="handleClick"
  >
    <!-- 加载遮罩 -->
    <div 
      v-if="loading" 
      class="absolute inset-0 flex items-center justify-center bg-background/50 z-10"
      :class="roundedClass"
    >
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>

    <!-- 头部（如果提供了 title 或 description） -->
    <CardHeader v-if="title || description" :class="paddingClass">
      <CardTitle v-if="title" class="text-xl font-semibold">
        {{ title }}
      </CardTitle>
      <CardDescription v-if="description" class="text-sm text-muted-foreground">
        {{ description }}
      </CardDescription>
    </CardHeader>

    <!-- 主要内容 -->
    <CardContent :class="contentClass">
      <slot />
    </CardContent>

    <!-- 底部插槽 -->
    <CardFooter v-if="$slots.footer" :class="paddingClass">
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>