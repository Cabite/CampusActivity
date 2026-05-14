<script setup lang="ts">
import { AppButton, AppCard } from '@/components/common'
</script>


<template>
  <AppCard>
    <div>
      <p>组件展示</p>
      <router-link to="/AppButtonDisplay">
        <AppButton>按钮</AppButton>
      </router-link>
      <router-link to="/AppCardDisplay">
        <AppButton>卡片</AppButton>
      </router-link>
      <router-view />
    </div>
  </AppCard>
</template>


