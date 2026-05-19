import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

/*
axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.timeout = 10000
app.config.globalProperties.$axios = axios
*/

app.mount('#app')
