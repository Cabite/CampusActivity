<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <AppNavbar :brand-name="'CampusActivity'" :nav-items="navItems" />
    <AppPageContainer class="px-6 py-8">
      <h1 class="text-3xl font-bold text-white mb-6">活动数据统计</h1>
      <AppCard><div class="mb-4"><label class="mr-2">选择活动：</label><select v-model="selectedActivity" class="border rounded p-1"><option v-for="act in activities" :key="act.id" :value="act.id">{{ act.title }}</option></select></div>
        <div class="grid grid-cols-2 gap-4 mb-6"><div class="text-center p-4 bg-gray-50 rounded"><div class="text-2xl font-bold text-blue-600">{{ currentStats.registrationCount }}</div><div>报名人数</div></div><div class="text-center p-4 bg-gray-50 rounded"><div class="text-2xl font-bold text-blue-600">{{ currentStats.signCount }}</div><div>签到人数</div></div></div>
        <div class="h-40 bg-gray-100 rounded flex items-end gap-2 p-2"><div v-for="(val,idx) in trend" :key="idx" class="flex-1 bg-blue-400 rounded-t" :style="{ height: `${val*2}px` }"></div></div><div class="text-center text-sm text-gray-500 mt-2">报名趋势（近7天）</div>
      </AppCard>
    </AppPageContainer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { AppCard, AppNavbar, AppPageContainer } from '@/components/common'

const navItems = [{ label: '首页', href: '/' }, { label: '关于', href: '/about' }, { label: '联系', href: '/contact' }]
const activities = ref([{ id: 1, title: '校园歌手大赛' }, { id: 2, title: '编程马拉松' }])
const selectedActivity = ref(1)
const statsMap = { 1: { registrationCount: 45, signCount: 30 }, 2: { registrationCount: 30, signCount: 25 } }
const currentStats = computed(() => statsMap[selectedActivity.value] || { registrationCount: 0, signCount: 0 })
const trend = ref([12,19,15,22,28,35,42])
</script>