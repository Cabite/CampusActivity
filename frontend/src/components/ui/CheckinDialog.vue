<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{ open: boolean; loading?: boolean }>()
const emit = defineEmits<{ close: []; confirm: [code: string] }>()

const code = ref('')

watch(
  () => props.open,
  (v) => {
    if (!v) code.value = ''
  },
)

function handleConfirm() {
  emit('confirm', code.value)
}

function handleClose() {
  code.value = ''
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        <div class="flex items-center justify-between bg-[var(--proto-blue)] px-5 py-3 text-white">
          <h3 class="font-medium">签到</h3>
          <button type="button" @click="handleClose"><X class="h-5 w-5" /></button>
        </div>
        <div class="p-6">
          <input
            v-model="code"
            type="text"
            placeholder="请输入签到码"
            maxlength="6"
            class="w-full rounded border border-gray-300 px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-[var(--proto-blue)]"
          />
        </div>
        <div class="flex justify-center gap-4 border-t px-6 py-4">
          <button type="button" class="proto-btn-primary min-w-[100px]" :disabled="loading" @click="handleConfirm">
            {{ loading ? '提交中...' : '确认' }}
          </button>
          <button
            type="button"
            class="min-w-[100px] rounded-md border border-gray-300 px-6 py-2 text-sm"
            @click="handleClose"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
