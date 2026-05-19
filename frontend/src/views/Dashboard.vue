<script setup lang="ts">
import Topbar from '@/layouts/Topbar.vue'
import Sidebar from '@/layouts/Sidebar.vue'
import { ref } from 'vue'
import router from '@/router'

// 侧边栏引用
const sidebarRef = ref()

// 处理导航点击
const handleNavClick = (item: any) => {
  console.log('导航点击:', item)
  if (item.href) {
    router.push(item.href)
  }
}

// 处理 Logo 点击
const handleLogoClick = () => {
  console.log('Logo 点击')
  // 可以滚动到顶部或跳转首页
}

// 切换侧边栏（如果需要）
const toggleSidebar = () => {
  sidebarRef.value?.collapse()
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航栏 -->
    <Topbar />
    
    <!-- 侧边栏 + 主内容区域 -->
    <div class="pt-16">
      <Sidebar 
        ref="sidebarRef"
        @nav-click="handleNavClick"
        @logo-click="handleLogoClick"
      >
        <!-- 可以通过插槽自定义主内容 -->
        <template #content>
          <div class="p-6">
            <!-- 路由视图 - 如果你使用 Vue Router -->
            <!-- <router-view /> -->
            
            <!-- 或者直接放内容 -->
            <div class="bg-card rounded-lg shadow-sm p-6">
              <h1 class="text-2xl font-bold mb-4">欢迎使用 CampusActivity</h1>
              <p class="text-muted-foreground">
                请从左侧菜单选择功能
              </p>
            </div>
          </div>
        </template>
      </Sidebar>
    </div>
  </div>
</template>