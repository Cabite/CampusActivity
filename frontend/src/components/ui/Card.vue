<script setup lang="ts">
import { cn } from '@/utils'

defineProps<{ class?: string; clickable?: boolean }>()
</script>

<template>
  <div
    :class="
      cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        clickable && 'cursor-pointer transition-shadow hover:shadow-md',
        $props.class,
      )
    "
  >
    <slot />
  </div>
</template>
