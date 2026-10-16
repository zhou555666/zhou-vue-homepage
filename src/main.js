import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia) // 注册 Pinia，需在路由之前，保证守卫内可访问 Store
app.use(router)
app.use(ElementPlus) // 全局注册 Element Plus 组件库（第二次实验）

app.mount('#app')
