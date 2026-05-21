<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { cn } from '@/utils'

const { toasts } = useToast()
</script>

<template>
  <div class="fixed right-4 top-4 z-[100] flex flex-col gap-2">
    <div
      v-for="t in toasts"
      :key="t.id"
      :class="
        cn(
          'min-w-[240px] rounded-md px-4 py-3 text-sm text-white shadow-lg',
          t.type === 'success' && 'bg-emerald-600',
          t.type === 'error' && 'bg-destructive',
          t.type === 'info' && 'bg-primary',
        )
      "
    >
      {{ t.message }}
    </div>
  </div>
</template>
