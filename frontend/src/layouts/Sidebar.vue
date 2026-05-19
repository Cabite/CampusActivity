<script setup lang="ts">
import { 
  User, 
  Home, 
  Trophy, 
  CalendarCheck,
  Award,
  Clock,
  Settings,
  LogOut,
  Bell
} from '@lucide/vue'
import { AppSidebar } from '@/components'

// 定义事件
const emit = defineEmits<{
  'nav-click': [item: any]
  'logo-click': []
}>()

// 侧边栏导航项配置
const sidebarNavItems = [
  {
    label: '个人中心',
    icon: User,
    open: true, // 默认展开
    children: [
      {
        label: '个人主页',
        icon: Home,
        href: '/profile',
        description: '查看和编辑个人资料'
      },
      {
        label: '成就与统计',
        icon: Trophy,
        href: '/profile/achievements',
        description: '查看获得的成就和活动统计',
        badge: '3',
        badgeVariant: 'primary'
      },
      {
        label: '我的活动历史',
        icon: CalendarCheck,
        href: '/profile/activities',
        description: '查看参与过的活动记录',
        badge: '12',
        badgeVariant: 'success'
      }
    ]
  },
  {
    label: '消息通知',
    icon: Bell,
    href: '/notifications',
    badge: '5',
    badgeVariant: 'danger'
  },
  {
    label: '系统设置',
    icon: Settings,
    href: '/settings'
  }
]

// 处理导航点击
const handleNavClick = (item: any) => {
  console.log('Sidebar 导航点击:', item)
  emit('nav-click', item)
  
  // 如果有 href，可以进行路由跳转
  if (item.href) {
    // 如果你使用 Vue Router，可以这样：
    // router.push(item.href)
    
    // 或者使用原生导航
    // window.location.href = item.href
  }
}

// 处理 Logo 点击
const handleLogoClick = () => {
  console.log('Sidebar Logo 点击')
  emit('logo-click')
}

// 退出登录
const handleLogout = () => {
  console.log('退出登录')
  // 处理退出登录逻辑
}
</script>

<template>
  <AppSidebar
    brand-name="CampusActivity"
    :nav-items="sidebarNavItems"
    position="left"
    variant="default"
    :collapsible="true"
    :default-collapsed="false"
    :hover-expand="true"
    :mobile-auto-collapse="true"
    :shadow="true"
    :border="true"
    :fixed="true"
    @nav-click="handleNavClick"
    @logo-click="handleLogoClick"
    @collapse-change="(collapsed) => console.log('侧边栏状态:', collapsed)"
  >
    <!-- 底部用户信息插槽 -->
    <template #footer="{ collapsed }">
      <div class="space-y-2">
        <!-- 用户信息区域 -->
        <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 mb-3">
          <div class="relative">
            <img 
              src="/src/assets/default-avatar.png" 
              alt="Avatar"
              class="h-10 w-10 rounded-full object-cover border-2 border-primary"
            />
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          
          <div v-if="!collapsed" class="flex-1 min-w-0">
            <p class="text-sm font-semibold truncate">张三</p>
            <p class="text-xs text-muted-foreground truncate">zhangsan@example.com</p>
          </div>
        </div>
        
        <!-- 退出登录按钮 -->
        <button
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 group"
          :class="{ 'justify-center': collapsed }"
          @click="handleLogout"
        >
          <LogOut class="h-5 w-5" />
          <span v-if="!collapsed" class="text-sm">退出登录</span>
        </button>
      </div>
    </template>

    <!-- 主内容插槽 -->
    <template #content>
      <slot name="content">
        <!-- 默认内容 -->
        <div class="p-6">
          <div class="bg-card rounded-lg shadow-sm p-6 mb-6">
            <h1 class="text-2xl font-bold mb-2">欢迎回来，张三！</h1>
            <p class="text-muted-foreground">
              这是 CampusActivity 平台，在这里你可以参与各种校园活动，记录你的精彩瞬间。
            </p>
          </div>

          <!-- 快捷统计卡片 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm">参与活动</p>
                  <p class="text-3xl font-bold mt-2">24</p>
                  <p class="text-blue-100 text-xs mt-1">较上月 +8</p>
                </div>
                <CalendarCheck class="h-12 w-12 text-blue-200" />
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-100 text-sm">获得成就</p>
                  <p class="text-3xl font-bold mt-2">15</p>
                  <p class="text-purple-100 text-xs mt-1">已解锁 15/30</p>
                </div>
                <Award class="h-12 w-12 text-purple-200" />
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm">活动时长</p>
                  <p class="text-3xl font-bold mt-2">128</p>
                  <p class="text-green-100 text-xs mt-1">累计小时数</p>
                </div>
                <Clock class="h-12 w-12 text-green-200" />
              </div>
            </div>
          </div>

          <!-- 最近活动 -->
          <div class="bg-card rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">最近活动</h2>
            <div class="space-y-3">
              <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CalendarCheck class="h-6 w-6 text-primary" />
                </div>
                <div class="flex-1">
                  <p class="font-medium">校园马拉松活动 {{ i }}</p>
                  <p class="text-sm text-muted-foreground">2024年{{ 10 + i }}月{{ 15 + i }}日</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-green-600">已完成</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </slot>
    </template>
  </AppSidebar>
</template>

<style scoped>
/* 你可以添加自定义样式 */
</style>