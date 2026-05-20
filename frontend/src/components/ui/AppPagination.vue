<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  page: number
  total: number
  pageSize: number
}>()

const emit = defineEmits<{ 'update:page': [page: number] }>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const pages = computed(() => {
  const max = Math.min(9, totalPages.value)
  return Array.from({ length: max }, (_, i) => i + 1)
})
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 py-4">
    <button
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded border bg-white text-gray-600 hover:border-[var(--proto-blue)] disabled:opacity-40"
      :disabled="page <= 1"
      @click="emit('update:page', page - 1)"
    >
      <ChevronLeft class="h-4 w-4" />
    </button>
    <button
      v-for="p in pages"
      :key="p"
      type="button"
      :class="[
        'flex h-8 w-8 items-center justify-center rounded text-sm',
        p === page
          ? 'bg-[var(--proto-blue)] text-white'
          : 'border bg-white text-gray-600 hover:border-[var(--proto-blue)]',
      ]"
      @click="emit('update:page', p)"
    >
      {{ p }}
    </button>
    <button
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded border bg-white text-gray-600 hover:border-[var(--proto-blue)] disabled:opacity-40"
      :disabled="page >= totalPages"
      @click="emit('update:page', page + 1)"
    >
      <ChevronRight class="h-4 w-4" />
    </button>
  </div>
</template>
