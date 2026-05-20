<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <AppNavbar :brand-name="'CampusActivity'" :nav-items="navItems" />
    <AppPageContainer class="px-6 py-8">
      <div class="flex justify-between items-center mb-6"><h1 class="text-3xl font-bold text-white">我的活动</h1><AppButton @click="createActivity">+ 创建活动</AppButton></div>
      <div class="space-y-4">
        <AppCard v-for="act in activities" :key="act.id">
          <div class="flex flex-col sm:flex-row justify-between gap-4">
            <div><h3 class="text-xl font-semibold">{{ act.title }}</h3><p class="text-gray-500 text-sm">{{ act.startTime }} · {{ act.location }}</p><div class="flex gap-3 mt-2"><span class="text-sm">报名 {{ act.current }}/{{ act.max }}</span><span :class="act.status === '报名中' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'" class="text-xs px-2 py-1 rounded-full">{{ act.status }}</span></div></div>
            <div class="flex gap-2"><AppButton size="sm" variant="outline" @click="viewRegistrations(act.id)">报名列表</AppButton><AppButton size="sm" variant="outline" @click="viewSignRecords(act.id)">签到记录</AppButton><AppButton size="sm" @click="editActivity(act.id)">编辑</AppButton><AppButton size="sm" variant="destructive" @click="deleteActivity(act.id)">删除</AppButton></div>
          </div>
        </AppCard>
        <div v-if="activities.length === 0" class="text-center py-8 text-slate-500 bg-white rounded-xl">暂无活动</div>
      </div>
    </AppPageContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AppButton, AppCard, AppNavbar, AppPageContainer } from '@/components/common'

const navItems = [{ label: '首页', href: '/' }, { label: '关于', href: '/about' }, { label: '联系', href: '/contact' }]
const activities = ref([{ id: 1, title: '校园歌手大赛', startTime: '2026-06-10 18:00', location: '报告厅', current: 45, max: 100, status: '报名中' }, { id: 2, title: '编程马拉松', startTime: '2026-06-15 14:00', location: '机房', current: 30, max: 50, status: '报名中' }])
const createActivity = () => console.log('创建')
const viewRegistrations = (id) => console.log('报名列表', id)
const viewSignRecords = (id) => console.log('签到记录', id)
const editActivity = (id) => console.log('编辑', id)
const deleteActivity = (id) => console.log('删除', id)
</script>