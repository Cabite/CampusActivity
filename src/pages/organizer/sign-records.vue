<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <AppNavbar :brand-name="'CampusActivity'" :nav-items="navItems" />
    <AppPageContainer class="px-6 py-8">
      <div class="flex items-center gap-4 mb-6"><AppButton variant="outline" size="sm" @click="goBack">← 返回</AppButton><h1 class="text-3xl font-bold text-white">签到记录</h1></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2"><AppCard><h2 class="text-xl font-semibold mb-4">已签到用户</h2><div v-if="signRecords.length === 0" class="text-center py-4 text-slate-400">暂无签到记录</div><div v-else><div v-for="sig in signRecords" :key="sig.id" class="flex justify-between border-b pb-2 mb-2"><span>{{ sig.userName }}</span><span class="text-sm text-gray-500">{{ sig.time }}</span></div></div></AppCard></div>
        <div class="space-y-6"><AppCard class="text-center"><h3 class="font-semibold mb-2">生成签到二维码</h3><AppButton @click="generateQR">生成</AppButton><div v-if="qrUrl" class="mt-4"><img :src="qrUrl" class="mx-auto w-32 h-32" /></div></AppCard><AppCard><h3 class="font-semibold mb-2">手动签到</h3><input v-model="manualUserId" placeholder="学号/用户名" class="w-full border rounded p-2 mb-2" /><AppButton class="w-full" @click="manualSign">手动签到</AppButton></AppCard></div>
      </div>
    </AppPageContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AppButton, AppCard, AppNavbar, AppPageContainer } from '@/components/common'

const navItems = [{ label: '首页', href: '/' }, { label: '关于', href: '/about' }, { label: '联系', href: '/contact' }]
const signRecords = ref([{ id: 1, userName: '张三', time: '2026-06-10 18:30' }])
const qrUrl = ref(''), manualUserId = ref('')
const generateQR = () => { qrUrl.value = 'https://via.placeholder.com/150?text=QRCODE' }
const manualSign = () => { if(manualUserId.value) { signRecords.value.push({ id: Date.now(), userName: manualUserId.value, time: new Date().toLocaleString() }); manualUserId.value = '' } }
const goBack = () => console.log('返回')
</script>