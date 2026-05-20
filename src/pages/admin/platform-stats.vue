<template>
  <div class="min-h-screen" style="background-color: #2563EB;">
    <AppNavbar :brand-name="'CampusActivity'" :nav-items="navItems" />

    <AppPageContainer class="px-6 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-2 text-white/60 text-sm mb-2">
          <span>数据统计</span>
          <iconify-icon class="text-[10px]" icon="ph:caret-right-bold"></iconify-icon>
          <span class="text-white/90">平台分析</span>
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">平台统计</h1>
      </div>

      <!-- 顶部统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AppCard class="text-center">
          <div class="text-3xl font-bold text-blue-600">{{ stats.totalActivities }}</div>
          <div class="text-gray-500">总活动数</div>
        </AppCard>
        <AppCard class="text-center">
          <div class="text-3xl font-bold text-blue-600">{{ stats.totalUsers }}</div>
          <div class="text-gray-500">总用户数</div>
        </AppCard>
        <AppCard class="text-center">
          <div class="text-3xl font-bold text-blue-600">{{ stats.totalRegistrations }}</div>
          <div class="text-gray-500">总报名人次</div>
        </AppCard>
      </div>

      <!-- 活动趋势图表（模拟柱状图） -->
      <AppCard class="mb-8">
        <h2 class="text-xl font-bold mb-4">活动发布趋势（近7天）</h2>
        <div class="flex items-end gap-2 h-40">
          <div
            v-for="(val, idx) in trend"
            :key="idx"
            class="flex-1 bg-blue-200 rounded-t"
            :style="{ height: `${val * 2}px` }"
          >
            <div class="text-center text-xs mt-1">{{ val }}</div>
          </div>
        </div>
        <div class="flex justify-between text-xs text-slate-400 mt-2">
          <span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span>
        </div>
      </AppCard>

      <!-- 报名与签到率（简单饼图占位） -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AppCard>
          <h2 class="text-xl font-bold mb-4">活动类型分布</h2>
          <div class="flex justify-center gap-4">
            <div class="text-center">
              <div class="w-20 h-20 rounded-full bg-blue-500 mb-2"></div>
              <div>学术类 35%</div>
            </div>
            <div class="text-center">
              <div class="w-20 h-20 rounded-full bg-green-500 mb-2"></div>
              <div>文体类 45%</div>
            </div>
            <div class="text-center">
              <div class="w-20 h-20 rounded-full bg-orange-500 mb-2"></div>
              <div>志愿类 20%</div>
            </div>
          </div>
        </AppCard>
        <AppCard>
          <h2 class="text-xl font-bold mb-4">签到率统计</h2>
          <div class="text-center">
            <div class="text-6xl font-bold text-blue-600">78%</div>
            <div class="text-gray-500 mt-2">整体签到率</div>
            <div class="mt-4 flex justify-between text-sm">
              <span>通过二维码: 65%</span>
              <span>手动签到: 13%</span>
            </div>
          </div>
        </AppCard>
      </div>
    </AppPageContainer>

    <footer class="max-w-[1440px] mx-auto px-6 py-8 mt-12 border-t border-white/10">
      <div class="flex flex-col md:flex-row justify-between gap-4 text-white/60 text-sm">
        <p>© 2026 CampusActivity 校园活动管理平台. 保留所有权利.</p>
        <div class="flex gap-6">
          <a class="hover:text-white" href="#">使用条款</a>
          <a class="hover:text-white" href="#">隐私政策</a>
          <a class="hover:text-white" href="#">系统状态</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AppButton, AppCard, AppNavbar, AppPageContainer } from '@/components/common'

const navItems = [
  { label: '首页', href: '/' },
  { label: '关于', href: '/about' },
  { label: '联系', href: '/contact' }
]

const stats = ref({
  totalActivities: 124,
  totalUsers: 3456,
  totalRegistrations: 8923
})

const trend = ref([12, 19, 15, 22, 28, 35, 42])
</script>