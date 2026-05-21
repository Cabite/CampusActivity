<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Sidebar from '@/layouts/Sidebar.vue'

const route = useRoute()

const pageTitle = computed(() => (route.meta.title as string) || '校园活动')
</script>

<template>
  <div class="flex min-h-screen">
    <Sidebar />

    <div class="flex min-w-0 flex-1 flex-col">
      <!-- 页面顶栏：仅占主内容区，不遮挡侧边栏 -->
      <header class="flex h-12 shrink-0 items-center border-b bg-white px-6">
        <h1 class="text-base font-medium text-foreground">{{ pageTitle }}</h1>
      </header>

      <!-- 与登录页一致的蓝色网格背景 -->
      <main class="proto-grid-bg flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
