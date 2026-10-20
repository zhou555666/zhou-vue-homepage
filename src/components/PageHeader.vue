<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <el-avatar :size="38" :src="personInfo.avatarUrl" class="brand-avatar" />
        <span class="brand-name">个人主页</span>
      </div>

      <!-- 使用 Element Plus 菜单组件实现导航（router 模式，index 即路由路径） -->
      <el-menu
        mode="horizontal"
        :default-active="activeMenu"
        router
        :ellipsis="false"
        class="page-nav"
      >
        <el-menu-item index="/">个人主页</el-menu-item>
        <el-menu-item index="/projects">项目</el-menu-item>
        <el-menu-item index="/articles">文章</el-menu-item>
        <el-menu-item index="/about">关于我</el-menu-item>
      </el-menu>

      <el-button size="small" round class="theme-btn" @click="$emit('toggle-theme')">
        {{ isDarkTheme ? '切换亮色' : '切换暗色' }}
      </el-button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '../stores/profile'

const profileStore = useProfileStore()
const { personInfo } = storeToRefs(profileStore)
const route = useRoute()

const activeMenu = computed(() => {
  const p = route.path
  if (p.startsWith('/projects')) return '/projects'
  return p
})

defineProps({
  isDarkTheme: { type: Boolean, default: false }
})
defineEmits(['toggle-theme'])
</script>

<style scoped>
.topbar {
  background: var(--card);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 12px rgba(236, 72, 153, 0.10);
}
.topbar-inner {
  max-width: 880px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 10px 16px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-avatar {
  border: 2px solid var(--primary);
}
.brand-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--primary-deep);
  white-space: nowrap;
  letter-spacing: 1px;
}
.page-nav {
  border-bottom: none;
  background: var(--primary-soft);
  border-radius: 999px;
  padding: 2px 6px;
  --el-menu-active-color: #fff;
}
.page-nav :deep(.el-menu-item) {
  height: 34px;
  line-height: 34px;
  margin: 3px 2px;
  padding: 0 18px;
  border-radius: 999px;
  color: var(--text-light);
  font-size: 13px;
  justify-content: center;
}
.page-nav :deep(.el-menu-item:hover) {
  background: var(--card);
  color: var(--primary-deep);
}
.page-nav :deep(.el-menu-item.is-active) {
  background: var(--primary);
  color: #fff;
  border-bottom-color: transparent;
}
.theme-btn {
  border: 1.5px solid var(--primary);
  background: transparent;
  color: var(--primary);
  white-space: nowrap;
}
.theme-btn:hover {
  background: var(--primary);
  color: #fff;
}
</style>
