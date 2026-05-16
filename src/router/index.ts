import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/Login.vue'
import AppButtonDisplay from '@/views/AppButtonDisplayPage.vue'
import AppCardDisplay from '@/views/AppCardDisplayPage.vue'
import AppPageContainerDisplay from '@/views/AppPageContainerDisplayPage.vue'
import AppDialogDisplay from '@/views/AppDialogDisplayPage.vue'
import Components from '@/views/Components.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Components',
    name: 'Components',
    component: Components,
    children: [
      {
        path: 'AppButtonDisplay',
        name: 'AppButtonDisplay',
        component: AppButtonDisplay
      },
      {
        path: 'AppCardDisplay',
        name: 'AppCardDisplay',
        component: AppCardDisplay
      },
      {
        path: 'AppPageContainerDisplay',
        name: 'AppPageContainerDisplay',
        component: AppPageContainerDisplay
      },
      {
        path: 'AppDialogDisplay',
        name: 'AppDialogDisplay',
        component: AppDialogDisplay
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
