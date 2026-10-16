<script setup>
// src/App.vue
// 第二次实验：使用 Element Plus 布局组件（el-container/el-header/el-main/el-footer）
// 重构整体结构；顶栏 + 路由出口 + 底栏，具体页面由 RouterView 渲染。
import { ref, onMounted } from 'vue'
import PageHeader from './components/PageHeader.vue'
import PageFooter from './components/PageFooter.vue'

const isDarkTheme = ref(false)
const onToggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.body.classList.toggle('dark', isDarkTheme.value)
}
onMounted(() => {
  document.body.classList.toggle('dark', isDarkTheme.value)
})
</script>

<template>
  <el-container class="app-wrap">
    <el-header height="auto" class="app-header">
      <PageHeader :is-dark-theme="isDarkTheme" @toggle-theme="onToggleTheme" />
    </el-header>
    <el-main class="app-main">
      <div class="container">
        <RouterView />
      </div>
    </el-main>
    <el-footer height="auto" class="app-footer">
      <PageFooter />
    </el-footer>
  </el-container>
</template>

<style>
:root {
  --bg: #fff0f5;
  --card: #ffffff;
  --text: #4a2b3a;
  --text-light: #a3708a;
  --primary: #ec4899;
  --primary-deep: #db2777;
  --primary-soft: #fde7f1;
  --border: #f9d3e3;
  --shadow: 0 8px 24px rgba(236, 72, 153, 0.15);
  /* 让 Element Plus 主色与个人主页粉色主题一致 */
  --el-color-primary: #ec4899;
  --el-color-primary-dark-2: #db2777;
  --el-color-primary-light-3: #f2a4c6;
  --el-color-primary-light-5: #f7c4da;
  --el-color-primary-light-7: #fbe1ec;
  --el-color-primary-light-8: #fcebf2;
  --el-color-primary-light-9: #fef2f7;
}
body.dark {
  --bg: #241820;
  --card: #322431;
  --text: #f5e3ec;
  --text-light: #b995a8;
  --primary: #f472b6;
  --primary-deep: #ec4899;
  --primary-soft: #453045;
  --border: #4d3a4c;
  --shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  --el-color-primary: #f472b6;
  --el-color-primary-dark-2: #ec4899;
  --el-color-primary-light-3: #d980a9;
  --el-color-primary-light-5: #5f3d55;
  --el-color-primary-light-7: #4a3347;
  --el-color-primary-light-8: #3f2c3c;
  --el-color-primary-light-9: #382732;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  min-height: 100vh;
  padding: 20px 16px;
  background: linear-gradient(160deg, var(--bg) 60%, #ffe4ef);
  font-family: "Microsoft Yahei", sans-serif;
  color: var(--text);
  transition: background 0.4s, color 0.4s;
}
body.dark {
  background: linear-gradient(160deg, #241820 60%, #35202f);
}
.app-wrap {
  min-height: 100vh;
}
.app-header {
  padding: 0;
}
.app-main {
  padding: 0;
}
.app-footer {
  padding: 0;
}
.container {
  max-width: 880px;
  margin: 0 auto;
}
</style>
