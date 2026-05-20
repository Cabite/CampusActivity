<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <AppNavbar :brand-name="'CampusActivity'" :nav-items="navItems" />
    <AppPageContainer class="px-6 py-8">
      <div class="flex items-center gap-4 mb-6"><AppButton variant="outline" size="sm" @click="goBack">← 返回</AppButton><h1 class="text-3xl font-bold text-white">报名管理</h1></div>
      <AppCard><h2 class="text-xl font-semibold mb-4">活动：{{ activityTitle }}</h2>
        <div v-if="registrations.length === 0" class="text-center py-4 text-slate-400">暂无报名</div>
        <div v-else><div v-for="reg in registrations" :key="reg.id" class="flex justify-between items-center border-b pb-2 mb-2"><div><div class="font-medium">{{ reg.userName }}</div><div class="text-sm text-gray-500">报名时间：{{ reg.time }}</div></div><AppButton v-if="reg.status === 'registered'" size="sm" variant="destructive" @click="reject(reg.id)">拒绝</AppButton><span v-else class="text-red-500 text-sm">已拒绝</span></div></div>
      </AppCard>
    </AppPageContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AppButton, AppCard, AppNavbar, AppPageContainer } from '@/components/common'

const navItems = [{ label: '首页', href: '/' }, { label: '关于', href: '/about' }, { label: '联系', href: '/contact' }]
const activityTitle = ref('校园歌手大赛')
const registrations = ref([{ id: 1, userName: '张三', time: '2026-05-20 09:00', status: 'registered' }, { id: 2, userName: '李四', time: '2026-05-21 10:00', status: 'registered' }])
const reject = (id) => { const reg = registrations.value.find(r => r.id === id); if(reg) reg.status = 'rejected'; console.log('拒绝报名', id) }
const goBack = () => console.log('返回')
</script>