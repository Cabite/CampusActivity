<!-- AppSidebar.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, Menu } from 'lucide-vue-next'
import { cn } from '@/utils'

interface NavItem {
  label: string
  href?: string
  icon?: any
  children?: NavItem[]
  open?: boolean
  badge?: string | number
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

interface Props {
  // 品牌名称
  brandName?: string
  // Logo URL
  logoUrl?: string
  // Logo 替代文本
  logoAlt?: string
  // 导航项
  navItems?: NavItem[]
  // 是否可折叠
  collapsible?: boolean
  // 默认是否折叠
  defaultCollapsed?: boolean
  // 宽度（折叠时）
  collapsedWidth?: string
  // 宽度（展开时）
  expandedWidth?: string
  // 位置
  position?: 'left' | 'right'
  // 变体
  variant?: 'default' | 'glass' | 'dark' | 'gradient'
  // 是否显示阴影
  shadow?: boolean
  // 是否显示边框
  border?: boolean
  // 是否固定
  fixed?: boolean
  // 是否悬浮展开（仅折叠时有效）
  hoverExpand?: boolean
  // 移动端自动折叠
  mobileAutoCollapse?: boolean
  // 移动端断点
  mobileBreakpoint?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  brandName: 'Brand',
  logoUrl: '/src/assets/logo.png',
  logoAlt: 'Logo',
  navItems: () => [],
  collapsible: true,
  defaultCollapsed: false,
  collapsedWidth: 'w-16',
  expandedWidth: 'w-64',
  position: 'left',
  variant: 'default',
  shadow: true,
  border: true,
  fixed: true,
  hoverExpand: true,
  mobileAutoCollapse: true,
  mobileBreakpoint: 'md'
})

const emit = defineEmits<{
  'nav-click': [item: NavItem]
  'logo-click': []
  'collapse-change': [collapsed: boolean]
}>()

// 折叠状态
const isCollapsed = ref(props.defaultCollapsed)
// 悬浮展开状态（用于 hoverExpand）
const isHovering = ref(false)
// 移动端是否显示侧边栏
const mobileSidebarOpen = ref(false)
// 是否移动端
const isMobile = ref(false)

// 实际折叠状态（考虑悬浮）
const actualCollapsed = computed(() => {
  if (props.hoverExpand && isCollapsed.value && isHovering.value) {
    return false
  }
  return isCollapsed.value
})

// 实际宽度类
const widthClass = computed(() => {
  return actualCollapsed.value ? props.collapsedWidth : props.expandedWidth
})

// 变体样式
const variantClass = computed(() => {
  const map = {
    default: 'bg-background',
    glass: 'bg-background/80 backdrop-blur-xl',
    dark: 'bg-gray-900 text-white',
    gradient: 'bg-gradient-to-b from-primary/90 to-primary/60 backdrop-blur-sm'
  }
  return map[props.variant]
})

// 位置样式
const positionClass = computed(() => {
  if (props.position === 'left') {
    return 'left-0'
  }
  return 'right-0'
})

// 移动端断点类
const mobileBreakpointValue = computed(() => {
  const map = {
    sm: 640,
    md: 768,
    lg: 1024
  }
  return map[props.mobileBreakpoint]
})

// 徽章颜色
const getBadgeClass = (variant: string = 'default') => {
  const map = {
    default: 'bg-gray-500 text-white',
    primary: 'bg-primary text-primary-foreground',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white'
  }
  return map[variant as keyof typeof map] || map.default
}

// 处理导航点击
const handleNavClick = (item: NavItem) => {
  emit('nav-click', item)
  if (item.href) {
    if (item.href.startsWith('#')) {
      const element = document.querySelector(item.href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      window.location.href = item.href
    }
  }
  
  // 移动端点击后关闭侧边栏
  if (isMobile.value) {
    mobileSidebarOpen.value = false
  }
}

// 处理 Logo 点击
const handleLogoClick = () => {
  emit('logo-click')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 切换折叠状态
const toggleCollapse = () => {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value
    emit('collapse-change', isCollapsed.value)
  }
}

// 切换移动端侧边栏
const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

// 切换子菜单（嵌套导航）
const toggleSubmenu = (item: NavItem) => {
  item.open = !item.open
}

// 检测移动端
const checkMobile = () => {
  const width = window.innerWidth
  isMobile.value = width < mobileBreakpointValue.value
  
  if (props.mobileAutoCollapse && isMobile.value) {
    mobileSidebarOpen.value = false
  }
}

// 监听窗口大小变化
const handleResize = () => {
  checkMobile()
}

// 处理键盘事件（ESC 关闭侧边栏）
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && mobileSidebarOpen.value) {
    mobileSidebarOpen.value = false
  }
}

// 点击外部关闭移动端侧边栏
const handleClickOutside = (e: MouseEvent) => {
  const sidebar = document.querySelector('.app-sidebar')
  const trigger = document.querySelector('.sidebar-trigger')
  if (mobileSidebarOpen.value && sidebar && !sidebar.contains(e.target as Node) && !trigger?.contains(e.target as Node)) {
    mobileSidebarOpen.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})

// 暴露方法给父组件
defineExpose({
  collapse: () => toggleCollapse(),
  open: () => { if (props.collapsible) isCollapsed.value = false },
  close: () => { if (props.collapsible) isCollapsed.value = true },
  toggleMobile: toggleMobileSidebar,
  isMobileSidebarOpen: mobileSidebarOpen
})
</script>

<template>
  <div>
    <!-- 移动端遮罩层 -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileSidebarOpen && isMobile"
        class="fixed inset-0 bg-black/50 z-40"
        @click="mobileSidebarOpen = false"
      />
    </transition>

    <!-- 移动端触发按钮 -->
    <button
      v-if="isMobile"
      class="sidebar-trigger fixed top-4 z-50 p-2 rounded-lg bg-background shadow-lg border"
      :class="position === 'left' ? 'left-4' : 'right-4'"
      @click="toggleMobileSidebar"
    >
      <Menu class="h-5 w-5" />
    </button>

    <!-- 侧边栏 -->
    <aside
      class="app-sidebar fixed top-0 bottom-0 z-40 transition-all duration-300 ease-in-out flex flex-col"
      :class="[
        positionClass,
        widthClass,
        variantClass,
        {
          'shadow-xl': shadow,
          'border-r': border && position === 'left',
          'border-l': border && position === 'right',
          'border-border': border,
          'translate-x-0': mobileSidebarOpen || !isMobile,
          '-translate-x-full': !mobileSidebarOpen && isMobile && position === 'left',
          'translate-x-full': !mobileSidebarOpen && isMobile && position === 'right',
          'hover:w-64': hoverExpand && isCollapsed && !actualCollapsed,
        }
      ]"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <!-- Logo 区域 -->
      <div
        class="flex items-center gap-3 p-4 border-b cursor-pointer group"
        :class="{ 'border-border': border, 'justify-center': actualCollapsed }"
        @click="handleLogoClick"
      >
        <img
          :src="logoUrl"
          :alt="logoAlt"
          class="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-105"
        />
        <transition name="fade-slide">
          <span
            v-if="!actualCollapsed"
            class="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent whitespace-nowrap"
          >
            {{ brandName }}
          </span>
        </transition>
      </div>

      <!-- 导航区域 -->
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-2">
          <template v-for="item in navItems" :key="item.label">
            <!-- 普通导航项 -->
            <li v-if="!item.children">
              <button
                @click="handleNavClick(item)"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary group relative"
                :class="{ 'justify-center': actualCollapsed }"
              >
                <component :is="item.icon" v-if="item.icon" class="h-5 w-5 shrink-0" />
                <transition name="fade-slide">
                  <span v-if="!actualCollapsed" class="text-sm font-medium">
                    {{ item.label }}
                  </span>
                </transition>
                
                <!-- 徽章 -->
                <span
                  v-if="item.badge && !actualCollapsed"
                  :class="['ml-auto px-2 py-0.5 text-xs rounded-full', getBadgeClass(item.badgeVariant)]"
                >
                  {{ item.badge }}
                </span>
                
                <!-- 悬浮提示（折叠时） -->
                <div
                  v-if="actualCollapsed"
                  class="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50"
                >
                  {{ item.label }}
                  <span v-if="item.badge" class="ml-1">({{ item.badge }})</span>
                </div>
              </button>
            </li>

            <!-- 带子菜单的导航项 -->
            <li v-else>
              <button
                @click="toggleSubmenu(item)"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                :class="{ 'justify-center': actualCollapsed }"
              >
                <component :is="item.icon" v-if="item.icon" class="h-5 w-5 shrink-0" />
                <transition name="fade-slide">
                  <span v-if="!actualCollapsed" class="text-sm font-medium flex-1 text-left">
                    {{ item.label }}
                  </span>
                </transition>
                
                <transition name="fade-slide">
                  <svg
                    v-if="!actualCollapsed"
                    class="w-4 h-4 transition-transform duration-200 shrink-0"
                    :class="{ 'rotate-180': item.open }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </transition>
              </button>
              
              <!-- 子菜单 -->
              <transition name="slide-down">
                <ul v-if="item.open && !actualCollapsed" class="ml-6 mt-1 space-y-1">
                  <li v-for="child in item.children" :key="child.label">
                    <button
                      @click="handleNavClick(child)"
                      class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary text-sm"
                    >
                      <component :is="child.icon" v-if="child.icon" class="h-4 w-4" />
                      {{ child.label }}
                      
                      <span
                        v-if="child.badge"
                        :class="['ml-auto px-2 py-0.5 text-xs rounded-full', getBadgeClass(child.badgeVariant)]"
                      >
                        {{ child.badge }}
                      </span>
                    </button>
                  </li>
                </ul>
              </transition>
            </li>
          </template>
        </ul>
      </nav>

      <!-- 底部区域（插槽） -->
      <div class="border-t p-4" :class="{ 'border-border': border }">
        <slot name="footer" :collapsed="actualCollapsed" />
      </div>

      <!-- 折叠按钮 -->
      <button
        v-if="collapsible && !isMobile"
        @click="toggleCollapse"
        class="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-background border rounded-full p-1 shadow-md hover:bg-primary/10 transition-all duration-200"
        :class="{ 'rotate-180': position === 'right' }"
      >
        <ChevronLeft v-if="position === 'left'" class="h-4 w-4" />
        <ChevronRight v-else class="h-4 w-4" />
      </button>
    </aside>

    <!-- 主内容偏移（固定侧边栏时） -->
    <div
      v-if="fixed && !isMobile"
      class="transition-all duration-300"
      :class="{
        'ml-16': position === 'left' && isCollapsed,
        'ml-64': position === 'left' && !isCollapsed,
        'mr-16': position === 'right' && isCollapsed,
        'mr-64': position === 'right' && !isCollapsed,
      }"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>