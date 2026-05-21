<script setup lang="ts">
import { AppButton, AppCard, AppPageContainer, AppNavbar } from '@/components'
</script>


<template>
<AppPageContainer>
  <AppNavbar
    brand-name="CampusActivity"
    :nav-items="[
      { label: '首页', href: '/' },
      { label: '关于', href: '/about' },
      { label: '联系', href: '/contact' }
    ]"
  />
  <AppCard>
    <div>
      <p>欢迎来到CampusActivity</p>
    </div>
  </AppCard>
</AppPageContainer>
</template>