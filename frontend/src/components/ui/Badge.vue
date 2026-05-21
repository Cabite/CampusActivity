<script setup lang="ts">
import { cn } from '@/utils'

defineProps<{ variant?: 'default' | 'secondary' | 'outline' }>()
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-primary/10 text-primary',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground',
        variant === 'outline' && 'border text-foreground',
      )
    "
  >
    <slot />
  </span>
</template>
