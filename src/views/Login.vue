<script setup lang="ts">
    import { AppButton, AppCard, AppPageContainer } from '@/components'
    import Topbar from '@/layouts/Topbar.vue'
    import router from '@/router'

    import { ref } from 'vue'
    import { login } from '@/api/auth'

    const username = ref('')
    const password = ref('')

    async function handleLogin() {
      console.log('login clicked')

      const res = await login({
        username: username.value,
        password: password.value
      })

      console.log(res)

      if (res.data.code === 200) {

        localStorage.setItem(
          'token',
          res.data.data.token
        )

        alert('登录成功')
      }
    }

    function goToComponentsDisplay() {
      router.push('Components')
    }
</script>


<template>
<AppPageContainer>
  <Topbar />
  <AppCard>
    <div>
      <p>欢迎来到CampusActivity</p>
      <p>测试用户名：admin，密码：123456</p>
    </div>
      <div>
    <input v-model="username" placeholder="用户名" />

    <input
      v-model="password"
      type="password"
      placeholder="密码"
    />

    <AppButton variant="blue" @click="handleLogin">
      登录
    </AppButton>
  </div>
    <AppButton @click="goToComponentsDisplay">组件展示页</AppButton>
  </AppCard>
</AppPageContainer>
</template>


