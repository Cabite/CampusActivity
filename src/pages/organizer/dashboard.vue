<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <AppNavbar :brand-name="'CampusActivity'" :nav-items="navItems" />
    <AppPageContainer class="px-6 py-8">
      <h1 class="text-3xl font-bold text-white mb-6">发布者工作台</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AppCard class="text-center"><div class="text-3xl font-bold text-blue-600">{{ stats.totalActivities }}</div><div class="text-gray-500">我的活动</div></AppCard>
        <AppCard class="text-center"><div class="text-3xl font-bold text-blue-600">{{ stats.totalRegistrations }}</div><div class="text-gray-500">累计报名人次</div></AppCard>
        <AppCard class="text-center"><div class="text-3xl font-bold text-blue-600">{{ stats.ongoingActivities }}</div><div class="text-gray-500">进行中的活动</div></AppCard>
      </div>
      <AppCard><div class="flex justify-between items-center mb-4"><h2 class="text-xl font-semibold">最近活动</h2><AppButton variant="link" size="sm" @click="viewAll">查看全部</AppButton></div>
        <div v-if="recentActivities.length === 0" class="text-center py-4 text-slate-400">暂无活动</div>
        <div v-else><div v-for="act in recentActivities" :key="act.id" class="flex justify-between items-center border-b pb-2 mb-2"><div><div class="font-medium">{{ act.title }}</div><div class="text-sm text-gray-500">{{ act.startTime }} · {{ act.location }}</div></div><div class="flex gap-2"><AppButton size="sm" variant="outline" @click="viewRegistrations(act.id)">报名列表</AppButton><AppButton size="sm" variant="outline" @click="viewSignRecords(act.id)">签到记录</AppButton></div></div></div>
      </AppCard>
      <div class="mt-6 text-center"><AppButton @click="createActivity">+ 创建新活动</AppButton></div>
    </AppPageContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AppButton, AppCard, AppNavbar, AppPageContainer } from '@/components/common'

const navItems = [{ label: '首页', href: '/' }, { label: '关于', href: '/about' }, { label: '联系', href: '/contact' }]
const stats = ref({ totalActivities: 5, totalRegistrations: 89, ongoingActivities: 2 })
const recentActivities = ref([{ id: 1, title: '校园歌手大赛', startTime: '2026-06-10 18:00', location: '报告厅' }, { id: 2, title: '编程马拉松', startTime: '2026-06-15 14:00', location: '机房' }])
const viewAll = () => console.log('查看全部')
const viewRegistrations = (id) => console.log('报名列表', id)
const viewSignRecords = (id) => console.log('签到记录', id)
const createActivity = () => console.log('创建活动')
</script>