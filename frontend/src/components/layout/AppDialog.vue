<!-- AppDialog.vue -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/utils'
import AppButton from '../common/AppButton.vue'

interface Props {
  open?: boolean
  defaultOpen?: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  showConfirm?: boolean
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' | 'blue'
  cancelVariant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' | 'blue'
  confirmLoading?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  centered?: boolean
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  class?: string
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: undefined,
  defaultOpen: false,
  title: '',
  description: '',
  confirmText: '确认',
  cancelText: '取消',
  showCancel: true,
  showConfirm: true,
  confirmVariant: 'default',
  cancelVariant: 'outline',
  confirmLoading: false,
  size: 'md',
  centered: false,
  closeOnClickOutside: true,
  closeOnEscape: true,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
  'cancel': []
  'close': []
}>()

const internalOpen = ref(props.defaultOpen)

const actualOpen = computed({
  get: () => (props.open !== undefined ? props.open : internalOpen.value),
  set: (value: boolean) => {
    if (props.open !== undefined) {
      emit('update:open', value)
    } else {
      internalOpen.value = value
    }
    if (!value) {
      emit('close')
    }
  },
})

const sizeClass = computed(() => {
  const map = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
    full: 'sm:max-w-[90vw] sm:max-h-[90vh]',
  }
  return map[props.size]
})

const positionClass = computed(() => {
  return props.centered ? 'sm:my-auto' : ''
})

const handleConfirm = () => {
  emit('confirm')
  if (props.open === undefined && !props.confirmLoading) {
    actualOpen.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
  if (props.open === undefined) {
    actualOpen.value = false
  }
}

const handleClose = () => {
  if (props.closeOnClickOutside) {
    actualOpen.value = false
  }
}

watch(
  () => actualOpen.value,
  () => {
    // 弹窗关闭时的额外处理
  },
)

const onEscape = () => {
  if (props.closeOnEscape && actualOpen.value) {
    actualOpen.value = false
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') onEscape()
  })
}
</script>

<template>
  <Dialog v-model:open="actualOpen" :modal="true">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogContent
      :class="cn(
        'p-0 gap-0 overflow-hidden',
        sizeClass,
        positionClass,
        contentClass,
      )"
      :close-on-click-outside="closeOnClickOutside"
      :close-on-escape="closeOnEscape"
      @close="handleClose"
    >
      <!-- 始终提供一个隐藏的描述以满足无障碍要求（如果没有显式描述） -->
      <DialogDescription v-if="!description && !$slots.header" class="sr-only">
        {{ title || '对话框' }}
      </DialogDescription>

      <!-- 头部 -->
      <div
        v-if="title || description || $slots.header"
        class="border-b border-border p-6 pb-4"
      >
        <DialogHeader>
          <DialogTitle v-if="title" class="text-xl font-semibold">
            {{ title }}
          </DialogTitle>
          <DialogDescription v-if="description" class="mt-1 text-sm text-muted-foreground">
            {{ description }}
          </DialogDescription>
          <slot v-else-if="$slots.header" name="header" />
        </DialogHeader>
      </div>

      <!-- 内容区域 -->
      <div class="p-6">
        <slot />
      </div>

      <!-- 底部按钮 -->
      <div
        v-if="showConfirm || showCancel || $slots.footer"
        class="border-t border-border p-6 pt-4"
      >
        <DialogFooter>
          <div v-if="$slots.footer">
            <slot name="footer" />
          </div>
          <div
            v-else
            class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
          >
            <AppButton
              v-if="showCancel"
              :variant="cancelVariant"
              size="sm"
              @click="handleCancel"
            >
              {{ cancelText }}
            </AppButton>
            <AppButton
              v-if="showConfirm"
              :variant="confirmVariant"
              size="sm"
              :loading="confirmLoading"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </AppButton>
          </div>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>