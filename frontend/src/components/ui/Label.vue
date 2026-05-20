<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{ required?: boolean }>()
</script>

<template>
  <label :class="cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70')">
    <slot />
    <span v-if="required" class="text-destructive">*</span>
  </label>
</template>
