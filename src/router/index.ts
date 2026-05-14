import { createRouter, createWebHistory } from 'vue-router'

import AppButtonDisplay from '../pages/AppButtonDisplayPage.vue'
import AppCardDisplay from '../pages/AppCardDisplayPage.vue'

const routes = [
  {
    path: '/AppButtonDisplay',
    name: 'AppButtonDisplay',
    component: AppButtonDisplay
  },
  {
    path: '/AppCardDisplay',
    name: 'AppCardDisplay',
    component: AppCardDisplay
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
