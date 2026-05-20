<script setup lang="ts">
defineProps<{
  modelValue: string
  options: { value: string; label: string }[]
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="proto-segment">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      :class="['proto-segment-item', modelValue === opt.value && 'active']"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
