import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/activities' },
        {
          path: 'activities',
          name: 'activities',
          meta: { title: '活动查询' },
          component: () => import('@/views/ActivitiesView.vue'),
        },
        {
          path: 'activities/:id',
          name: 'activity-detail',
          meta: { title: '活动详情' },
          component: () => import('@/views/ActivityDetailView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          meta: { title: '个人主页' },
          component: () => import('@/views/ProfileView.vue'),
        },
        {
          path: 'my/history',
          name: 'my-history',
          meta: { title: '活动历史' },
          component: () => import('@/views/MyHistoryView.vue'),
        },
        {
          path: 'notifications',
          name: 'notifications',
          meta: { title: '通知与公告' },
          component: () => import('@/views/NotificationsView.vue'),
        },
        {
          path: 'achievement',
          name: 'achievement',
          meta: { title: '统计排行' },
          component: () => import('@/views/AchievementView.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/activities' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guest && auth.isLoggedIn) {
    return { name: 'activities' }
  }
  return true
})

export default router
