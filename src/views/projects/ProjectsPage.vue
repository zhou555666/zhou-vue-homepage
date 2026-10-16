<template>
  <section class="projects-center">
    <div class="center-header">
      <h2 class="center-title">项目中心</h2>
      <p class="center-subtitle">个人项目经历的浏览、详情与统计</p>
    </div>

    <!-- 嵌套路由子导航 -->
    <nav class="center-tabs">
      <RouterLink :to="{ name: 'project-list' }" class="tab-link">项目列表</RouterLink>
      <RouterLink :to="{ name: 'project-stats' }" class="tab-link">项目统计</RouterLink>
    </nav>

    <!-- 子路由出口 -->
    <RouterView />
  </section>
</template>

<script setup>
</script>

<style scoped>
.projects-center {
  margin-top: 16px;
}
.center-header {
  text-align: center;
  padding: 18px 0 6px;
}
.center-title {
  margin: 0 0 6px;
  font-size: 20px;
  color: var(--primary-deep);
}
.center-subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--text-light);
}
.center-tabs {
  display: inline-flex;
  gap: 6px;
  background: var(--primary-soft);
  padding: 4px;
  border-radius: 999px;
  margin: 14px auto 4px;
}
.center-tabs {
  display: flex;
  justify-content: center;
}
.tab-link {
  border: none;
  background: transparent;
  color: var(--text-light);
  font-size: 13px;
  padding: 6px 18px;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
/* 嵌套子路由高亮：项目列表是精确匹配 /projects/list */
.tab-link.router-link-exact-active {
  background: var(--primary);
  color: #fff;
}
</style>
