<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <header class="flex h-12 shrink-0 items-center border-b bg-white px-6">
    <h1 class="text-base font-medium text-gray-800">{{ title }}</h1>
  </header>
</template>
