<script setup lang="ts">
import Dialog from './Dialog.vue'
import Button from './Button.vue'

defineProps<{
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
  loading?: boolean
}>()

defineEmits<{ close: []; confirm: [] }>()
</script>

<template>
  <Dialog :open="open" :title="title" @close="$emit('close')">
    <p class="text-sm text-muted-foreground">{{ message }}</p>
    <template #footer>
      <Button variant="outline" :disabled="loading" @click="$emit('close')">
        {{ cancelText ?? '取消' }}
      </Button>
      <Button :variant="destructive ? 'destructive' : 'default'" :loading="loading" @click="$emit('confirm')">
        {{ confirmText ?? '确认' }}
      </Button>
    </template>
  </Dialog>
</template>
