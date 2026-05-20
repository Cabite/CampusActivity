<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <AppNavbar :brand-name="'CampusActivity'" :nav-items="navItems" />
    <AppPageContainer class="px-6 py-8 flex justify-center">
      <div class="max-w-2xl w-full"><AppCard><h1 class="text-2xl font-bold mb-6">{{ isEdit ? '编辑活动' : '创建活动' }}</h1><form @submit.prevent="submit"><div class="space-y-4">
        <div><label class="block text-sm font-medium mb-1">活动标题</label><input v-model="form.title" required class="w-full border rounded-lg p-2" /></div>
        <div><label class="block text-sm font-medium mb-1">分类</label><select v-model="form.category" class="w-full border rounded-lg p-2"><option>学术类</option><option>文体类</option><option>志愿服务类</option></select></div>
        <div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">开始时间</label><input type="datetime-local" v-model="form.startTime" required class="w-full border rounded-lg p-2" /></div><div><label class="block text-sm font-medium mb-1">结束时间</label><input type="datetime-local" v-model="form.endTime" required class="w-full border rounded-lg p-2" /></div></div>
        <div><label class="block text-sm font-medium mb-1">地点</label><input v-model="form.location" required class="w-full border rounded-lg p-2" /></div>
        <div><label class="block text-sm font-medium mb-1">人数上限</label><input type="number" v-model="form.maxParticipants" min="1" required class="w-full border rounded-lg p-2" /></div>
        <div><label class="block text-sm font-medium mb-1">活动简介</label><textarea v-model="form.description" rows="4" class="w-full border rounded-lg p-2"></textarea></div>
        <div class="flex justify-end gap-2"><AppButton type="button" variant="outline" @click="cancel">取消</AppButton><AppButton type="submit">提交</AppButton></div>
      </div></form></AppCard></div>
    </AppPageContainer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { AppButton, AppCard, AppNavbar, AppPageContainer } from '@/components/common'

const navItems = [{ label: '首页', href: '/' }, { label: '关于', href: '/about' }, { label: '联系', href: '/contact' }]
const isEdit = ref(false)
const form = reactive({ title: '', category: '学术类', startTime: '', endTime: '', location: '', maxParticipants: 1, description: '' })
const submit = () => console.log('提交', form)
const cancel = () => console.log('取消')
</script>