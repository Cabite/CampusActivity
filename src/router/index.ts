import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/Login.vue'
import AppButtonDisplay from '@/views/AppButtonDisplayPage.vue'
import AppCardDisplay from '@/views/AppCardDisplayPage.vue'
import AppPageContainerDisplay from '@/views/AppPageContainerDisplayPage.vue'
import AppDialogDisplay from '@/views/AppDialogDisplayPage.vue'
import AppInputDisplay from '@/views/AppInputDisplayPage.vue'
import AppFormDisplay from '@/views/AppFormDisplayPage.vue'
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
      },
      {
        path: 'AppInputDisplay',
        name: 'AppInputDisplay',
        component: AppInputDisplay
      },
      {
        path: 'AppFormDisplay',
        name: 'AppFormDisplay',
        component: AppFormDisplay
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
